#!/usr/bin/python
from bokeh.layouts import layout, widgetbox, row
from bokeh.models import ColumnDataSource, Div
from bokeh.models.widgets import TextInput
from bokeh.io import curdoc
import geoviews as gv
import geoviews.feature as gf

import bokeh as bokeh
import pandas as pd
import xarray as xr
import holoviews as hv
import numpy as np

from cartopy import crs

from holoviews.operation.datashader import datashade, rasterize

import math
import logging

from src.plots.TriMeshPlot import TriMeshPlot
from src.plots.CurvePlot import CurvePlot

renderer = hv.renderer('bokeh').instance(mode='server',size=300)


FORMAT = '%(asctime)-15s %(clientip)s %(user)-8s %(message)s'
logging.basicConfig(format=FORMAT)
logger = logging.getLogger('ncview2')
logger.info({i.__name__:i.__version__ for i in [hv, np, pd]})

urlinput = TextInput(value="default", title="netCFD/OpenDAP Source URL:")
slVar = None
slMesh = None
slCMap = None
slAggregateFunction = None
slAggregateDimension = None
cbCoastlineOverlay = None
txTitle = None

aggregates = []

COLORMAPS = ["Blues","Inferno","Magma","Plasma","Viridis","BrBG","PiYG","PRGn","PuOr","RdBu","RdGy","RdYlBu","RdYlGn","Spectral","BuGn","BuPu","GnBu","Greens","Greys","Oranges","OrRd","PuBu","PuBuGn","PuRd","Purples","RdPu","Reds","YlGn","YlGnBu","YlOrBr","YlOrRd"]

tmPlot = None
xrData = None

class Aggregates():
    def __init__(self, dim, f):
        self.dim = dim
        self.f = f


def getURL():
    """
    Function to capsulate the url input.

    Returns:
        str: The entered data url
    """
    #url = urlinput.value
    url = "/home/max/Downloads/Test/2016033000/2016033000-ART-passive_grid_pmn_DOM01_ML_0002.nc"
    #url = "http://eos.scc.kit.edu/thredds/dodsC/polstracc0new/2016032100/2016032100-ART-passive_grid_pmn_DOM01_ML_0002.nc,http://eos.scc.kit.edu/thredds/dodsC/polstracc0new/2016033000/2016033000-ART-passive_grid_pmn_DOM01_ML_0002.nc"
    #url = "/home/max/Downloads/Test/*/*-ART-passive_grid_pmn_DOM01_ML_0002.nc"
    # Build list if multiple urls are entered
    if ',' in url:
        url = url.split(',')
    return url

def loadData(url):
    """
    Function load OPeNDAP data

    Returns:
        xarray Dataset: Loads the url as xarray Dataset
    """
    # As issue: https://github.com/pydata/xarray/issues/1385 writes, open_mfdata is much slower. Opening the
    # same file and preparing it for the curve graph is taking minutes with open_mfdataset, but seconds with open_dataset
    if '*' in url or isinstance(url,list):
        xrData = xr.open_mfdataset(url,decode_cf=False,decode_times=False)
    else:
        xrData = xr.open_dataset(url, decode_cf=False, decode_times=False)
    return xrData


def loadMesh(xrData):
    """
    Function to build up a mesh

    Returns:
        array of triangles and vertices: Builds the mesh from the loaded xrData
    """
    try:
        # If only one file is loaded has no attribute time, so we have to check this
        if hasattr(xrData.clon_bnds, "time"):
            # isel time to 0, as by globbing the clon_bnds array could have multiple times
            verts = np.column_stack((xrData.clon_bnds.isel(time=0).stack(z=('vertices','ncells')),
                                     xrData.clat_bnds.isel(time=0).stack(z=('vertices','ncells'))))
        else:
            verts = np.column_stack((xrData.clon_bnds.isel().stack(z=('vertices', 'ncells')),
                                     xrData.clat_bnds.isel().stack(z=('vertices', 'ncells'))))
    except:
        logger.error("Failed to build loadMesh():verts!")

    # Calc degrees from radians
    f = 180 / math.pi
    for v in verts:
        v[0] = v[0] * f
        v[1] = v[1] * f


    # If only one file is loaded has no attribute time, so we have to check this
    if hasattr(xrData.clon_bnds, "time"):
        # isel time to 0, as by globbing the clon_bnds array could have multiple times
        l = len(xrData.clon_bnds.isel(time=0))
    else:
        l = len(xrData.clon_bnds.isel())
    n1 = []
    n2 = []
    n3 = []

    n1 = np.arange(l)
    n2 = n1 + l
    n3 = n2 + l

    # Use n1 as dummy. It will get overwritten later.
    n = np.column_stack((n1,n2,n3,n1))

    verts = pd.DataFrame(verts,  columns=['Longitude', 'Latitude'])
    tris  = pd.DataFrame(n, columns=['v0', 'v1', 'v2',"var"], dtype = np.float64)

    # As those values are use as indecies in the verts array, they must be int, but the forth column
    # needs to be float, as it contains the data
    tris['v0'] = tris["v0"].astype(np.int32)
    tris['v1'] = tris["v1"].astype(np.int32)
    tris['v2'] = tris["v2"].astype(np.int32)

    return (tris,verts)

def preDialog():
    global slVar, slMesh, xrData

    logger.info("Started preDialog()")

    divLoading = Div(text="Loading metadata...")
    curdoc().clear()
    l = layout([
    [widgetbox(divLoading)]
    ])
    curdoc().add_root(l)

    url = getURL()

    try:
        xrData = loadData(url)
        assert xrData != None
    except:
        logger.error("Failed to load metadata for url " + url)
        divError = Div(text="Failed to load metadata for url " + url)
        curdoc().clear()
        l = layout([
        [widgetbox(divError)]
        ])
        curdoc().add_root(l)
        return


    variables = []
    # TODO implement DOM02, DOM03
    meshOptions = ["reg","calculate", "DOM1", "DOM2"]
    # TODO redundant
    for k,v in xrData.variables.items():
        variables.append(k)



    slVar = bokeh.models.Select(title="Variable", options=variables, value="TR_stn")
    slMesh = bokeh.models.Select(title="Mesh", options=meshOptions, value="DOM1")
    txPre = bokeh.models.PreText(text=str(xrData),width=800)
    btShow = bokeh.models.Button(label="show")
    btShow.on_click(mainDialog)

    if len(variables) == 0:
        logger.error("No variables found!")
        divError = Div(text="No variables found!")
        curdoc().clear()
        l = layout([
            [widgetbox(divError)]
        ])
        curdoc().add_root(l)
        return

    curdoc().clear()
    l = layout([
    [widgetbox(slVar)],
    [widgetbox(slMesh)],
    [widgetbox(txPre)],
    [widgetbox(btShow)]
    ])
    curdoc().add_root(l)

    # Simulate Click
    #mainDialog()


def variableUpdate(attr,old,new):
    """
    This function is only a wrapper round the main function for building the buildDynamicMap.
    It is called if at property like the cmap is changed and the whole buildDynamicMap needs
    to be rebuild.
    """
    variable = new
    mainDialog()


def cmapUpdate(attr, old, new):
    """
    This function is only a wrapper round the main function for building the buildDynamicMap.
    It is called if at property like the cmap is changed and the whole buildDynamicMap needs
    to be rebuild.
    """
    mainDialog()


def aggDimUpdate(attr, old, new):
    mainDialog()

def aggFnUpdate(attr, old, new):
    mainDialog()

def coastlineUpdate(new):
    logger.info("coastlineUpdate")
    mainDialog()

def mainDialog():
    """
    This function build up and manages the Main-Graph Dialog
    """
    global slVar, slCMap, txTitle, slAggregateFunction, slAggregateDimension, cbCoastlineOverlay
    global tmPlot, xrData

    logger.info("Started mainDialog()")

    btApply = bokeh.models.Button(label="apply")
    btApply.on_click(mainDialog)

    variables = []
    # TODO redundant
    for k,v in xrData.variables.items():
        variables.append(k)

    if slCMap is None:
        slCMap = bokeh.models.Select(title="Colormap", options=COLORMAPS, value=COLORMAPS[0])

    if txTitle is None:
        txTitle = bokeh.models.TextInput(value="title", title="Title:")

    txPre = bokeh.models.PreText(text=str(xrData),width=800)

    slVar.on_change("value",variableUpdate)
    slCMap.on_change("value",cmapUpdate)

    # Define aggregates
    # TODO allow other/own aggregateFunctions
    aggregateFunctions = ["None","mean","sum"]
    # TODO load this array from the data
    aggregateDimensions = ["None","lat","height"]

    if hasattr(xrData.clon_bnds, "time"):
        aggregateDimensions.append("time")

    if slAggregateFunction is None:
        slAggregateFunction = bokeh.models.Select(title="Aggregate Function", options=aggregateFunctions, value="None")
        slAggregateFunction.on_change("value", aggFnUpdate)
    if slAggregateDimension is None:
        slAggregateDimension = bokeh.models.Select(title="Aggregate Dimension", options=aggregateDimensions, value="None")
        slAggregateDimension.on_change("value", aggDimUpdate)
    if cbCoastlineOverlay is None:
        cbCoastlineOverlay = bokeh.models.CheckboxGroup(labels=["Show coastline"], active=[0])
        cbCoastlineOverlay.on_click(coastlineUpdate)

    variable = slVar.value
    title = txTitle.value
    cm = slCMap.value
    aggDim = slAggregateDimension.value
    aggFn = slAggregateFunction.value
    showCoastline = len(cbCoastlineOverlay.active) > 0

    # Showing a Loading Infotext
    divLoading = Div(text="loading buildDynamicMap...")
    curdoc().clear()
    l = layout([
        [widgetbox(divLoading)]
    ])
    curdoc().add_root(l)

    # Start loading data
    if xrData is None:
        xrData = loadData(getURL())

    # Choose if a Curve or TriMesh is to be used
    if aggDim == "lat" and aggFn != "None":
        cuPlot = CurvePlot(logger, renderer, xrData)
        plot = cuPlot.getPlotObject(variable=variable,title=title,aggDim=aggDim,aggFn=aggFn)
    else:
        if tmPlot is None:
            (tris, verts) = loadMesh(xrData)
            tmPlot = TriMeshPlot(logger, renderer, xrData, tris, verts, cm=cm)

        plot = tmPlot.getPlotObject(variable=variable,title=title,cm=cm,aggDim=aggDim,aggFn=aggFn, showCoastline=showCoastline)


    curdoc().clear()
    lArray = []
    lArray.append([widgetbox(txTitle)])
    lArray.append([widgetbox(slVar)])
    # Hide colormap option if CurvePlot is used
    if aggDim != "lat" or aggFn == "None":
        lArray.append([widgetbox(slCMap)])
        lArray.append([widgetbox(cbCoastlineOverlay)])

    lArray.append([row(slAggregateDimension,slAggregateFunction)])
    lArray.append([widgetbox(btApply)])
    lArray.append([plot.state])
    lArray.append([widgetbox(txPre)])

    l = layout(lArray)

    curdoc().add_root(l)

# This function is showing the landingpage. Here one could enter the url for the datasource.
# Entering the url is the first step in the dialog
def entry(doc):
    doc.title = 'ncview2'
    btLoad = bokeh.models.Button(label="load")
    btLoad.on_click(preDialog)
    tx = "ncview II"
    txPre = bokeh.models.PreText(text=tx,width=800)

    doc.clear()
    l = layout([
    [widgetbox(txPre)],
    [widgetbox(urlinput)],
    [widgetbox(btLoad)]
    ])
    doc.add_root(l)

    # Simulate the click
    #preDialog()


entry(curdoc())

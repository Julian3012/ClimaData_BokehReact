#!/usr/bin/python
from bokeh.layouts import layout, widgetbox, row
from bokeh.models import ColumnDataSource, Div
from bokeh.models.widgets import TextInput
from bokeh.io import curdoc
#import geoviews
#import geoviews.feature as gf

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



START = 0
LOADINGMETA = 1
LOADEDMETA = 2
LOADING = 3
LOADED = 4
ERROR = 1000

state = START

urlinput = TextInput(value="default", title="netCFD/OpenDAP Source URL:")
slVar = None
slMesh = None
slCMap = None
slAggregateFunction = None
slAggregateDimension = None
txTitle = None

aggregates = []

COLORMAPS = ["Inferno","Magma","Plasma","Viridis","BrBG","PiYG","PRGn","PuOr","RdBu","RdGy","RdYlBu","RdYlGn","Spectral","Blues","BuGn","BuPu","GnBu","Greens","Greys","Oranges","OrRd","PuBu","PuBuGn","PuRd","Purples","RdPu","Reds","YlGn","YlGnBu","YlOrBr","YlOrRd"]

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
    url = "/home/max/Downloads/2016033000-ART-passive_grid_pmn_DOM01_ML_0002.nc"
    return url

def loadData(url):
    """
    Function load OPeNDAP data

    Returns:
        xarray Dataset: Loads the url as xarray Dataset
    """
    xrData = xr.open_dataset(url,decode_cf=False)
    return xrData

def loadMesh(xrData):
    """
    Function to build up a mesh

    Returns:
        array of triangles and vertices: Builds the mesh from the loaded xrData
    """
    verts = np.column_stack((xrData.clon_bnds.stack(z=('vertices','ncells')),xrData.clat_bnds.stack(z=('vertices','ncells'))))

    #not so performant
    f = 180 / math.pi
    for v in verts:
        v[0] = v[0] * f
        v[1] = v[1] * f

    l = len(xrData.clon_bnds)
    n1 = []
    n2 = []
    n3 = []

    n1 = np.arange(l)
    n2 = n1 + l
    n3 = n2 + l

    n = np.column_stack((n1,n2,n3,n1))

    verts = pd.DataFrame(verts,  columns=['Longitude', 'Latitude'])
    tris  = pd.DataFrame(n, columns=['v0', 'v1', 'v2',"var"], dtype = np.float64)
    tris['v0'] = tris["v0"].astype(np.int32)
    tris['v1'] = tris["v1"].astype(np.int32)
    tris['v2'] = tris["v2"].astype(np.int32)
    return (tris,verts)

def prebuildDynamicMapingDialog():
    global slVar, slMesh, xrData
    state = LOADINGMETA

    divLoading = Div(text="loading metadata...")
    curdoc().clear()
    l = layout([
    [widgetbox(divLoading)]
    ])
    curdoc().add_root(l)

    try:
        xrData = xr.open_dataset(getURL(),decode_cf=False)
    except:
        divError = Div(text="Failed to load metadata")
        curdoc().clear()
        l = layout([
        [widgetbox(divError)]
        ])
        curdoc().add_root(l)
        state = ERROR
        return


    state = LOADEDMETA
    variables = ["None"]
    # TODO implement DOM02, DOM03
    meshOptions = ["calculate", "DOM1", "DOM2 (not implemented)", "DOM3 (not implemented)"]
    # TODO redundant
    for k,v in xrData.variables.items():
        variables.append(k)

    slVar = bokeh.models.Select(title="Variable", options=variables, value="None")
    slMesh = bokeh.models.Select(title="Mesh", options=meshOptions, value="DOM1")

    btShow = bokeh.models.Button(label="show")
    btShow.on_click(mainDialog)

    curdoc().clear()
    l = layout([
    [widgetbox(slVar)],
    [widgetbox(slMesh)],
    [widgetbox(btShow)]
    ])
    curdoc().add_root(l)


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

def mainDialog():
    """
    This function build up and manages the Main-Graph Dialog
    """
    global slVar, slCMap, txTitle, slAggregateFunction, slAggregateDimension
    global tmPlot, xrData

    state =LOADING

    if slVar is not None:
        variable = slVar.value
    if slCMap is not None:
        cm = slCMap.value
    else:
        cm = COLORMAPS[0]

    variables = ["None"]
    # TODO redundant
    for k,v in xrData.variables.items():
        variables.append(k)

    if slVar is None:
        slVar = bokeh.models.Select(title="Variable", options=variables, value="None")

    if slCMap is None:
        slCMap = bokeh.models.Select(title="Colormap", options=COLORMAPS, value="Magma")

    if txTitle is None:
        txTitle = bokeh.models.TextInput(value="TR_stn, height ...", title="Title:")

    txPre = bokeh.models.PreText(text=str(xrData),width=800)

    btShow = bokeh.models.Button(label="show")
    btShow.on_click(mainDialog)

    slVar.on_change("value",variableUpdate)
    slCMap.on_change("value",cmapUpdate)

    # Define aggregates
    # TODO allow other/own aggregateFunctions
    aggregateFunctions = ["None","mean","sum"]
    aggregateDimensions = ["None","lon","height"]

    if slAggregateFunction is None:
        slAggregateFunction = bokeh.models.Select(title="Aggregate Function", options=aggregateFunctions, value="None")
    if slAggregateDimension is None:
        slAggregateDimension = bokeh.models.Select(title="Aggregate Dimension", options=aggregateDimensions, value="None")

    slAggregateDimension.on_change("value",aggDimUpdate)
    slAggregateFunction.on_change("value",aggFnUpdate)

    variable = slVar.value
    title = txTitle.value
    cm = slCMap.value
    aggDim = slAggregateDimension.value
    aggFn = slAggregateFunction.value

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
    if aggDim == "lon" and aggFn != "None":
        cuPlot = CurvePlot(logger, renderer, xrData)
        plot = cuPlot.getPlotObject(variable, title, aggDim, aggFn)
    else:
        if tmPlot is None:
            (tris, verts) = loadMesh(xrData)
            tmPlot = TriMeshPlot(logger, renderer, xrData, tris, verts, cm=cm)

        plot = tmPlot.getPlotObject(variable=variable,title=title,cm=cm,aggDim=aggDim,aggFn=aggFn)



    curdoc().clear()
    lArray = []
    lArray.append([widgetbox(txTitle)])
    lArray.append([widgetbox(slVar)])
    # Hide colormap option if CurvePlot is used
    if aggDim != "lon" or aggFn == "None":
        lArray.append([widgetbox(slCMap)])

    lArray.append([row(slAggregateDimension,slAggregateFunction)])
    lArray.append([plot.state])
    lArray.append([widgetbox(txPre)])

    l = layout(lArray)

    curdoc().add_root(l)
    state = LOADED

# This function is showing the landingpage. Here one could enter the url for the datasource.
# Entering the url is the first step in the dialog
def entry(doc):
    doc.title = 'ncview2'
    btLoad = bokeh.models.Button(label="load")
    btLoad.on_click(prebuildDynamicMapingDialog)

    doc.clear()
    l = layout([
    [widgetbox(urlinput)],
    [widgetbox(btLoad)]
    ])
    doc.add_root(l)


entry(curdoc())

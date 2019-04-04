#!/usr/bin/python
from bokeh.server.server import Server
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
import time

from src.plots.TriMeshPlot import TriMeshPlot
from src.plots.CurvePlot import CurvePlot
from src.plots.HeightProfilePlot import HeightProfilePlot

hv.extension('bokeh')
renderer = hv.renderer('bokeh').instance(mode='server',size=300)

FORMAT = '%(asctime)-15s %(clientip)s %(user)-8s %(message)s'
logging.basicConfig(format=FORMAT)
logger = logging.getLogger('ncview2')
logger.info({i.__name__:i.__version__ for i in [hv, np, pd]})


#defaultinput = "http://eos.scc.kit.edu/thredds/dodsC/polstracc0new/2016033000/2016033000-ART-passive_grid_pmn_DOM01_ML_0002.nc"
#defaultinput = "eos.scc.kit.edu"
defaultinput = "/home/max/Downloads/Test/2016033000/2016033000-ART-passive_grid_pmn_DOM01_ML_0002.nc"

urlinput = TextInput(value=defaultinput, title="netCDF file -OR- OPeNDAP URL:")
slVar = None
slMesh = None
slCMap = None
slAggregateFunction = None
slAggregateDimension = None
cbCoastlineOverlay = None
cbColoring = None
cbAxis = None
txTitle = None
txFixColoringMin = None
txFixColoringMax = None
txCLevels = None

aggregates = []

COLORMAPS = ["Blues","Inferno","Magma","Plasma","Viridis","BrBG","PiYG","PRGn","PuOr","RdBu","RdGy","RdYlBu","RdYlGn","Spectral","BuGn","BuPu","GnBu","Greens","Greys","Oranges","OrRd","PuBu","PuBuGn","PuRd","Purples","RdPu","Reds","YlGn","YlGnBu","YlOrBr","YlOrRd"]

tmPlot = None
cuPlot = None
hpPlot = None
xrData = None
xrDataMeta = None

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
    url = urlinput.value
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
    start = time.time()
    # As issue: https://github.com/pydata/xarray/issues/1385 writes, open_mfdata is much slower. Opening the
    # same file and preparing it for the curve graph is taking minutes with open_mfdataset, but seconds with open_dataset
    if '*' in url or isinstance(url,list):
        logger.info("Loading with open_mfdataset")
        xrData = xr.open_mfdataset(url,decode_cf=False,decode_times=False)
    else:
        logger.info("Loading with open_data")
        xrData = xr.open_dataset(url, decode_cf=False, decode_times=False)
    end = time.time()
    logger.info("LoadData took %d" % (end - start))
    return xrData

def loadDataMeta(url):
    """
    Function load OPeNDAP data

    Returns:
        xarray Dataset: Loads the url as xarray Dataset
    """
    start = time.time()
    # As issue: https://github.com/pydata/xarray/issues/1385 writes, open_mfdata is much slower. Opening the
    # same file and preparing it for the curve graph is taking minutes with open_mfdataset, but seconds with open_dataset
    if '*' in url or isinstance(url,list):
        logger.info("Loading with open_mfdataset")
        xrData = xr.open_mfdataset(url,decode_cf=False,decode_times=False, chunks={})
    else:
        logger.info("Loading with open_data")
        xrData = xr.open_dataset(url, decode_cf=False, decode_times=False, chunks={})
    end = time.time()
    logger.info("LoadDataMeta took %d" % (end - start))
    return xrData


def preDialog():
    global slVar, slMesh, xrDataMeta
    start = time.time()
    logger.info("Started preDialog()")

    divLoading = Div(text="Loading metadata...")
    curdoc().clear()
    l = layout([
    [widgetbox(divLoading)]
    ])
    curdoc().add_root(l)

    url = getURL()

    try:
        xrDataMeta = loadDataMeta(url)
        assert xrDataMeta != None
    except:
        logger.error("Failed to load metadata for url " + url)
        divError = Div(text="Failed to load metadata for url " + url)
        curdoc().clear()
        l = layout([
        [widgetbox(divError)]
        ])
        curdoc().add_root(l)
        return


    variables = [x for x in xrDataMeta.variables.keys()]
    # TODO implement DOM02, DOM03
    meshOptions = ["DOM1", "DOM2"]
    #meshOptions = ["reg","calculate", "DOM1", "DOM2"]


    default_dom = "DOM1" if "DOM01" in urlinput.value else "DOM2"
    slVar = bokeh.models.Select(title="Variable", options=variables, value="TR_stn")
    slMesh = bokeh.models.Select(title="Mesh", options=meshOptions, value=default_dom)
    txPre = bokeh.models.PreText(text=str(xrDataMeta),width=800)
    btShow = bokeh.models.Button(label="show")
    btShow.on_click(btClick)

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
    end = time.time()
    logger.info("preDialog took %d" % (end - start))


def variableUpdate(attr,old,new):
    """
    This function is only a wrapper round the main function for building the buildDynamicMap.
    It is called if at property like the cmap is changed and the whole buildDynamicMap needs
    to be rebuild.
    """
    variable = new
    mainDialog(True)


def cmapUpdate(attr, old, new):
    """
    This function is only a wrapper round the main function for building the buildDynamicMap.
    It is called if at property like the cmap is changed and the whole buildDynamicMap needs
    to be rebuild.
    """
    mainDialog(False)


def aggDimUpdate(attr, old, new):
    global slAggregateFunction
    if slAggregateFunction.value != "None":
        mainDialog(True)
    else:
        mainDialog(False)

def aggFnUpdate(attr, old, new):
    global slAggregateDimension
    if slAggregateDimension.value != "None":
        mainDialog(True)
    else:
        mainDialog(False)

def coastlineUpdate(new):
    logger.info("coastlineUpdate")
    mainDialog(False)

def ColoringUpdate(new):
    logger.info("ColoringUpdate")
    mainDialog(False)

def btApplyClick():
    mainDialog(False)

def btClick():
    mainDialog(True)

def mainDialog(dataUpdate=True):
    """
    This function build up and manages the Main-Graph Dialog
    """

    global slVar, slCMap, txTitle, slAggregateFunction, slAggregateDimension, cbCoastlineOverlay, cbColoring, cbAxis
    global tmPlot, cuPlot, hpPlot
    global xrData, xrDataMeta
    global txFixColoringMin, txFixColoringMax, txCLevels
    try:
        start = time.time()
        logger.info("Started mainDialog()")

        btApply = bokeh.models.Button(label="apply")
        btApply.on_click(btApplyClick)

        slVar.on_change("value", variableUpdate)

        if slCMap is None:
            slCMap = bokeh.models.Select(title="Colormap", options=COLORMAPS, value=COLORMAPS[0])
            slCMap.on_change("value", cmapUpdate)

        if txTitle is None:
            txTitle = bokeh.models.TextInput(value="title", title="Title:")

        if txFixColoringMin is None:
            txFixColoringMin = bokeh.models.TextInput(value="", title="Fix color minimum:")

        if txFixColoringMax is None:
            txFixColoringMax = bokeh.models.TextInput(value="", title="Fix color maxmum:")

        if txCLevels is None:
            txCLevels = bokeh.models.TextInput(value="0", title="Colorlevels (0:inf):")

        txPre = bokeh.models.PreText(text=str(xrDataMeta),width=800)

        # Define aggregates
        # TODO allow other/own aggregateFunctions
        aggregateFunctions = ["None","mean","sum"]
        # TODO load this array from the data

        if "ML" in urlinput.value:
            height = "height"
        elif "PL" in urlinput.value:
            height = "lev"
        else:
            height = "alt"
        aggregateDimensions = ["None", height, "lat", "heightProfile"] # removed lat since it takes too long

        # time could only be aggregated if it exist
        if hasattr(xrDataMeta.clon_bnds, "time"):
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
        if cbColoring is None:
            cbColoring = bokeh.models.CheckboxGroup(labels=["Use fixed coloring","symmetric coloring","logz coloring"], active=[])
            cbColoring.on_click(ColoringUpdate)

        if cbAxis is None:
            cbAxis = bokeh.models.CheckboxGroup(labels=["logX","logY"], active=[])
            cbAxis.on_click(ColoringUpdate)

        variable = slVar.value
        title = txTitle.value
        cm = slCMap.value
        aggDim = slAggregateDimension.value
        aggFn = slAggregateFunction.value
        showCoastline = 0 in cbCoastlineOverlay.active
        useFixColoring = 0 in cbColoring.active
        cSymmetric = 1 in cbColoring.active
        cLogZ = 2 in cbColoring.active
        logX = 0 in cbAxis.active
        logY = 1 in cbAxis.active

        try:
            cLevels = int(txCLevels.value)
        except Exception as e:
            print(e)
            cLevels = 0


        try:
            fixColorMin = float(txFixColoringMin.value)
        except Exception as e:
            print(e)
            fixColorMin = None

        try:
            fixColorMax = float(txFixColoringMax.value)
        except Exception as e:
            print(e)
            fixColorMax = None

        # Showing a Loading Infotext
        divLoading = Div(text="loading buildDynamicMap...")
        curdoc().clear()
        l = layout([
            [widgetbox(divLoading)]
        ])
        curdoc().add_root(l)

        # Choose if a Curve or TriMesh is to be used
        if aggDim == "lat" and aggFn != "None":
            if xrData is None:
                logger.info("Loading unchunked data for curveplot")
                try:
                    url = getURL()
                    xrData = loadData(url)
                    assert xrData != None
                except:
                    logger.error("Error for loading unchunked data.")
            if cuPlot is None:
                logger.info("Build CurvePlot")
                cuPlot = CurvePlot(logger, renderer, xrData)
            plot = cuPlot.getPlotObject(variable=variable,title=title,aggDim=aggDim,aggFn=aggFn,logX=logX, logY=logY,dataUpdate=dataUpdate)
            logger.info("Returned plot")
        elif aggDim == "heightProfile" and aggFn != "None":
            if xrData is None:
                logger.info("Loading unchunked data for curveplot")
                try:
                    url = getURL()
                    xrData = loadData(url)
                    assert xrData != None
                except:
                    logger.error("Error for loading unchunked data.")
            if hpPlot is None:
                logger.info("Build HeightProfilePlot")
                hpPlot = HeightProfilePlot(logger, renderer, xrData)
            plot = hpPlot.getPlotObject(variable=variable, title=title,aggDim=aggDim,aggFn=aggFn,cm=cm,cSymmetric=cSymmetric,cLogZ=cLogZ,cLevels=cLevels,dataUpdate=dataUpdate)
            logger.info("Returned plot")
        else:
            if tmPlot is None:
                logger.info("Build TriMeshPlot")
                tmPlot = TriMeshPlot(logger, renderer, xrDataMeta)

            plot = tmPlot.getPlotObject(variable=variable,title=title,cm=cm,aggDim=aggDim,aggFn=aggFn, showCoastline=showCoastline, useFixColoring=useFixColoring, fixColoringMin=fixColorMin, fixColoringMax=fixColorMax,cSymmetric=cSymmetric,cLogZ=cLogZ,cLevels=cLevels,dataUpdate=dataUpdate)

        curdoc().clear()
        lArray = []
        lArray.append([row(txTitle,slVar)])
        # Hide colormap option if CurvePlot is used
        if aggDim != "lat" or aggFn == "None":
            lArray.append([widgetbox(cbCoastlineOverlay)])
            lArray.append([widgetbox(slCMap)])
            lArray.append([widgetbox(cbColoring)])
            lArray.append([widgetbox(txCLevels)])
        if useFixColoring:
            lArray.append([row(txFixColoringMin,txFixColoringMax)])

        if aggDim == "lat" or aggFn != "None":
            lArray.append([row(cbAxis)])

        lArray.append([row(slAggregateDimension,slAggregateFunction)])
        lArray.append([widgetbox(btApply)])
        lArray.append([plot.state])
        lArray.append([widgetbox(txPre)])

        l = layout(lArray)

        curdoc().add_root(l)
        end = time.time()
        logger.info("MainDialog took %d" % (end - start))
    except Exception as e:
        print(e)

# This function is showing the landingpage. Here one could enter the url for the datasource.
# Entering the url is the first step in the dialog
def entry(doc):
    try:
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
    except Exception as e:
        print(e)

#server = Server({'/': entry}, num_procs=4)
#server.start()

#if __name__ == '__main__':
#    print('Opening Bokeh application on http://localhost:5006/')
#    server.io_loop.add_callback(server.show, "/")
#    server.io_loop.start()

entry(curdoc())

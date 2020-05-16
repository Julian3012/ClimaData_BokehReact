from bokeh.server.server import Server
from bokeh.layouts import layout, widgetbox, row
from bokeh.models import ColumnDataSource, Div
from bokeh.models.widgets import TextInput
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

import json
from bokeh.embed import json_item

hv.extension("bokeh")
renderer = hv.renderer("bokeh").instance(mode="server", size=300)

FORMAT = "%(asctime)-15s %(clientip)s %(user)-8s %(message)s"
logging.basicConfig(format=FORMAT)
logger = logging.getLogger("ncview2")
logger.info({i.__name__: i.__version__ for i in [hv, np, pd]})

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
variables = None

tmPlot = None
cuPlot = None
hpPlot = None
xrData = None
xrDataMeta = None

COLORMAPS = [
    "Blues",
    "Inferno",
    "Magma",
    "Plasma",
    "Viridis",
    "BrBG",
    "PiYG",
    "PRGn",
    "PuOr",
    "RdBu",
    "RdGy",
    "RdYlBu",
    "RdYlGn",
    "Spectral",
    "BuGn",
    "BuPu",
    "GnBu",
    "Greens",
    "Greys",
    "Oranges",
    "OrRd",
    "PuBu",
    "PuBuGn",
    "PuRd",
    "Purples",
    "RdPu",
    "Reds",
    "YlGn",
    "YlGnBu",
    "YlOrBr",
    "YlOrRd",
]


def getColorMaps():
    global COLORMAPS
    return COLORMAPS


def initAll():
    global slVar, slCMap, txTitle, slAggregateFunction, slAggregateDimension
    global tmPlot, cuPlot, hpPlot, cbCoastlineOverlay, cbColoring, cbAxis
    global xrData, xrDataMeta, slMesh, variables
    global txFixColoringMin, txFixColoringMax, txCLevels

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
    variables = None

    tmPlot = None
    cuPlot = None
    hpPlot = None
    xrData = None
    xrDataMeta = None


class Aggregates:
    def __init__(self, dim, f):
        self.dim = dim
        self.f = f


def mainDialog(dataUpdate=True):
    """
    This function build up and manages the Main-Graph Dialog
    """

    global slVar, slCMap, txTitle, slAggregateFunction, slAggregateDimension, cbCoastlineOverlay, cbColoring, cbAxis
    global tmPlot, cuPlot, hpPlot
    global xrData, xrDataMeta
    global txFixColoringMin, txFixColoringMax, txCLevels

    try:
        logger.info("Started mainDialog()")
        start = time.time()

        initAll()

        # Param1
        defaultinput = "2016032700-ART-chemtracer_grid_DOM01_PL_0007.nc"
        urlinput = TextInput(value=defaultinput, title="netCDF file -OR- OPeNDAP URL:")

        link = "./data/" + defaultinput
        xrDataMeta = xr.open_dataset(link)
        logger.info("File: " + link)

        variables = [x for x in xrDataMeta.variables.keys()]

        meshOptions = ["DOM1", "DOM2"]
        default_dom = "DOM1" if "DOM01" in urlinput.value else "DOM2"

        # Param2
        slVar = bokeh.models.Select(title="Variable", options=variables, value="TR_stn")

        # Param3
        slMesh = bokeh.models.Select(
            title="Mesh", options=meshOptions, value=default_dom
        )

        # Param4
        btApply = bokeh.models.Button(label="apply")
        btApply.on_click(btApplyClick)

        # Param5
        btShow = bokeh.models.Button(label="Show Plot")
        btShow.on_click(btClick)

        slVar.on_change("value", variableUpdate)

        # Param6
        if slCMap is None:
            slCMap = bokeh.models.Select(
                title="Colormap", options=COLORMAPS, value=COLORMAPS[0]
            )
            slCMap.on_change("value", cmapUpdate)

        # Param7
        if txTitle is None:
            txTitle = bokeh.models.TextInput(value="title", title="Title:")

        # Param8
        if txFixColoringMin is None:
            txFixColoringMin = bokeh.models.TextInput(
                value="", title="Fix color minimum:"
            )

        # Param9
        if txFixColoringMax is None:
            txFixColoringMax = bokeh.models.TextInput(
                value="", title="Fix color maxmum:"
            )

        # Param10
        if txCLevels is None:
            txCLevels = bokeh.models.TextInput(value="0", title="Colorlevels (0:inf):")

        # Define aggregates
        # TODO allow other/own aggregateFunctions
        aggregateFunctions = ["None", "mean", "sum"]
        # TODO load this array from the data

        if "ML" in urlinput.value:
            height = "height"
        elif "PL" in urlinput.value:
            height = "lev"
        else:
            height = "alt"
        aggregateDimensions = [
            "None",
            height,
            "lat",
            "heightProfile",
        ]  # removed lat since it takes too long

        # time could only be aggregated if it exist
        if hasattr(xrDataMeta.clon_bnds, "time"):
            aggregateDimensions.append("time")

        # Param11
        if slAggregateFunction is None:
            slAggregateFunction = bokeh.models.Select(
                title="Aggregate Function", options=aggregateFunctions, value="None"
            )
            slAggregateFunction.on_change("value", aggFnUpdate)

        # Param12
        if slAggregateDimension is None:
            slAggregateDimension = bokeh.models.Select(
                title="Aggregate Dimension", options=aggregateDimensions, value="None"
            )
            slAggregateDimension.on_change("value", aggDimUpdate)

        # Param13
        if cbCoastlineOverlay is None:
            cbCoastlineOverlay = bokeh.models.CheckboxGroup(
                labels=["Show coastline"], active=[0]
            )
            cbCoastlineOverlay.on_click(coastlineUpdate)

        # Param14
        if cbColoring is None:
            cbColoring = bokeh.models.CheckboxGroup(
                labels=["Use fixed coloring", "symmetric coloring", "logz coloring"],
                active=[],
            )
            cbColoring.on_click(ColoringUpdate)

        # Param15
        if cbAxis is None:
            cbAxis = bokeh.models.CheckboxGroup(labels=["logX", "logY"], active=[])
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

        # Choose if a Curve or TriMesh is to be used
        if aggDim == "lat" and aggFn != "None":
            if xrData is None:
                logger.info("Loading unchunked data for curveplot")
                try:
                    link = getFile()
                    xrData = xr.open_dataset(link)
                    assert xrData != None
                except:
                    logger.error("Error for loading unchunked data.")
            if cuPlot is None:
                logger.info("Build CurvePlot")
                cuPlot = CurvePlot(logger, renderer, xrData)
            plot = cuPlot.getPlotObject(
                variable=variable,
                title=title,
                aggDim=aggDim,
                aggFn=aggFn,
                logX=logX,
                logY=logY,
                dataUpdate=dataUpdate,
            )
            logger.info("Returned plot")
        elif aggDim == "heightProfile" and aggFn != "None":
            if xrData is None:
                logger.info("Loading unchunked data for curveplot")
                try:
                    link = getFile()
                    xrData = xr.open_dataset(link)
                    assert xrData != None
                except:
                    logger.error("Error for loading unchunked data.")
            if hpPlot is None:
                logger.info("Build HeightProfilePlot")
                hpPlot = HeightProfilePlot(logger, renderer, xrData)
            plot = hpPlot.getPlotObject(
                variable=variable,
                title=title,
                aggDim=aggDim,
                aggFn=aggFn,
                cm=cm,
                cSymmetric=cSymmetric,
                cLogZ=cLogZ,
                cLevels=cLevels,
                dataUpdate=dataUpdate,
            )
        else:
            if tmPlot is None:
                logger.info("Build TriMeshPlot")
                tmPlot = TriMeshPlot(logger, renderer, xrDataMeta)
            plot = tmPlot.getPlotObject(
                variable=variable,
                title=title,
                cm=cm,
                aggDim=aggDim,
                aggFn=aggFn,
                showCoastline=showCoastline,
                useFixColoring=useFixColoring,
                fixColoringMin=fixColorMin,
                fixColoringMax=fixColorMax,
                cSymmetric=cSymmetric,
                cLogZ=cLogZ,
                cLevels=cLevels,
                dataUpdate=dataUpdate,
            )

        lArray = []
        lArray.append([plot.state])
        l = layout(lArray)

        end = time.time()
        logger.info("MainDialog took %d" % (end - start))

        return json.dumps(json_item(l, "myplot"))
    except Exception as e:
        print(e)


def variableUpdate(attr, old, new):
    """
    This function is only a wrapper round the main function for building the buildDynamicMap.
    It is called if at property like the cmap is changed and the whole buildDynamicMap needs
    to be rebuild.
    """
    global variables
    variables = new
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
    global tmPlot, cuPlot, hpPlot, xrDataMeta

    link = getFile()
    xrDataMeta = xr.open_dataset(link)

    tmPlot = cuPlot = hpPlot = None
    mainDialog(True)


def getFile():
    """
    Function to capsulate the url input.

    Returns:
        str: The entered data url
    """
    link = "./data/" + urlinput.value

    return link


# This function is showing the landingpage. Here one could enter the url for the datasource.
# Entering the url is the first step in the dialog
def entryNew(doc):
    try:
        mainDialog(True)
    except Exception as e:
        print(e)


# server = Server({'/': entry}, num_procs=4)
# server.start()

# if __name__ == "__main__":
#     app.run(debug=True)
#     # Using WSGI server to allow self contained server
#     print("Listening on HTTP port 5000")
#     http_server = WSGIServer(("", 5000), app)
#     http_server.serve_forever()

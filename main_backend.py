import bokeh as bokeh
from bokeh.server.server import Server
from bokeh.layouts import layout, widgetbox, row, column
from bokeh.models import ColumnDataSource, Div, Select, CheckboxGroup, Button, CustomJS
from bokeh.models.widgets import TextInput
from bokeh.io import curdoc

import geoviews as gv
import geoviews.feature as gf

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

class PlotGenerator:
    def __init__(self):

        # Constant
        self.COLORMAPS = [
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

        # Widget Input
        self.dataPath = "2016032700-ART-chemtracer_grid_DOM01_PL_0007.nc"
        self.urlinput = None
        self.slCMap = None
        self.txTitle = None
        self.txFixColoringMin = None
        self.txFixColoringMax = None
        self.txCLevels = None
        self.slAggregateFunction = None
        self.slAggregateDimension = None
        self.cbCoastlineOverlay = None
        self.cbFixCol = None
        self.cbSymCol = None
        self.cbLogzCol = None
        self.cbAxis = None
        self.cbCoastlineOverlay = None
        self.cbCoastlineOverlay = None
        self.slVar = None

        # Plot related
        self.variables = None
        self.tmPlot = None
        self.cuPlot = None
        self.hpPlot = None
        self.xrData = None
        self.xrDataMeta = None

        # Variable Values
        self.variable = None
        self.title = None
        self.cm = None
        self.aggDim = None
        self.aggFn = None
        self.showCoastline = None
        self.useFixColoring = None
        self.cSymmetric = None
        self.cLogZ = None
        self.logX = None
        self.logY = None

        self.widgetsInitialized = False

        hv.extension("bokeh")
        self.renderer = hv.renderer("bokeh").instance(mode="server", size=300)

        FORMAT = "%(asctime)-15s %(clientip)s %(user)-8s %(message)s"
        logging.basicConfig(format=FORMAT,level=logging.DEBUG)
        self.logger = logging.getLogger("ncview2")
        self.logger.setLevel(logging.DEBUG)
        print(self.logger)
        self.logger.info({i.__name__: i.__version__ for i in [hv, np, pd]})

    def mainDialog(self, dataUpdate=True):
        """
        This function build up and manages the Main-Graph Dialog
        """

        try:
            self.logger.info("Started mainDialog()")
            start = time.time()

            # Clear doc when update occurs
            curdoc().clear()

            # Get data
            link = "./data/" + self.dataPath
            self.xrDataMeta = xr.open_dataset(link)
            self.logger.info("File: " + link)
            self.variables = [x for x in self.xrDataMeta.variables.keys()]

            # Init widgets
            if self.widgetsInitialized == False:
                self.logger.info("Initialize widgets")
                self.generateWidgets()
                self.widgetsInitialized = True

            # Generate plot type
            plot = self.genPlot(dataUpdate)

            # Apply to layout
            lArray = []
            lArray.append([column(self.urlinput)])
            lArray.append([column(self.slMesh)])
            lArray.append([column(self.txTitle)])
            lArray.append([column(self.slVar)])

            # Hide colormap option if CurvePlot is used
            if self.aggDim != "lat" or self.aggFn == "None":
                lArray.append([column(self.cbCoastlineOverlay)])
                lArray.append([column(self.slCMap)])
                lArray.append([column(self.cbFixCol)])
                lArray.append([column(self.cbSymCol)])
                lArray.append([column(self.cbLogzCol)])
                lArray.append([column(self.txCLevels)])
            if self.useFixColoring:
                lArray.append([column(self.txFixColoringMin)])
                lArray.append([column(self.txFixColoringMax)])
            if self.aggDim == "lat" or self.aggFn != "None":
                lArray.append([column(self.cbAxis)])

            lArray.append([column(self.slAggregateDimension)])
            lArray.append([column(self.slAggregateFunction)])
            lArray.append([column(self.btShow)])

            self.logger.info("first")
            lArray.append([plot.get_root()])
            self.logger.info("get root")

            l = layout(lArray)
            # self.logger.info("layout: ",dir(layout))

            curdoc().add_root(l)

            end = time.time()
            self.logger.info("MainDialog took %d" % (end - start))
        except Exception as e:
            print(e)

    def checkInputs(self):
        """
        Checks format of inputs
        """
        try:
            cLevels = int(self.txCLevels.value)
        except Exception as e:
            print(e)
            cLevels = 0
        try:
            fixColorMin = float(self.txFixColoringMin.value)
        except Exception as e:
            print(e)
            fixColorMin = None
        try:
            fixColorMax = float(self.txFixColoringMax.value)
        except Exception as e:
            print(e)
            fixColorMax = None

        return cLevels, fixColorMin, fixColorMax

    def genPlot(self, dataUpdate):
        """
        Generate plot object depending on the data
        """
        self.variable = self.slVar.value
        self.title = self.txTitle.value
        self.cm = self.slCMap.value
        self.aggDim = self.slAggregateDimension.value
        self.aggFn = self.slAggregateFunction.value
        self.showCoastline = 0 in self.cbCoastlineOverlay.active
        self.useFixColoring = 0 in self.cbFixCol.active
        self.cSymmetric = 0 in self.cbSymCol.active
        self.cLogZ = 0 in self.cbLogzCol.active
        self.logX = 0 in self.cbAxis.active
        self.logY = 1 in self.cbAxis.active

        cLevels, fixColorMin, fixColorMax = self.checkInputs()

        if self.aggDim == "lat" and self.aggFn != "None":
            if self.xrData is None:
                self.logger.info("Loading unchunked data for curveplot")
                try:
                    link = self.getFile()
                    self.xrData = xr.open_dataset(link)
                    assert self.xrData != None
                except:
                    self.logger.error("Error for loading unchunked data.")
            if self.cuPlot is None:
                self.logger.info("Build CurvePlot")
                self.cuPlot = CurvePlot(self.logger, self.renderer, self.xrData)
            plot = self.cuPlot.getPlotObject(
                variable=self.variable,
                title=self.title,
                aggDim=self.aggDim,
                aggFn=self.aggFn,
                logX=self.logX,
                logY=self.logY,
                dataUpdate=dataUpdate,
            )
            self.logger.info("Returned plot")
        elif self.aggDim == "heightProfile" and self.aggFn != "None":
            if self.xrData is None:
                self.logger.info("Loading unchunked data for curveplot")
                try:
                    link = self.getFile()
                    self.xrData = xr.open_dataset(link)
                    assert self.xrData != None
                except:
                    self.logger.error("Error for loading unchunked data.")
            if self.hpPlot is None:
                self.logger.info("Build HeightProfilePlot")
                self.hpPlot = HeightProfilePlot(self.logger, self.renderer, self.xrData)
            plot = self.hpPlot.getPlotObject(
                variable=self.variable,
                title=self.title,
                aggDim=self.aggDim,
                aggFn=self.aggFn,
                cm=self.cm,
                cSymmetric=self.cSymmetric,
                cLogZ=self.cLogZ,
                cLevels=cLevels,
                dataUpdate=dataUpdate,
            )
        else:
            if self.tmPlot is None:
                self.logger.info("Build TriMeshPlot")
                self.tmPlot = TriMeshPlot(self.logger, self.renderer, self.xrDataMeta)
            plot = self.tmPlot.getPlotObject(
                variable=self.variable,
                title=self.title,
                cm=self.cm,
                aggDim=self.aggDim,
                aggFn=self.aggFn,
                showCoastline=self.showCoastline,
                useFixColoring=self.useFixColoring,
                fixColoringMin=fixColorMin,
                fixColoringMax=fixColorMax,
                cSymmetric=self.cSymmetric,
                cLogZ=self.cLogZ,
                cLevels=cLevels,
                dataUpdate=dataUpdate,
            )
        return plot

    def generateWidgets(self):

        # callback = CustomJS(code="console.log('Hide this')")

        self.urlinput = TextInput(
            value=self.dataPath, title="netCDF file -OR- OPeNDAP URL:"
        )
        # self.urlinput.js_on_change("hide",callback)

        self.slVar = Select(title="Variable", options=self.variables, value="TR_stn")
        self.slVar.on_change("value", self.variableUpdate)

        meshOptions = ["DOM1", "DOM2"]
        default_dom = "DOM1" if "DOM01" in self.urlinput.value else "DOM2"

        self.slMesh = Select(title="Mesh", options=meshOptions, value=default_dom)
        self.slCMap = Select(
            title="Colormap", options=self.COLORMAPS, value=self.COLORMAPS[0]
        )
        self.slCMap.on_change("value", self.cmapUpdate)
        self.txTitle = TextInput(value="title", title="Title:")
        self.txFixColoringMin = TextInput(value="", title="Fix color minimum:")
        self.txFixColoringMax = TextInput(value="", title="Fix color maxmum:")
        self.txCLevels = TextInput(value="0", title="Colorlevels (0:inf):")

        aggregateFunctions = ["None", "mean", "sum"]
        aggregateDimensions = self.getAggDim()

        self.slAggregateFunction = Select(
            title="Aggregate Function", options=aggregateFunctions, value="None"
        )
        self.slAggregateFunction.on_change("value", self.aggFnUpdate)

        self.slAggregateDimension = Select(
            title="Aggregate Dimension", options=aggregateDimensions, value="None",
        )
        self.slAggregateDimension.on_change("value", self.aggDimUpdate)

        self.cbCoastlineOverlay = CheckboxGroup(labels=["Show coastline"], active=[0])
        self.cbCoastlineOverlay.on_click(self.coastlineUpdate)


        self.cbFixCol = CheckboxGroup(labels=["Use fixed coloring"], active=[])
        self.cbFixCol.on_click(self.coloringUpdate)

        self.cbSymCol = CheckboxGroup(labels=["symmetric coloring"], active=[])
        self.cbSymCol.on_click(self.coloringUpdate)

        self.cbLogzCol = CheckboxGroup(labels=["logz coloring"], active=[])
        self.cbLogzCol.on_click(self.coloringUpdate)

        # self.cbColoring = CheckboxGroup(
        #     labels=["Use fixed coloring", "symmetric coloring", "logz coloring",],
        #     active=[],
        # )
        # self.cbColoring.on_click(self.coloringUpdate)

        self.cbAxis = CheckboxGroup(labels=["logX", "logY"], active=[])
        self.cbAxis.on_click(self.coloringUpdate)

        self.btShow = Button(label="Get New Plot")
        self.btShow.on_click(self.btClick)

    def getAggDim(self):
        """
        Get aggregate dimensions
        """
        if "ML" in self.dataPath:
            height = "height"
        elif "PL" in self.dataPath:
            height = "lev"
        else:
            height = "alt"

        aggregateDimensions = [
            "None",
            height,
            "lat",
            "heightProfile",
        ]

        # time can only be aggregated if it exist
        if hasattr(self.xrDataMeta.clon_bnds, "time"):
            aggregateDimensions.append("time")

        return aggregateDimensions

    def variableUpdate(self, attr, old, new):
        """
        This function is only a wrapper round the self.main function for building the buildDynamicMap.
        It is called if at property like the cmap is changed and the whole buildDynamicMap needs
        to be rebuild.
        """
        self.variables = new
        self.mainDialog(True)

    def cmapUpdate(self, attr, old, new):
        """
        This function is only a wrapper round the self.main function for building the buildDynamicMap.
        It is called if at property like the cmap is changed and the whole buildDynamicMap needs
        to be rebuild.
        """
        self.mainDialog(False)

    def aggDimUpdate(self, attr, old, new):
        if self.slAggregateFunction.value != "None":
            self.mainDialog(True)
        else:
            self.mainDialog(False)

    def aggFnUpdate(self, attr, old, new):
        if self.slAggregateDimension.value != "None":
            self.mainDialog(True)
        else:
            self.mainDialog(False)

    def coastlineUpdate(self, new):
        self.logger.info("coastlineUpdate")
        self.mainDialog(False)

    def coloringUpdate(self, new):
        self.logger.info("ColoringUpdate")
        self.mainDialog(False)

    def btApplyClick(self):
        self.mainDialog(False)

    def btClick(self):
        link = self.getFile()
        self.xrDataMeta = xr.open_dataset(link)
        self.tmPlot = self.cuPlot = self.hpPlot = None
        self.mainDialog(True)

    def getFile(self):
        """
        Function to capsulate the url input.

        Returns:
            str: The entered data url
        """
        link = "./data/" + self.dataPath

        return link


# Define the main method here
def entry():
    try:
        plot1 = PlotGenerator()
        plot1.mainDialog(True)
    except Exception as e:
        print(e)

entry()
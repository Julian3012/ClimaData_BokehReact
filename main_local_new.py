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

class PlotGenerator():
    def __init__(self):
        self.slVar = "TR_stn"
        self.slMesh = None
        self.slCMap = "Blues"
        self.slAggregateFunction = "None"
        self.slAggregateDimension = "None"
        self.cbCoastlineOverlay = True
        self.cbColoring = [False,False,False]
        self.cbAxis = None
        self.txFixColoringMin = ""
        self.txFixColoringMax = ""
        self.txCLevels = 0   # colorlevels                   
        self.variables = None
        self.tmPlot = None
        self.cuPlot = None
        self.hpPlot = None
        self.xrData = None
        self.xrDataMeta = None
        self.defaultinput = "2016032700-ART-chemtracer_grid_DOM01_PL_0007.nc"

        hv.extension("bokeh")
        self.renderer = hv.renderer("bokeh").instance(mode="server", size=300)

        FORMAT = "%(asctime)-15s %(clientip)s %(user)-8s %(message)s"
        logging.basicConfig(format=FORMAT)
        self.logger = logging.getLogger("ncview2")
        self.logger.info({i.__name__: i.__version__ for i in [hv, np, pd]})


    def mainDialog(self, dataUpdate=True):
        """
        This function build up and manages the Main-Graph Dialog
        """

        try:
            self.logger.info("Started mainDialog()")
            start = time.time()

            link = "./data/" + self.defaultinput
            self.xrDataMeta = xr.open_dataset(link)
            self.logger.info("File: " + link)

            self.variables = [x for x in self.xrDataMeta.variables.keys()]

            # Param15
            if self.cbAxis is None:
                self.cbAxis = bokeh.models.CheckboxGroup(labels=["logX", "logY"], active=[])
                self.cbAxis.on_click(self.coloringUpdate)

            variable = self.slVar
            cm = self.slCMap
            aggDim = self.slAggregateDimension
            aggFn = self.slAggregateFunction
            showCoastline = self.cbCoastlineOverlay
            useFixColoring = self.cbColoring[0]
            cSymmetric = self.cbColoring[1]
            cLogZ = self.cbColoring[2]

            logX = 0 in self.cbAxis.active
            logY = 1 in self.cbAxis.active

            try:
                cLevels = int(self.txCLevels)
            except Exception as e:
                print(e)
                cLevels = 0

            # Choose if a Curve or TriMesh is to be used
            if aggDim == "lat" and aggFn != "None":
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
                    variable=variable,
                    title="title",
                    aggDim=aggDim,
                    aggFn=aggFn,
                    logX=logX,
                    logY=logY,
                    dataUpdate=dataUpdate,
                )
                self.logger.info("Returned plot")
            elif aggDim == "heightProfile" and aggFn != "None":
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
                    variable=variable,
                    title="title",
                    aggDim=aggDim,
                    aggFn=aggFn,
                    cm=cm,
                    cSymmetric=cSymmetric,
                    cLogZ=cLogZ,
                    cLevels=cLevels,
                    dataUpdate=dataUpdate,
                )
            else:
                if self.tmPlot is None:
                    self.logger.info("Build TriMeshPlot")
                    self.tmPlot = TriMeshPlot(self.logger, self.renderer, self.xrDataMeta)
                plot = self.tmPlot.getPlotObject(
                    variable=variable,
                    title="title",
                    cm=cm,
                    aggDim=aggDim,
                    aggFn=aggFn,
                    showCoastline=showCoastline,
                    useFixColoring=useFixColoring,
                    fixColoringMin=self.txFixColoringMin,
                    fixColoringMax=self.txFixColoringMax,
                    cSymmetric=cSymmetric,
                    cLogZ=cLogZ,
                    cLevels=cLevels,
                    dataUpdate=dataUpdate,
                )

            lArray = []
            lArray.append([plot.state])
            l = layout(lArray)

            end = time.time()
            self.logger.info("MainDialog took %d" % (end - start))

            return json.dumps(json_item(l, "myplot"))
        except Exception as e:
            print(e)

    # Getter 
    def getVariables(self, ):
        """
        Get self.variables for front-end
        """
        return self.variables

    def getAggDim(self, ):
        """
        Get dimensions for front-end
        """
        if "ML" in self.defaultinput:
                height = "height"
        elif "PL" in self.defaultinput:
            height = "lev"
        else:
            height = "alt"

        aggregateDimensions = [
            "None",
            height,
            "lat",
            "heightProfile",
        ] 

        # time could only be aggregated if it exist
        if hasattr(self.xrDataMeta.clon_bnds, "time"):
            aggregateDimensions.append("time")

        return aggregateDimensions

    # Setter
    def setFixCol(self, bool):
        self.cbColoring[0] = bool

    def setSymCol(self, bool):
        self.cbColoring[1] = bool

    def setLogZCol(self, bool):
        self.cbColoring[2] = bool

    def setColorMaps(self, color):
        self.slCMap = color

    def setInputData(self, link):
        self.defaultinput = link

    def setslVar(self, newslVar):
        self.slVar = newslVar

    def setAggregateFunction(self, aggregate):
        self.slAggregateFunction = aggregate

    def setAggregateDimension(self, dim):
        self.slAggregateDimension = dim

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
        link = "./data/" + self.defaultinput

        return link

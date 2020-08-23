import json
import logging
import math
import time

import bokeh as bokeh
import geoviews as gv
import geoviews.feature as gf
import holoviews as hv
import numpy as np
import pandas as pd
import xarray as xr
from bokeh.io import curdoc
from bokeh.layouts import column, layout, row, widgetbox
from bokeh.models import (Button, CheckboxGroup, ColumnDataSource, CustomJS,
                          Div, Select)
from bokeh.models.widgets import TextInput
from bokeh.server.server import Server
from bokeh.themes.theme import Theme
from cartopy import crs
from holoviews.operation.datashader import datashade, rasterize

from constants import COLORMAPS
from src.plots.CurvePlot import CurvePlot
from src.plots.HeightProfilePlot import HeightProfilePlot
from src.plots.TriMeshPlot import TriMeshPlot


class PlotObject():

    def __init__(self, logger, title, dataPath = ""):

        # TODO: Add Styling from themes.Bokeh
        hv.extension("bokeh")
        self.renderer = hv.renderer("bokeh").instance(mode="server", size=300)
        self.logger = logger

         # Constant
        self.COLORMAPS = COLORMAPS

        # Parameter
        self.dataPath = dataPath
        self.urlinput = None
        self.slCMap = None
        self.txFixColoringMin = None
        self.txFixColoringMax = None
        self.txCLevels = None
        self.slAggregateFunction = None
        self.slAggregateDimension = None
        self.cbCoastlineOverlay = None
        self.cbFixCol = None
        self.cbSymCol = None
        self.cbLogzCol = None
        self.cbLogX = None
        self.cbLogY = None
        self.cbCoastlineOverlay = None
        self.slVar = None

        # Plot variables
        self.variable = None
        self.cm = None
        self.aggDim = "None"
        self.aggFn = None
        self.showCoastline = None
        self.useFixColoring = None
        self.cSymmetric = None
        self.cLogZ = None
        self.logX = None
        self.logY = None
        self.title = title

        # Val Dict
        self.optVariables = ["clon"]
        self.optAggDim = ["None"]
        self.optAggFun = ["None", "mean", "sum"]

        self.val_dict = {
            "variable": "clon",
            "cm": self.COLORMAPS[0],
            "aggDim": self.optAggDim[0],
            "aggFn": self.optAggFun[0],
            "showCoastline": [0],
            "fcol": [],
            "scol": [],
            "lcol": [],
            "logX": [],
            "logY": [],
            "cl": "0",
        }

        # Plot related
        self.plot = None
        self.tmPlot = None
        self.cuPlot = None
        self.hpPlot = None
        self.xrData = None
        self.xrDataMeta = None

    def generate_Parameters(self):

        self.urlinput = TextInput(value=self.dataPath, title="File")
        self.slVar = Select(
            title="Variable", options=self.optVariables, value=self.val_dict["variable"]
        )

        self.slCMap = Select(
            title="Colormap", options=self.COLORMAPS, value=self.val_dict["cm"]
        )

        self.txFixColoringMin = TextInput(value="", title="Fix color minimum:")
        self.txFixColoringMax = TextInput(value="", title="Fix color maxmum:")

        self.txCLevels = TextInput(value=self.val_dict["cl"], title="Colorlevels")

        self.optAggDim = self.getAggDim()

        self.slAggregateFunction = Select(
            title="Aggregate Function",
            options=self.optAggFun,
            value=self.val_dict["aggFn"],
        )

        self.slAggregateDimension = Select(
            title="Aggregate Dimension",
            options=self.optAggDim,
            value=self.val_dict["aggDim"],
        )

        self.cbCoastlineOverlay = CheckboxGroup(labels=["Show coastline"], active=[0])

        self.cbFixCol = CheckboxGroup(
            labels=["Use fixed coloring"], active=self.val_dict["fcol"]
        )

        self.cbSymCol = CheckboxGroup(
            labels=["symmetric coloring"], active=self.val_dict["scol"]
        )

        self.cbLogzCol = CheckboxGroup(
            labels=["logz coloring"], active=self.val_dict["lcol"]
        )

        self.cbLogX = CheckboxGroup(labels=["logX"], active=self.val_dict["logX"])

        self.cbLogY = CheckboxGroup(labels=["logY"], active=self.val_dict["logY"])


    def disableWidgets(self):
        # Hide colormap option if CurvePlot is used
        if self.aggDim != "lat" or self.aggFn == "None":
            self.cbCoastlineOverlay.disabled = False
            self.slCMap.disabled = False
            self.cbFixCol.disabled = False
            self.cbSymCol.disabled = False
            self.cbLogzCol.disabled = False
            self.txCLevels.disabled = False
        else:
            self.cbCoastlineOverlay.disabled = True
            self.slCMap.disabled = True
            self.cbFixCol.disabled = True
            self.cbSymCol.disabled = True
            self.cbLogzCol.disabled = True
            self.txCLevels.disabled = True

        if self.useFixColoring:
            self.txFixColoringMin.disabled = False
            self.txFixColoringMax.disabled = False
        else:
            self.txFixColoringMin.disabled = True
            self.txFixColoringMax.disabled = True

        if self.aggDim == "lat" or self.aggFn != "None":
            self.cbLogX.disabled = False
            self.cbLogY.disabled = False
        else:
            self.cbLogX.disabled = True
            self.cbLogY.disabled = True
    
    def checkInputs(self):
        """
        Checks format of inputs
        """
        try:
            cLevels = int(self.txCLevels.value)
        except Exception as e:
            self.logger.info(e)
            cLevels = 0
        try:
            fixColorMin = float(self.txFixColoringMin.value)
        except Exception as e:
            self.logger.info(e)
            fixColorMin = None
        try:
            fixColorMax = float(self.txFixColoringMax.value)
        except Exception as e:
            self.logger.info(e)
            fixColorMax = None

        return cLevels, fixColorMin, fixColorMax
    
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
        try:
            if hasattr(self.xrDataMeta.clon_bnds, "time"):
                aggregateDimensions.append("time")
        except Exception as e:
            pass

        return aggregateDimensions


    def getFile(self):
        """
        Function to capsulate the url input.
        Returns:
            str: The entered data url
        """
        link = "./data/" + self.dataPath

        return link

    def fileUpdate(self, attr, old, new):
        """
        
        """
        try: 
            curdoc().clear()
            self.__init__(logger=self.logger, title=self.title, dataPath=new)
        except Exception as e: 
            self.logger.info(e)

    def genPlot(self, dataUpdate):
        """
        Generate plot object depending on the data
        """
        self.variable = self.slVar.value
        self.cm = self.slCMap.value
        self.aggDim = self.slAggregateDimension.value
        self.aggFn = self.slAggregateFunction.value
        self.showCoastline = 0 in self.cbCoastlineOverlay.active
        self.useFixColoring = 0 in self.cbFixCol.active
        self.cSymmetric = 0 in self.cbSymCol.active
        self.cLogZ = 0 in self.cbLogzCol.active
        self.logX = 0 in self.cbLogX.active
        self.logY = 0 in self.cbLogY.active

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



    def variableUpdate(self, attr, old, new):
        self.val_dict["variable"] = new

    def cmapUpdate(self, attr, old, new):
        self.val_dict["cm"] = new

    def aggDimUpdate(self, attr, old, new):
        self.val_dict["aggDim"] = new

    def aggFnUpdate(self, attr, old, new):
        self.val_dict["aggFn"] = new

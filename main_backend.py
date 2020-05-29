import bokeh as bokeh
from bokeh.server.server import Server
from bokeh.layouts import layout, widgetbox, row, column
from bokeh.models import ColumnDataSource, Div
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
from bokeh.embed import json_item


class PlotGenerator:
    def __init__(self):

        self.parameter = {
            "dataPath": "2016032700-ART-chemtracer_grid_DOM01_PL_0007.nc",
            "mesh": "DOM1",
            "variable": "TR_stn",
            "showCoastline": True,
            "colorMap": "Blues",
            "fixColoring": False,
            "symColoring": False,
            "logzColoring": False,
            "colorLevels": 0,
            "aggregateDim": "None",
            "aggregateFun": "None",
            "aggDimSelect": [],
            "variables": [],
        }
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

        self.slCMap = None 
        self.txTitle = None 
        self.txFixColoringMin = None 
        self.txFixColoringMax = None 
        self.txCLevels = None 
        self.slAggregateFunction = None 
        self.slAggregateDimension = None 
        self.cbCoastlineOverlay = None 
        self.cbColoring = None 
        self.cbAxis = None 
        self.cbCoastlineOverlay = None 
        self.cbCoastlineOverlay = None

        self.cbAxis = None
        self.txFixColoringMin = ""
        self.txFixColoringMax = ""
        self.variables = None
        self.tmPlot = None
        self.cuPlot = None
        self.hpPlot = None
        self.xrData = None
        self.xrDataMeta = None

        # hv.extension("bokeh")
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
            

            link = "./data/" + self.parameter["dataPath"]
            self.xrDataMeta = xr.open_dataset(link)

            self.logger.info("File: " + link)

            self.variables = [x for x in self.xrDataMeta.variables.keys()]


            #====================================================================
            urlinput = TextInput(
                value=self.parameter["dataPath"], title="netCDF file -OR- OPeNDAP URL:"
            )

            # define Widgets
            slVar = bokeh.models.Select(
                title="Variable", options=self.variables, value="TR_stn"
            )
            slVar.on_change("value", self.variableUpdate)

            meshOptions = ["DOM1", "DOM2"]
            default_dom = "DOM1" if "DOM01" in urlinput.value else "DOM2"
            slMesh = bokeh.models.Select(
                title="Mesh", options=meshOptions, value=default_dom
            )

            if self.slCMap is None:
                self.slCMap = bokeh.models.Select(
                    title="Colormap", options=self.COLORMAPS, value=self.COLORMAPS[0]
                )
                self.slCMap.on_change("value", self.cmapUpdate)

            if self.txTitle is None:
                self.txTitle = bokeh.models.TextInput(value="title", title="Title:")

            if self.txFixColoringMin is None:
                self.txFixColoringMin = bokeh.models.TextInput(
                    value="", title="Fix color minimum:"
                )

            if self.txFixColoringMax is None:
                self.txFixColoringMax = bokeh.models.TextInput(
                    value="", title="Fix color maxmum:"
                )

            if self.txCLevels is None:
                self.txCLevels = bokeh.models.TextInput(
                    value="0", title="Colorlevels (0:inf):"
                )

            aggregateFunctions = ["None", "mean", "sum"]

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
            if hasattr(self.xrDataMeta.clon_bnds, "time"):
                aggregateDimensions.append("time")

            if self.slAggregateFunction is None:
                self.slAggregateFunction = bokeh.models.Select(
                    title="Aggregate Function", options=aggregateFunctions, value="None"
                )
                self.slAggregateFunction.on_change("value", self.aggFnUpdate)
            if self.slAggregateDimension is None:
                self.slAggregateDimension = bokeh.models.Select(
                    title="Aggregate Dimension",
                    options=aggregateDimensions,
                    value="None",
                )
                self.slAggregateDimension.on_change("value", self.aggDimUpdate)
            if self.cbCoastlineOverlay is None:
                self.cbCoastlineOverlay = bokeh.models.CheckboxGroup(
                    labels=["Show coastline"], active=[0]
                )
                self.cbCoastlineOverlay.on_click(self.coastlineUpdate)
            if self.cbColoring is None:
                self.cbColoring = bokeh.models.CheckboxGroup(
                    labels=[
                        "Use fixed coloring",
                        "symmetric coloring",
                        "logz coloring",
                    ],
                    active=[],
                )
                self.cbColoring.on_click(self.coloringUpdate)

            if self.cbAxis is None:
                self.cbAxis = bokeh.models.CheckboxGroup(labels=["logX", "logY"], active=[])
                self.cbAxis.on_click(self.coloringUpdate)

            btShow = bokeh.models.Button(label="Get New Plot")
            btShow.on_click(self.btClick)
            #====================================================================


            variable = slVar.value
            title = self.txTitle.value
            cm = self.slCMap.value
            aggDim = self.slAggregateDimension.value
            aggFn = self.slAggregateFunction.value
            showCoastline = 0 in self.cbCoastlineOverlay.active
            useFixColoring = 0 in self.cbColoring.active
            cSymmetric = 1 in self.cbColoring.active
            cLogZ = 2 in self.cbColoring.active
            logX = 0 in self.cbAxis.active
            logY = 1 in self.cbAxis.active

            try:
                cLevels = int(self.txCLevels.value)
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
                    self.hpPlot = HeightProfilePlot(
                        self.logger, self.renderer, self.xrData
                    )
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
                    self.tmPlot = TriMeshPlot(
                        self.logger, self.renderer, self.xrDataMeta
                    )
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

            

            # implement in layout
            lArray = []

            lArray.append([column(urlinput)])
            lArray.append([column(slMesh)])

            lArray.append([row(self.txTitle, slVar)])

            # Hide colormap option if CurvePlot is used
            if aggDim != "lat" or aggFn == "None":
                lArray.append([column(self.cbCoastlineOverlay)])
                lArray.append([column(self.slCMap)])
                lArray.append([column(self.cbColoring)])
                lArray.append([column(self.txCLevels)])
            if useFixColoring:
                lArray.append([row(self.txFixColoringMin, self.txFixColoringMax)])

            if aggDim == "lat" or aggFn != "None":
                lArray.append([row(self.cbAxis)])

            lArray.append([row(self.slAggregateDimension, self.slAggregateFunction)])
            lArray.append([column(btShow)])


            lArray.append([plot.state])
            l = layout(lArray)

            curdoc().add_root(l)
            end = time.time()
            self.logger.info("MainDialog took %d" % (end - start))

            # script, div = components(plot)
            # return json.dumps(json_item(l, "myplot"))
            # return json.dumps(json_item(l))
        except Exception as e:
            print(e)

    # Getter
    def getVariables(self):
        """
        Get self.variables for front-end
        """
        arr_var = []
        try:
            for i in self.variables:
                arr_var.append({"value": i, "label": i})
        except:
            self.logger.error("getAggDim(): Please call MainDialog() first.")

        return json.dumps(arr_var)

    def getAggDim(self):
        """
        Get dimensions for front-end
        """
        if "ML" in self.parameter["dataPath"]:
            height = "height"
        elif "PL" in self.parameter["dataPath"]:
            height = "lev"
        else:
            height = "alt"

        aggregateDimensions = [
            "None",
            height,
            "lat",
            "heightProfile",
        ]

        aggregateDimensions = [
            {"value": "None", "label": "None"},
            {"value": height, "label": height},
            {"value": "lat", "label": "lat"},
            {"value": "heightProfile", "label": "heightProfile"},
        ]

        # time could only be aggregated if it exist
        try:
            if hasattr(self.xrDataMeta.clon_bnds, "time"):
                aggregateDimensions.append({"value": "time", "label": "time"})
        except:
            # print(e)
            self.logger.error("getAggDim(): Please call MainDialog() first.")

        self.logger.info("Retrieve aggregate dimensions")

        return json.dumps(aggregateDimensions)

    # Setter
    def setParams(self, param):
        self.parameter = param

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
        link = "./data/" + self.parameter["dataPath"]

        return link


plot1 = PlotGenerator()
plot1.mainDialog(True)

import holoviews as hv
import xarray as xr
from bokeh.io import curdoc
from bokeh.models import CheckboxGroup, Select
from bokeh.models.widgets import TextInput
from constants import COLORMAPS
from src.plots.CurvePlot import CurvePlot
from src.plots.HeightProfilePlot import HeightProfilePlot
from src.plots.TriMeshPlot import TriMeshPlot
hv.extension("bokeh")


class PlotObject:
    """
    Class calculates plots and parameters dependingon the input it gets
    from main_backend.py
    """

    def __init__(self, logger, title, dataPath=""):

        self.renderer = hv.renderer("bokeh").instance(mode="server")
        self.logger = logger

        self.logger.info(f"[PlotObject] Constructor {title}")

        # Plot ranges
        self.range_dict = {
            "x_start": None,
            "x_end": None,
            "y_start": None,
            "y_end": None
        }

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
        self.cbLogX = None
        self.cbLogY = None
        self.cbCoastlineOverlay = None
        self.slVar = None
        self.delPl = None

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
        self.optVariables = [""]
        self.optAggDim = ["None"]
        self.optAggFun = ["None", "mean", "sum"]

        self.val_dict = {
            "variable": "",
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
            "delPl": [],
        }

        # Plot related
        self.plot = None
        self.tmPlot = None
        self.cuPlot = None
        self.hpPlot = None
        self.xrData = None
        self.xrDataMeta = None

    def generate_Parameters(self):
        """
        Generate parameters.

        Full list:
        1. urlinput: textfield for datapath
        2. slVar: selection for variable
        3. slCMap: selection for colormap
        4. txFixColoringMin: minimum fixcoloring
        5. txFixColoringMax: maximum fixcoloring
        6. slAggregateFunction: selection for aggregate function
        7. slAggregateDimension: selection for aggregate dimension
        8. cbFixCol: checkbox to enable 4. and 5.
        9. cbSymCol: checkbox for symmetric coloring
        10. cbLogZCol: checkbox for logarithmic coloring
        11. cbLogX: checkbox to transform curveplot
        12. cbLogY: checkbox to transform curveplot
        """
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

        self.cbLogX = CheckboxGroup(labels=["logX"], active=self.val_dict["logX"])
        self.cbLogY = CheckboxGroup(labels=["logY"], active=self.val_dict["logY"])
        self.cbDelPl = CheckboxGroup(labels=["delete_Plot"], active=self.val_dict["delPl"])

    def checkInputs(self):
        """
        Checks format of inputs.
        """
        try:
            cLevels = int(self.txCLevels.value)
        except Exception as e:
            self.logger.exception(e)
            cLevels = 0
        try:
            fixColorMin = float(self.txFixColoringMin.value)
        except Exception as e:
            self.logger.exception(e)
            fixColorMin = None
        try:
            fixColorMax = float(self.txFixColoringMax.value)
        except Exception as e:
            self.logger.exception(e)
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
            if self.xrDataMeta is not None and hasattr(self.xrDataMeta.clon_bnds, "time"):
                aggregateDimensions.append("time")
        except Exception as e:
            self.logger.exception(e)

        return aggregateDimensions

    def get_filepath(self):
        """
        Function to capsulate the url input.\n
        Returns:
            str: The entered data url
        """
        link = "./data/" + self.dataPath

        return link

    def genPlot(self, dataUpdate, cl, fc, sym, logz):
        """
        Generate plot object depending on the data.

        PARAMETER
        ========================
        dataUpdate: Bool \n
        cl: Array \n
            Coastline
        fc: Array \n
            Fix coloring
        sym: Array \n
            Symmetric coloring
        logz: Array \n
            Logz coloring
        """
        try:
            self.variable = self.slVar.value
            self.cm = self.slCMap.value
            self.aggDim = self.slAggregateDimension.value
            self.aggFn = self.slAggregateFunction.value
            self.showCoastline = 0 in cl
            self.useFixColoring = 0 in fc
            self.cSymmetric = 0 in sym
            self.cLogZ = 0 in logz
            self.logX = 0 in self.cbLogX.active
            self.logY = 0 in self.cbLogY.active

            cLevels, fixColorMin, fixColorMax = self.checkInputs()

            if self.aggDim == "lat" and self.aggFn != "None":
                if self.xrData is None:
                    self.logger.info("Loading unchunked data for curveplot")
                    try:
                        link = self.get_filepath()
                        self.xrData = xr.open_dataset(link)
                        assert self.xrData is not None
                    except:
                        self.logger.error("Error for loading unchunked data.")
                if self.cuPlot is None:
                    self.logger.info("Build CurvePlot")
                    self.cuPlot = CurvePlot(self.logger, self.renderer, self.xrData)
                self.plot = self.cuPlot.getPlotObject(
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
                        link = self.get_filepath()
                        self.xrData = xr.open_dataset(link)
                        assert self.xrData is not None
                    except:
                        self.logger.error("Error for loading unchunked data.")
                if self.hpPlot is None:
                    self.logger.info("Build HeightProfilePlot")
                    self.hpPlot = HeightProfilePlot(
                        self.logger, self.renderer, self.xrData
                    )
                self.plot = self.hpPlot.getPlotObject(
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
                    self.tmPlot = TriMeshPlot(
                        self.logger, self.renderer, self.xrDataMeta
                    )
                self.plot = self.tmPlot.getPlotObject(
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

            self.adjustRanges()

            return self.plot
        except Exception as e:
            self.logger.exception(e)
            self.__init__(self.logger, self.title)
            return ""

    def fileUpdate(self, _a, _b, new):
        """
        Handler for urlinput.
        """
        try:
            curdoc().clear()
            self.__init__(logger=self.logger, title=self.title, dataPath=new)
        except Exception as e:
            self.logger.exception(e)

    def adjustRanges(self):
        try:
            if (self.range_dict["x_start"] is not None):
                self.plot.state.children[0].x_range.start = self.range_dict["x_start"]
                self.plot.state.children[0].x_range.end = self.range_dict["x_end"]
                self.plot.state.children[0].y_range.start = self.range_dict["y_start"]
                self.plot.state.children[0].y_range.end = self.range_dict["y_end"]
        except:
            if (self.range_dict["x_start"] is not None):
                self.plot.state.x_range.start = self.range_dict["x_start"]
                self.plot.state.x_range.end = self.range_dict["x_end"]
                self.plot.state.y_range.start = self.range_dict["y_start"]
                self.plot.state.y_range.end = self.range_dict["y_end"]

    # All methods below do nothing except update `self.range_dict` or `self.val_dict`

    def setRanges(self):
        tmp = self.range_dict
        try:
            self.range_dict["x_start"] = self.plot.state.children[0].x_range.start
            self.range_dict["x_end"] = self.plot.state.children[0].x_range.end
            self.range_dict["y_start"] = self.plot.state.children[0].y_range.start
            self.range_dict["y_end"] = self.plot.state.children[0].y_range.end
        except:
            self.range_dict["x_start"] = self.plot.state.x_range.start
            self.range_dict["x_end"] = self.plot.state.x_range.end
            self.range_dict["y_start"] = self.plot.state.y_range.start
            self.range_dict["y_end"] = self.plot.state.y_range.end
        self.logger.info(f"Changed `PlotObjekt::setRanges`: {tmp} -> {self.range_dict}")

    def variableUpdate(self, _a, _b, new):
        """
        Handler for selVar.
        """
        tmp = self.val_dict["variable"]
        self.val_dict["variable"] = new
        self.logger.info(f"Changed `PlotObjekt::variable`: {tmp} -> {new}")

    def cmapUpdate(self, _a, _b, new):
        """
        Handler for selCmap.
        """
        tmp = self.val_dict["cm"]
        self.setRanges()
        self.val_dict["cm"] = new
        self.logger.info(f"Changed `PlotObjekt::cmap`: {tmp} -> {new}")


    def aggDimUpdate(self, _a, _b, new):
        """
        Handler for aggregate dimension selection.
        """
        tmp = self.val_dict["aggDim"]
        self.val_dict["aggDim"] = new
        self.logger.info(f"Changed `PlotObjekt::aggDim`: {tmp} -> {new}")

    def aggFnUpdate(self, _a, _b, new):
        """
        Handler for aggregate function selection.
        """
        tmp = self.val_dict["aggFn"]
        self.val_dict["aggFn"] = new
        self.logger.info(f"Changed `PlotObjekt::aggFn`: {tmp} -> {new}")

    def delPlotUpdate(self, attr, old, new):
        """
        Handler for delete plot parameter.
        """
        self.__init__(self.logger, self.title)


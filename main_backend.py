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
from bokeh.models import Button, CheckboxGroup, ColumnDataSource, CustomJS, Div, Select
from bokeh.models.widgets import TextInput
from bokeh.server.server import Server
from bokeh.themes.theme import Theme
from cartopy import crs
from holoviews.operation.datashader import datashade, rasterize

from PlotObject import PlotObject
from src.plots.CurvePlot import CurvePlot
from src.plots.HeightProfilePlot import HeightProfilePlot
from src.plots.TriMeshPlot import TriMeshPlot


class PlotGenerator:
    def __init__(self):

        print("Start PlotGenerator()")
        FORMAT = "%(asctime)-15s %(clientip)s %(user)-8s %(message)s"
        logging.basicConfig(format=FORMAT, level=logging.DEBUG)
        self.logger = logging.getLogger("ncview2")
        self.logger.setLevel(logging.DEBUG)
        self.logger.info({i.__name__: i.__version__ for i in [hv, np, pd]})

        # Get plot pbjects
        self.logger.info("Get plots")
        self.plotPosition = -1

        # inp1 = "2016031500-ART-chemtracer_grid_DOM01_PL_0010.nc"
        inp = ""
        self.plots = [
            PlotObject(self.logger, dataPath=inp),
            PlotObject(self.logger, dataPath=inp),
            PlotObject(self.logger, dataPath=inp),
            PlotObject(self.logger, dataPath=inp),
            PlotObject(self.logger, dataPath=inp),
            PlotObject(self.logger, dataPath=inp),
        ]

    def mainDialog(self, dataUpdate=True):
        """
        This function build up and manages the Main-Graph Dialog
        """

        try:
            self.logger.info("Started mainDialog()")
            start = time.time()

            # Clear doc when update occurs
            curdoc().clear()
            lArray = []

            # TODO: Check idx problems
            # TODO: Variable init with "clon"
            for idx, plot in enumerate(self.plots):

                self.plotPosition = idx

                # Get data
                try:
                    if plot.dataPath != "":
                        link = "./data/" + plot.dataPath
                        plot.xrDataMeta = xr.open_dataset(link)
                        self.logger.info(f"File:  {link}")
                        plot.optVariables = [
                            x for x in plot.xrDataMeta.variables.keys()
                        ]

                        if plot.val_dict["variable"] == "clon":
                            plot.val_dict["variable"] = plot.optVariables[0]
                    else:
                        plot.optVariables = ["clon"]
                except Exception as e:
                    self.logger.info(e)

                # self.logger.info("New values: {}".format(plot.val_dict))

                # Init widgets
                if plot.variable == None:
                    plot.generate_Parameters()
                    self.set_handler(plot)

                # Generate plot type
                if plot.dataPath != "":
                    newPlot = plot.genPlot(dataUpdate)

                # Disable widgets for specific inputs
                if plot.dataPath != "":
                    plot.disableWidgets()

                if plot.dataPath != "":
                    newPlot.state.css_classes = ["plot_object"]
                    # newPlot.state.sizing_mode = "scale_width"
                    lArray.append(newPlot.state)
                else:
                    lArray.append(row())

                # Specify css
                plot.slVar.css_classes = ["variableOptions_" + str(idx)]
                plot.slAggregateDimension.css_classes = ["aggdimOptions_" + str(idx)]
                # Apply to layout
                col = [
                    row(
                        plot.urlinput,
                        plot.slVar,
                        plot.cbCoastlineOverlay,
                        plot.slCMap,
                        plot.cbFixCol,
                        plot.cbSymCol,
                        plot.cbLogzCol,
                        plot.txCLevels,
                        plot.txFixColoringMin,
                        plot.txFixColoringMax,
                        plot.cbLogX,
                        plot.cbLogY,
                        plot.slAggregateDimension,
                        plot.slAggregateFunction,
                    )
                ]
                lArray.append(col)

            # Delete button
            self.deletePlots = CheckboxGroup(
                labels=["Delete Button"], active=[]
            )
            self.deletePlots.on_click(self.deleteUpdate)
            self.deletePlots.visible = False
            lArray.append(self.deletePlots)

            # TODO: Slider below plot
            new_array = [
                row(lArray[0], lArray[2]),
                row(lArray[4], lArray[6]),
                row(lArray[8], lArray[10]),
                lArray[1],
                lArray[3],
                lArray[5],
                lArray[7],
                lArray[9],
                lArray[11],
                lArray[12]
            ]

            l = layout(new_array)

            # Hide widgets
            for idx, widget in enumerate(l.children):
            #     # l.children = widget
            #     # l.children[0].children => Figures 1+2
            #     # l.children[1].children => Figures 3+4
            #     # l.children[2].children => Figures 5+6
            #     # l.children[3].children => Params Fig1
            #     # l.children[4].children => Params Fig2
            #     # l.children[5].children => Params Fig3
            #     # ...

            # TODO: Another logic for visibility
                try:
                    if widget.children[0].children[0].__class__.__name__ != "Figure":
                        for p in widget.children[0].children:
                            p.visible = False

                except Exception as e:
                    pass

            l._id = "1000"
            curdoc().add_root(l)

            end = time.time()
            self.logger.info("MainDialog took %d" % (end - start))
        except Exception as e:
            self.logger.exception("mainDialog() Error")

    def call_func(self, attr, old, new, func, plot):
        new = func(attr, old, new)

        plot.dataPath = new
        self.mainDialog(True)

    def set_handler(self, plot):

        plot.urlinput.on_change("value", plot.fileUpdate, self.fileUpdate)
        plot.slVar.on_change("value", self.variableUpdate)
        plot.slCMap.on_change("value", self.cmapUpdate)
        plot.slAggregateFunction.on_change("value", self.aggFnUpdate)
        plot.slAggregateDimension.on_change("value", self.aggDimUpdate)
        plot.cbCoastlineOverlay.on_click(self.coastlineUpdate)
        plot.cbFixCol.on_click(self.coloringUpdate)
        plot.cbSymCol.on_click(self.coloringUpdate)
        plot.cbLogzCol.on_click(self.coloringUpdate)
        plot.cbLogX.on_click(self.coloringUpdate)
        plot.cbLogY.on_click(self.coloringUpdate)

    def deleteUpdate(self, new):
        """
        Handler to delete plots
        """
        self.__init__()
        self.mainDialog(True)

    def variableUpdate(self, attr, old, new):
        """
        This function is only a wrapper round the self.main function for building the buildDynamicMap.
        It is called if at property like the cmap is changed and the whole buildDynamicMap needs
        to be rebuild.
        """
        self.plots[self.plotPosition].val_dict["variable"] = self.plots[
            self.plotPosition
        ].slVar.value
        self.mainDialog(True)

    def fileUpdate(self, attr, old, new):
        """
        
        """
        curdoc().clear()
        self.logger.info("New File: {}".format(new))
        try:
            self.mainDialog(True)
        except Exception as e:
            print(e)

    def cmapUpdate(self, attr, old, new):
        """
        This function is only a wrapper round the self.main function for building the buildDynamicMap.
        It is called if at property like the cmap is changed and the whole buildDynamicMap needs
        to be rebuild.
        """
        self.plots[self.plotPosition].val_dict["cm"] = self.plots[
            self.plotPosition
        ].slCMap.value
        self.mainDialog(True)

    def aggDimUpdate(self, attr, old, new):
        self.plots[self.plotPosition].val_dict["aggDim"] = self.plots[
            self.plotPosition
        ].slAggregateDimension.value
        if attr.slAggregateFunction.value != "None":
            self.mainDialog(True)
        else:
            self.mainDialog(False)

    def aggFnUpdate(self, attr, old, new):
        self.plots[self.plotPosition].val_dict["aggFn"] = self.plots[
            self.plotPosition
        ].slAggregateFunction.value
        self.logger.info("Aggregate Function Update: {}".format(attr.val_dict["aggFn"]))
        if attr.slAggregateDimension.value != "None":
            self.mainDialog(True)
        else:
            self.mainDialog(False)

    def coastlineUpdate(self, new):
        self.logger.info("coastlineUpdate")
        self.mainDialog(True)

    def coloringUpdate(self, new):
        self.logger.info("ColoringUpdate")
        self.mainDialog(True)

    # def btClick(self, plot):
    #     link = plot.getFile()
    #     plot.xrDataMeta = xr.open_dataset(link)
    #     plot.tmPlot = plot.cuPlot = plot.hpPlot = None
    #     self.mainDialog(True)


# Define the main method here
def entry():
    try:
        # dataPath = "2016031500-ART-chemtracer_grid_DOM01_PL_0010.nc"
        plot1 = PlotGenerator()
        plot1.mainDialog(True)
    except Exception as e:
        print(e)


entry()

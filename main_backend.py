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
            PlotObject(self.logger, title="Plot 1", dataPath=inp),
            PlotObject(self.logger, title="Plot 2", dataPath=inp),
            PlotObject(self.logger, title="Plot 3", dataPath=inp),
            PlotObject(self.logger, title="Plot 4", dataPath=inp),
            PlotObject(self.logger, title="Plot 5", dataPath=inp),
            PlotObject(self.logger, title="Plot 6", dataPath=inp),
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

            # TODO: Variable init with "clon"
            # TODO: Wrong file input check
            # TODO: Styling for plot and slider
            # TODO: Try except wrong inputs -> example: clon, lat, mean
            # TODO: Execute everything in one command
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

                # TODO: generate parameter directly
                # Init widgets
                if plot.variable == None:
                    plot.generate_Parameters()
                    self.set_handler(plot)

                # Generate plot type
                if plot.dataPath != "":
                    figureElement = plot.genPlot(dataUpdate)
                    # if(figureElement==""):
                    #     self.deletePlots.active = [0]

                # Disable widgets for specific inputs
                if plot.dataPath != "":
                    plot.disableWidgets()

                if plot.dataPath != "":
                    # figureElement.state.css_classes = ["plot_object"]
                    # figureElement.state.sizing_mode = "scale_width"
                    classname = "plot_" + str(idx)
                    try:
                        figure = figureElement.state.children[0]
                        slider = figureElement.state.children[1]
                        figure.css_classes = [classname]
                        lArray.append(column(figure, slider))
                    except Exception as e:
                        self.logger.info(e)
                        figureElement.state.css_classes = [classname]
                        lArray.append(figureElement.state)                        
                else:
                    lArray.append(row())

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
            self.addDeleteButton()
            lArray.append(self.deletePlots)

            # TODO: Sync only trimesh plots 
            # Sync zoom
            # plot_positions = [0,2,4,6,8,10]
            # plots = []
            # for idx, plot in zip(plot_positions, self.plots):
            #     if plot.dataPath != "":
            #         try:
            #             if lArray[idx].__class__.__name__ == "Figure":
            #                 plots.append(lArray[idx])
            #             else:
            #                 plots.append(lArray[idx].children[0])
            #         except Exception as e:
            #             pass
                            
            # self.logger.info(plots)
            # try:
            #     for plot in plots[1:]:
            #         plot.x_range = plots[0].x_range
            #         plot.y_range = plots[0].y_range
            # except Exception as e:
            #     self.logger.info(e)
            #     pass

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
            # for idx, widget in enumerate(l.children):
            # #     # l.children = widget
            # #     # l.children[0].children => Figures 1+2
            # #     # l.children[1].children => Figures 3+4
            # #     # l.children[2].children => Figures 5+6
            # #     # l.children[3].children => Params Fig1
            # #     # l.children[4].children => Params Fig2
            # #     # l.children[5].children => Params Fig3
            # #     # ...

            # # TODO: Another logic for visibility
            #     try:
            #         if widget.children[0].children[0].__class__.__name__ != "Figure":
            #             for p in widget.children[0].children:
            #                 p.visible = False
            #     except Exception as e:
            #         pass

            l._id = "1000"
            curdoc().add_root(l)

            end = time.time()
            self.logger.info("MainDialog took %d" % (end - start))
        except Exception as e:
            self.logger.exception("mainDialog() Error")
            self.logger.exception(e)

    def addDeleteButton(self):
        self.deletePlots = CheckboxGroup(
                        labels=["Delete Button"], active=[]
                    )
        self.deletePlots.on_click(self.deleteUpdate)
        self.deletePlots.visible = False

    def set_handler(self, plot):
        plot.urlinput.on_change("value", plot.fileUpdate, self.fileUpdate)
        plot.slVar.on_change("value", plot.variableUpdate, self.variableUpdate)
        plot.slCMap.on_change("value", plot.cmapUpdate, self.cmapUpdate)
        plot.slAggregateFunction.on_change("value", plot.aggFnUpdate, self.aggFnUpdate)
        plot.slAggregateDimension.on_change("value", plot.aggDimUpdate, self.aggDimUpdate)
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

    def fileUpdate(self, attr, old, new):
        """
        
        """
        curdoc().clear()
        self.logger.info("New File: {}".format(new))
        try:
            self.mainDialog(True)
        except Exception as e:
            print(e)

    def variableUpdate(self, attr, old, new):
        self.mainDialog(True)

    def cmapUpdate(self, attr, old, new):
        self.mainDialog(True)

    # TODO: Check for problems in aggdim and aggfct handler
    def aggDimUpdate(self, attr, old, new):
        self.mainDialog(True)
        # if attr.slAggregateFunction.value != "None":
        #     self.mainDialog(True)
        # else:
        #     self.mainDialog(False)

    def aggFnUpdate(self, attr, old, new):
        self.mainDialog(True)
        # if attr.slAggregateDimension.value != "None":
        #     self.mainDialog(True)
        # else:
        #     self.mainDialog(False)

    def coastlineUpdate(self, new):
        self.mainDialog(True)

    def coloringUpdate(self, new):
        self.mainDialog(True)

# Define the main method here
def entry():
    try:
        # dataPath = "2016031500-ART-chemtracer_grid_DOM01_PL_0010.nc"
        plot1 = PlotGenerator()
        plot1.mainDialog(True)
    except Exception as e:
        print(e)


entry()

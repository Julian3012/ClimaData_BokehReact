import logging
import time

import holoviews as hv
import numpy as np
import pandas as pd
import xarray as xr
from bokeh.io import curdoc
from bokeh.layouts import column, layout, row
from bokeh.models import CheckboxGroup

from PlotObject import PlotObject


class PlotGenerator:
    """
    This class builds up the layout of the bokeh plots.
    """

    def __init__(self):

        FORMAT = "%(asctime)-15s %(clientip)s %(user)-8s %(message)s"
        logging.basicConfig(format=FORMAT, level=logging.DEBUG)
        self.logger = logging.getLogger("ncview2")
        self.logger.setLevel(logging.DEBUG)
        self.logger.info({i.__name__: i.__version__ for i in [hv, np, pd]})
        self.logger.info("[Constructor] PlotGenerator")

        # Get plot pbjects
        self.logger.info("[Constructor] Get plots")

        inp = ""
        self.plots = [
            PlotObject(self.logger, title="Plot 1", dataPath=inp),
            PlotObject(self.logger, title="Plot 2", dataPath=inp),
            PlotObject(self.logger, title="Plot 3", dataPath=inp),
            PlotObject(self.logger, title="Plot 4", dataPath=inp),
            PlotObject(self.logger, title="Plot 5", dataPath=inp),
            PlotObject(self.logger, title="Plot 6", dataPath=inp),
        ]

        self.restart = entry

    def mainDialog(self, dataUpdate=True):
        """
        This function build up and manages the main-graph dialog.

        Iteration over all plots specified in __init__().
        1. load data
        2. generate parameters
        3. generate plot
        4. extract plot components
        5. add delete/apply button
        6. build up layout for all plots
        """

        try:
            self.logger.info("[main_backend] XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Started mainDialog()")
            start = time.time()

            curdoc().clear()
            lArray = []

            # TODO: Styling for plot and slider
            for idx, plot in enumerate(self.plots):
                self.logger.info(f"[main_backend] Plot number: {idx}")

                # Get data
                try:
                    self.logger.info("[main_backend] Load data")
                    if plot.dataPath != "":
                        link = "./data/" + plot.dataPath
                        plot.xrDataMeta = xr.open_dataset(link)
                        plot.optVariables = list(plot.xrDataMeta.data_vars)
                        if plot.val_dict["variable"] == "":
                            plot.val_dict["variable"] = plot.optVariables[0]
                    else:
                        plot.optVariables = [""]
                except Exception as e:
                    plot.dataPath = ""
                    self.logger.exception(e)

                # Init widgets
                if plot.variable is None:
                    self.logger.info("[main_backend] Generate parameters")
                    plot.generate_Parameters()
                    self.set_handler(plot)

                # Generate plot type
                if plot.dataPath != "":
                    self.logger.info("[main_backend] Generate plot")
                    figureElement = plot.genPlot(dataUpdate)

                # Init plotelements and bokeh tools
                if plot.dataPath != "":
                    classname = "plot_" + str(idx)
                    try:
                        figure = figureElement.state.children[0]
                        print(figure.x_range.start)
                        slider = figureElement.state.children[1]
                        figure.css_classes = [classname]
                        lArray.append(column(figure, slider))
                    except Exception as e:
                        self.logger.exception(e)
                        figureElement.state.css_classes = [classname]
                        lArray.append(figureElement.state)
                else:
                    lArray.append(row())

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
                        plot.cbDelPl
                    )
                ]
                lArray.append(col)

            # Delete button
            self.addDeleteButton()
            lArray.append(self.deletePlots)

            # Apply button
            self.addApplyButton()
            lArray.append(self.applyChanges)

            new_array = [
                row(lArray[0]),
                row(lArray[2]),
                row(lArray[4]),
                row(lArray[6]),
                row(lArray[8]),
                row(lArray[10]),
                lArray[1],
                lArray[3],
                lArray[5],
                lArray[7],
                lArray[9],
                lArray[11],
                lArray[12],
                lArray[13]
            ]

            l = layout(new_array)
            # Hide widgets
            self.hideWidgets(l)  # TODO Look out it seems with hidden widgets
            l._id = "1000"
            curdoc().add_root(l)

            end = time.time()
            self.logger.info("MainDialog took %.4f [sec]" % (end - start))
        except Exception as e:
            self.logger.error("[main_backend] Exception")
            self.logger.exception(e)
            self.restart()

    def hideWidgets(self, layout):
        """
        l.children = widget
        l.children[0].children => Figures 1+2
        l.children[1].children => Figures 3+4
        l.children[2].children => Figures 5+6
        l.children[3].children => Params Fig1
        l.children[4].children => Params Fig2
        l.children[5].children => Params Fig3
        """
        for _, widget in enumerate(layout.children):

            # TODO: Another logic for visibility
            try:
                if widget.children[0].children[0].__class__.__name__ != "Figure":
                    for p in widget.children[0].children:
                        p.visible = False
            except IndexError:
                pass
            except AttributeError:
                pass
            except Exception as e:
                self.logger.exception(e)

    def addDeleteButton(self):
        """Create a delete button.

        Button gets used when the session creashes or plots get resetted.
        """
        self.deletePlots = CheckboxGroup(
                        labels=["Delete Button"], active=[]
                    )
        self.deletePlots.on_click(self.deleteUpdate)
        self.deletePlots.visible = False

    def addApplyButton(self):
        """Create a apply button.

        Button gets used when you make changes to colorlevels
        or min/max color values.
        """
        self.applyChanges = CheckboxGroup(
                        labels=["Apply"], active=[]
                    )
        self.applyChanges.on_click(self.applyUpdate)
        self.applyChanges.visible = False

    def set_handler(self, plot):
        """
        Add handler to plot object.
        """
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
        plot.cbDelPl.on_change("active",plot.delPlotUpdate, self.delPlotUpdate)

    def deleteUpdate(self, _):
        """
        Handler for delete button.
        """
        self.__init__()
        self.mainDialog(True)

    def applyUpdate(self, _):
        """
        Handler for apply button.
        """
        self.mainDialog(False)

    def fileUpdate(self, _a, old, new):
        """
        Handler for urlinput button.
        """
        curdoc().clear()
        self.logger.info(f"Executed `PlotGenerator::file` {old} -> {new}")
        try:
            self.mainDialog(True)
        except Exception as e:
            self.logger.exception(e)

    # All update methods from below do nothing except calling `mainDialog`

    def variableUpdate(self, _a, _b, _c):
        """
        Handler for variable selection.
        """
        self.logger.info("Executed `PlotGenerator::variable`")
        self.mainDialog(True)

    def cmapUpdate(self, _a, _b, _c):
        self.logger.info("Executed `PlotGenerator::cmap`")
        self.mainDialog(True)

    def aggDimUpdate(self, _a, _b, _c):
        """
        Handler for aggregate dimension selection.
        """
        self.logger.info("Executed `PlotGenerator::aggDim`")
        self.mainDialog(True)

    def aggFnUpdate(self, _a, _b, _c):
        """
        Handler for aggregate function selection.
        """
        self.logger.info("Executed `PlotGenerator::aggFn`")
        self.mainDialog(True)

    def coastlineUpdate(self, _):
        """
        Handler for coastline checkbox.
        """
        self.logger.info("Executed `PlotGenerator::coastline`")
        self.mainDialog(True)

    def coloringUpdate(self, _):
        """
        Handler for coloring parameters.
        """
        self.logger.info("Executed `PlotGenerator::coloring`")
        self.mainDialog(True)
    
    def delPlotUpdate(self, attr, old, new):
        """
        Handler for coloring parameters.
        """
        self.mainDialog(True)


def entry():
    """
    Main method.
    """
    try:
        plot1 = PlotGenerator()
        plot1.mainDialog(True)
    except Exception as e:
        print(e)


entry()

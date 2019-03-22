#!/usr/bin/python

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

from .Plot import Plot

class CurvePlot(Plot):
    def getPlotObject(self, variable, title, aggDim="None", aggFn="None"):
        """
        Function that builds up a plot object for Bokeh to display
        Returns:
            : a plot object
        """
        self.variable = variable
        self.title = title
        self.aggDim = aggDim
        self.aggFn = aggFn

        if self.aggDim == "lon":
            self.cells = []
            for i in range(0,360):
                self.cells.append(np.loadtxt("dom01/dom01_lon_"+str(i)+"deg.dat",dtype='int16'))

        # Builds up the free and non-free dimensions array
        self.buildDims()
        return self.buildDynamicMap()

    def buildDynamicMap(self):
        ranges = self.getRanges()

        # TODO do not hardcode the sizes
        totalgraphopts = {"height": 150, "width": 300}
        dm = hv.DynamicMap(self.buildCurvePlot, kdims=self.freeDims).redim.range(**ranges)

        return self.renderer.get_widget(dm.opts(**totalgraphopts),'widgets')

    def buildCurvePlot(self, *args):
        """
        Function that builds up the Curve-Graph
        Args:
            Take multiple arguments. A value for every free dimension.
        Returns:
            The Curve-Graph object
        """

        selectors = self.buildSelectors(args)

        # This part is not needed as a TriMeshGraph is drawn instead
        #if self.aggFn == "mean" and self.aggDim != "lon":
        #    dat = getattr(self.xrData, self.variable).isel(selectors)
        #    dat = dat.mean(aggDim)

        #if self.aggFn == "sum" and self.aggDim != "lon":
        #    dat = getattr(self.xrData, self.variable).isel(selectors)
        #    dat = dat.sum(aggDim)

        if self.aggDim == "lon":
            dat = []
            for i in range(0,360):
                selectors["ncells"] = self.cells[i]
                if self.aggFn == "mean":
                    dat.append(getattr(self.xrData, self.variable).isel(selectors).mean())
                if self.aggFn == "sum":
                    dat.append(getattr(self.xrData, self.variable).isel(selectors).sum())

        # TODO Apply unit
        #factor = 1
        #dat = dat * factor

        # TODO Height hardcoded
        res = hv.Curve(dat, label=self.title).opts(xlabel=self.aggDim, ylabel=self.variable)

        return res

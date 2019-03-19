#!/usr/bin/python

from bokeh.layouts import layout, widgetbox, row
from bokeh.models import ColumnDataSource, Div
from bokeh.models.widgets import TextInput
from bokeh.io import curdoc
#import geoviews
#import geoviews.feature as gf

import bokeh as bokeh
import pandas as pd
import xarray as xr
import holoviews as hv
import numpy as np

from cartopy import crs

from holoviews.operation.datashader import datashade, rasterize

import math

class CurvePlot:
    def __init__(self, xrData, aggDim, aggFn):
        self.xrData = xrData
        self.aggDim = aggDim
        self.aggFn = aggFn

        if self.aggDim == "lon":
            self.cells = []
            for i in range(0,360):
                self.cells.append(np.loadtxt("dom01/dom01_lon_"+str(i)+"deg.dat",dtype='int16'))

    def getPlotObject(self, variable, title):
        self.variable = variable
        self.title = title
        return self.buildDynamicMap()

    def buildDynamicMap(self):
        self.freeDims = []
        self.nonFreeDims = []

        for d in getattr(self.xrData,self.variable).dims:
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d == "height":
                self.freeDims.append("hi")
                continue
            if d == self.aggDim and self.aggFn != "None":
                # skip aggregates dimensions
                continue
            if d != "ncells" and (len(getattr(getattr(self.xrData,self.variable),d))-1) > 0:
                # Add all dimensions to freeDims if the dimension has a size of greater than one
                self.freeDims.append(d)
            if d != "ncells" and (len(getattr(getattr(self.xrData,self.variable),d))-1) == 0:
                # Add all dimensions which have a size of one to nonFreeDims as there is no need for a slider here
                self.nonFreeDims.append(d)


        ranges = {}
        for d in self.freeDims:
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d == "hi":
                ranges[d] = (0,len(getattr(getattr(self.xrData,self.variable),"height"))-1)
            else:
                ranges[d] = (0,len(getattr(getattr(self.xrData,self.variable),d))-1)
        dm = hv.DynamicMap(self.buildCurvePlot, kdims=self.freeDims).redim.range(**ranges)

        return dm

    def buildCurvePlot(self, *args):
        """
        Function that builds up the Curve-Graph
        Args:
            Take multiple arguments. A value for every free dimension.
        Returns:
            The Curve-Graph object
        """

        selectors = {}
        idx = 0
        # Build the data selector for the free dimensions. For those are the DynamicMap shows sliders to the right of the graph
        for d in self.freeDims:
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d == "hi":
                selectors["height"] = args[idx]
            else:
                selectors[d] = args[idx]
            idx = idx +1

        # Also select non-free-dimensions. Those are dimensions that are of length 1
        for d in self.nonFreeDims:
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d == "hi":
                selectors["height"] = 0
            else:
                selectors[d] = 0
            idx = idx +1

        # This part is not needed as a TriMeshGraph is drawn instead
        #if self.aggFn == "mean" and self.aggDim != "lon":
        #    dat = getattr(self.xrData, self.variable).isel(selectors)
        #    dat = dat.mean(aggDim)

        #if self.aggFn == "sum" and self.aggDim != "lon":
        #    dat = getattr(self.xrData, self.variable).isel(selectors)
        #    dat = dat.sum(aggDim)

        if self.aggDim == "lon":
            print("AggDim is lon")
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

        res = hv.Curve(dat, label=self.title)

        return res

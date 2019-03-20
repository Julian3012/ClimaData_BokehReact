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

class TriMeshPlot(Plot):
    def __init__(self, logger, renderer, xrData, tris, verts, cm="Magma"):
        """
        Overwrites Plot.__init__
        """
        self.logger = logger
        self.renderer = renderer
        self.xrData = xrData
        self.cm = cm
        self.tris = tris
        self.verts = verts

    def getPlotObject(self, variable, title, cm="None", aggDim="None", aggFn="None"):
        """
        Function that builds up a plot object for Bokeh to display
        Returns:
            : a plot object
        """
        self.variable = variable
        self.aggDim = aggDim
        self.aggFn = aggFn

        if cm is not "None":
            self.cm = cm
        self.title = title
        # Builds up the free and non-free dimensions array
        self.buildDims()
        return self.buildDynamicMaps()

    def buildDynamicMaps(self):
        """
        Function to capsulate the free dimensions together with the actual
        Trimeshgraph.

        Returns:
            : a rasterizes plot of the DynamicMap with the TriMesh graph in it.
        """

        ranges = self.getRanges()
        if len(self.freeDims) > 0:
            self.logger.info("Show with DynamicMap")
            dm = hv.DynamicMap(self.buildTrimesh, kdims=self.freeDims).redim.range(**ranges)
            return self.renderer.get_widget(rasterize(dm).opts(cmap=self.cm,colorbar=True),'widgets')
        else:
            self.logger.info("Show without DynamicMap")
            dm = self.buildTrimesh()
            return self.renderer.get_plot(rasterize(dm).opts(cmap=self.cm,colorbar=True))

    def buildTrimesh(self, *args):
        """
        Function that builds up the TriMesh-Graph
        Args:
            Take multiple arguments. A value for every free dimension.
        Returns:
            The TriMesh-Graph object
        """

        selectors = self.buildSelectors(args)

        if self.aggDim == "None" or self.aggFn == "None":
            self.tris["var"] = getattr(self.xrData, self.variable).isel(selectors)
            #self.tris["var"] = getattr(self.xrData, self.variable).mean(dim=self.aggDim,keep_attrs=True).isel({"time":0})
        elif self.aggDim != "None":
            if self.aggFn == "mean":
                self.tris["var"] = getattr(self.xrData, self.variable).mean(dim=self.aggDim,keep_attrs=True).isel(selectors)
            elif self.aggFn == "sum":
                self.tris["var"] = getattr(self.xrData, self.variable).sum(dim=self.aggDim,keep_attrs=True).isel(selectors)

        # Apply unit
        factor = 1
        self.tris["var"] = self.tris["var"] * factor

        res = hv.TriMesh((self.tris,self.verts), label=(self.title))
        return res

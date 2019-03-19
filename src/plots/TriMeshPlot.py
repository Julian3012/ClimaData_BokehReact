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


class TriMeshPlot:
    def __init__(self, xrData, tris, verts, cm="Magma"):
        self.xrData = xrData
        self.cm = cm
        self.tris = tris
        self.verts = verts

    def getPlotObject(self, variable, title, cm="None", aggDim="None", aggFn="None"):
        self.variable = variable
        self.aggDim = aggDim
        self.aggFn = aggFn

        if cm is not "None":
            self.cm = cm
        self.title = title
        return self.buildDynamicMaps()

    def buildDynamicMaps(self):
        """
        Function to capsulate the free dimensions together with the actual
        Trimeshgraph.

        Returns:
            : a rasterizes plot of the DynamicMap with the TriMesh graph in it.
        """
        self.freeDims = []
        self.nonFreeDims = []
        for d in getattr(self.xrData,self.variable).dims:

            # Skip aggregated dimensions only it a Aggregate-Function is specified
            if d == self.aggDim and self.aggFn != "None":
                # Skip aggregated dimensions
                print("Skipped aggDim: "+self.aggDim)
                continue
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d == "height":
                self.freeDims.append("hi")
                continue
            if d != "ncells" and (len(getattr(getattr(self.xrData,self.variable),d))-1) > 0:
                self.freeDims.append(d)
            if d != "ncells" and (len(getattr(getattr(self.xrData,self.variable),d))-1) == 0:
                self.nonFreeDims.append(d)

        ranges = {}
        for d in self.freeDims:
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d != "hi":
                ranges[d] = (0,len(getattr(getattr(self.xrData,self.variable),d))-1)
            else:
                ranges[d] = (0,len(getattr(getattr(self.xrData,self.variable),"height"))-1)

        print(self.freeDims)
        print("length: "+ str(len(self.freeDims)))
        if len(self.freeDims) > 0:
            print("Show with DynamicMap")
            dm = hv.DynamicMap(self.buildTrimesh, kdims=self.freeDims).redim.range(**ranges)
        else:
            print("Show without DynamicMap")
            dm = self.buildTrimesh()

        return rasterize(dm).opts(cmap=self.cm,colorbar=True)

    def buildTrimesh(self, *args):
        """
        Function that builds up the TriMesh-Graph
        Args:
            Take multiple arguments. A value for every free dimension.
        Returns:
            The TriMesh-Graph object
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
            if d == "hi":
                selectors["height"] = 0
            else:
                selectors[d] = 0
            idx = idx +1

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

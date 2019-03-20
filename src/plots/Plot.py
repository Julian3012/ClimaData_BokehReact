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

class Plot:
    def __init__(self, logger, renderer, xrData, aggDim, aggFn):
        self.logger = logger
        self.renderer = renderer
        self.xrData = xrData
        self.aggDim = aggDim
        self.aggFn = aggFn


    def buildDims(self):
        self.freeDims = []
        self.nonFreeDims = []
        for d in getattr(self.xrData,self.variable).dims:

            # Skip aggregated dimensions only it a Aggregate-Function is specified
            if d == self.aggDim and self.aggFn != "None":
                # Skip aggregated dimensions
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

    def getRanges(self):
        ranges = {}
        for d in self.freeDims:
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d != "hi":
                ranges[d] = (0,len(getattr(getattr(self.xrData,self.variable),d))-1)
            else:
                ranges[d] = (0,len(getattr(getattr(self.xrData,self.variable),"height"))-1)
        return ranges

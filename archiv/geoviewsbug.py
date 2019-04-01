#!/usr/bin/python
from bokeh.layouts import layout, widgetbox
from bokeh.models import ColumnDataSource, Div
from bokeh.models.widgets import TextInput
from bokeh.io import curdoc
#import geoviews

import bokeh as bokeh
import pandas as pd
import xarray as xr
import holoviews as hv
import numpy as np

from cartopy import crs

from holoviews.operation.datashader import datashade, rasterize
import math

renderer = hv.renderer('bokeh').instance(mode='server',size=300)


def graph():
    dm = hv.DynamicMap(triGraph)
    cm = "Magma"
    return rasterize(dm).opts(cmap=cm,colorbar=True)

def triGraph(*args):

    dots = [[1,200], [200,1], [200,100], [30,20]]
    tris = [[0,1,2,30],[3,1,2,10]]

    res = hv.TriMesh((tris,verts), label=(variable)).options(filled=True)
    return res


def load():
    plot = renderer.get_widget(graph(),'widgets')
    curdoc().clear()
    l = layout([
        [plot.state]
    ])

    curdoc().add_root(l)

load()

#!/usr/bin/python
import os

import numpy as np

from bokeh.plotting import figure
from bokeh.layouts import layout, widgetbox, row
from bokeh.models import ColumnDataSource, Div, PreText
from bokeh.models.widgets import Slider, Select, TextInput
from bokeh.io import curdoc, show

import bokeh as bokeh
import pandas as pd
import xarray as xr
import holoviews as hv
import numpy as np
import dask
import datashader as ds

from datashader.bokeh_ext import InteractiveImage
from holoviews.operation.datashader import datashade

import geoviews as gv
from cartopy import crs
import geoviews.feature as gf
from scipy.spatial import Delaunay


renderer = hv.renderer('bokeh').instance(mode='server')

START = 0
LOADING = 1
LOADED = 2

state = START

def graph(url):
    n1 = []
    n2 = []
    n3 = []

    xrData = xr.open_dataset("/home/max/Downloads/2016033000-ART-passive_grid_pmn_DOM01_ML_0002.nc",decode_cf=False)
    verts = np.column_stack((xrData.clon_bnds.stack(z=('vertices','ncells')),xrData.clat_bnds.stack(z=('vertices','ncells'))))

    l = len(xrData.clon_bnds)

    n1 = np.arange(l)
    n2 = n1 + l
    n3 = n2 + l

    n4 = np.column_stack((n1,n2,n3))
    n = np.column_stack((n4,xrData.isel(height=0,time=0).TR_stn))

    verts = pd.DataFrame(verts,  columns=['x', 'y'])
    tris  = pd.DataFrame(n, columns=['v0', 'v1', 'v2','TR_stn'], dtype = np.float64)
    tris['v0'] = tris["v0"].astype(np.int32)
    tris['v1'] = tris["v1"].astype(np.int32)
    tris['v2'] = tris["v2"].astype(np.int32)

    print('vertices:', len(verts), 'triangles:', len(tris))

    return datashade(hv.TriMesh((tris,verts), label="Wireframe").options(filled=True))

def loadCallback():
    state = LOADING

    divLoading = Div(text="loading...")
    curdoc().clear()
    l = layout([
    [widgetbox(divLoading)]
    ])
    curdoc().add_root(l)

    plot = renderer.get_plot(graph(""))

    curdoc().clear()
    l = layout([
    [plot.state]
    ])
    curdoc().add_root(l)
    state = LOADED

def modify_doc(doc):
    doc.title = 'HoloViews Bokeh App'
    urlinput = TextInput(value="default", title="netCFD/OpenDAP Source URL:")
    btLoad = bokeh.models.Button(label="load")
    btLoad.on_click(loadCallback)

    doc.clear()
    l = layout([
    [widgetbox(urlinput)],
    [widgetbox(btLoad)]
    ])
    doc.add_root(l)



#urlinput = TextInput(value="default", title="netCFD/OpenDAP Source URL:")
#btLoad = bokeh.models.Button(label="load")
#btLoad.on_click(loadCallback)


#shaded = graph("")
#doc = hv.renderer('bokeh').server_doc(shaded)
#doc.title = 'HoloViews Bokeh App'

modify_doc(curdoc())

#!/usr/bin/python
from os.path import dirname, join

import numpy as np
import pandas.io.sql as psql
import sqlite3 as sql

from bokeh.plotting import figure
from bokeh.layouts import layout, widgetbox, row
from bokeh.models import ColumnDataSource, Div, PreText
from bokeh.models.widgets import Slider, Select, TextInput
from bokeh.io import curdoc

import bokeh as bokeh
import pandas as pd
import xarray as xr
import holoviews as hv
import numpy as np
import dask
import datashader as ds
from datashader.bokeh_ext import InteractiveImage
from holoviews.operation.datashader import datashade, shade, dynspread, rasterize
from holoviews.operation import decimate
import datashader.utils as du, datashader.transfer_functions as tf

import geoviews as gv
from cartopy import crs
import geoviews.feature as gf
from scipy.spatial import Delaunay

hv.extension('bokeh')

options = hv.Store.options(backend='bokeh')
options.Points = hv.Options('plot', width=800, height=600, size_index=None,)
xrData = xr.open_dataset("/home/max/Downloads/2016033000-ART-passive_grid_pmn_DOM01_ML_0002.nc",decode_cf=False)
verts = np.column_stack((xrData.clon_bnds.stack(z=('vertices','ncells')),xrData.clat_bnds.stack(z=('vertices','ncells'))))

def fnt(verts):

    #pts = np.column_stack((xrData.clon,xrData.clat,xrData.isel(height=0,time=0).TR_stn))
    #print(pts)

    #verts = np.append(verts,[0,0])
    #print(verts.shape)
    n1 = []
    n2 = []
    n3 = []

    l = len(xrData.clon_bnds)
    #for i in range(0,l):
    #    n1.append([i])
    #    n2.append([i+l])
    #    n3.append([i+l+l])

    n1 = np.arange(l)
    n2 = n1 + l
    n3 = n2 + l

    n4 = np.column_stack((n1,n2,n3))
    n = np.column_stack((n4,xrData.isel(height=0,time=0).TR_stn))
    #n = np.column_stack((n1,n2,n3))

    verts = pd.DataFrame(verts,  columns=['x', 'y'])
    tris  = pd.DataFrame(n, columns=['v0', 'v1', 'v2','TR_stn'], dtype = np.float64)
    tris['v0'] = tris["v0"].astype(np.int32)
    tris['v1'] = tris["v1"].astype(np.int32)
    tris['v2'] = tris["v2"].astype(np.int32)

    print('vertices:', len(verts), 'triangles:', len(tris))

    #mesh = du.mesh(verts,tris)
    #cvs = ds.Canvas(plot_height=900, plot_width=900)
    #agg = cvs.trimesh(verts, tris, mesh=mesh)
    #tf.Image(tf.shade(agg))

    #datashade(hv.TriMesh((tris,verts), vdims=["TR_stn"], label="Wireframe").options(filled=True))
    return datashade(hv.TriMesh((tris,verts), label="Wireframe").options(filled=True))

shaded = fnt(verts)
doc = hv.renderer('bokeh').server_doc(shaded)
doc.title = 'HoloViews Bokeh App'

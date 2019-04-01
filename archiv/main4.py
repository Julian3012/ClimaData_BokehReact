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


SIZING_MODE = 'fixed'  # 'scale_width' also looks nice with this example


desc = Div(text=open(join(dirname(__file__), "description.html")).read(), width=800)

renderer = hv.renderer('bokeh')
options = hv.Store.options(backend='bokeh')
options.Points = hv.Options('plot', width=800, height=600, size_index=None,)
options.Points = hv.Options('style', cmap='rainbow', line_color='black')

print("loading netcdf")
xrDataset = xr.open_dataset("http://eos.scc.kit.edu/thredds/dodsC/polstracc0new/2016033000/2016033000-ART-passive_grid_pmn_DOM02_ML_0002.nc",chunks={},decode_cf=False)
print("loaded")

print("loading dims")
print(xrDataset.dims)
print("loaded")

print("showing")
points = hv.Dataset(xrDataset).to(hv.Points,["time","frequency"])
#print("showed")

#curdoc().add_root(points)
#curdoc().title = "ncview2"

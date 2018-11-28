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


SIZING_MODE = 'fixed'  # 'scale_width' also looks nice with this example


desc = Div(text=open(join(dirname(__file__), "description.html")).read(), width=800)

renderer = hv.renderer('bokeh')
options = hv.Store.options(backend='bokeh')
options.Points = hv.Options('plot', width=800, height=600, size_index=None,)
options.Points = hv.Options('style', cmap='rainbow', line_color='black')

def update(attr, old, new):
    lay.children[1] = create_figure()

def create_figure():
    label = "%s vs %s" % (x.value.title(), y.value.title())
    kdims = [x.value, y.value]

    opts, style = {}, {}
    opts['color_index'] = color.value if color.value != 'None' else None
    if size.value != 'None':
        opts['size_index'] = size.value
        opts['scaling_factor'] = (1./df[size.value].max())*200
    points = hv.Points(df, kdims=kdims, label=label).opts(plot=opts, style=style)
    return renderer.get_plot(points).state

def loadCallback():
    global x
    global y
    global df
    global color
    global size
    global lay

    result = "Default URL"

    print("Loading "+ urlinput.value)
    xrDataset = xr.open_dataset(urlinput.value,chunks={})
    result = str(xrDataset)
    df =xrDataset.to_dataframe().reset_index()
    rsDiv = PreText(text=result)

    columns = sorted(df.columns)
    print("Columns are ")
    print(columns)
    discrete = [x for x in columns if df[x].dtype == object]
    continuous = [x for x in columns if x not in discrete]
    quantileable = [x for x in continuous if len(df[x].unique()) > 1]

    x = Select(title='X-Axis', value=quantileable[0], options=quantileable)
    x.on_change('value', update)
    y = Select(title='Y-Axis', value=quantileable[1], options=quantileable)
    y.on_change('value', update)

    size = Select(title='Size', value='None', options=['None'] + quantileable)
    size.on_change('value', update)

    color = Select(title='Color', value='None', options=['None'] + quantileable)
    color.on_change('value', update)

    controls = widgetbox([x, y, color, size], width=200)
    lay = row(controls, create_figure())

    curdoc().add_root(lay)
    print(result)
    print("Done loadCallback")

df = None
x = None
y = None
size = None
color = None
lay = None

# LOAD Start part
urlinput = TextInput(value="default", title="netCFD/OpenDAP Source URL:")
btLoad = bokeh.models.Button(label="load")
btLoad.on_click(loadCallback)

l = layout([
    [desc],
    [widgetbox(urlinput)],
    [widgetbox(btLoad)],
], sizing_mode=SIZING_MODE)

curdoc().add_root(l)
curdoc().title = "ncview2"

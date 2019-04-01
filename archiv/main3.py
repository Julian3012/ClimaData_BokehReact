from os.path import dirname, join

import numpy as np
import pandas.io.sql as psql
import sqlite3 as sql

from bokeh.plotting import figure
from bokeh.layouts import layout, widgetbox
from bokeh.models import ColumnDataSource, Div
from bokeh.models.widgets import Slider, Select, TextInput
from bokeh.io import curdoc
from bokeh.sampledata.movies_data import movie_path

from bokeh.palettes import Spectral6
from bokeh.transform import linear_cmap

import bokeh
import netCDF4
import pandas as pd
import xarray as xr


SIZING_MODE = 'fixed'  # 'scale_width' also looks nice with this example

def plotCallback():
    print("plotCallback")

def loadCallback():
    print("loadCallback")
    file = "/home/max/Downloads/OS_NTAS_2007_D_T30min.nc"
    #file = "https://dods.ndbc.noaa.gov/thredds/dodsC/data/adcp/41001/41001a2010.nc"
    dataset = xr.open_dataset(file)

    btPlot = bokeh.models.Button(label="plot")
    btPlot.on_click(plotCallback)


    print(dataset.data_vars.variables)

    #slVar = Select(title="Color", options=dataset.dims, value=dataset.dims[0])

    lySelectVar = layout([
        [widgetbox(btPlot)],
    ])

    curdoc().add_root(widgetbox(btPlot))

loadCallback()

urlinput = TextInput(value="default", title="netCFD/OpenDAP Source URL:")
btLoad = bokeh.models.Button(label="load")
btLoad.on_click(loadCallback)

lySelectSource = layout([
    [widgetbox(urlinput)],
    [widgetbox(btLoad)]
], sizing_mode=SIZING_MODE)

curdoc().add_root(lySelectSource)
curdoc().title = "ncview2"

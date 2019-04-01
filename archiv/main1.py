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


import bokeh
import netCDF4

#from collections import Dict


varoptions = ["None"]
dimoptions = ["None"]

desc = Div(text=open(join(dirname(__file__), "description.html")).read(), width=800)

# Create Input controls
#reviews = Slider(title="Minimum number of reviews", value=80, start=10, end=300, step=10)

x_axis = Select(title="X Axis", options=varoptions, value="None")
y_axis = Select(title="Y Axis", options=varoptions, value="None")
variable_axis = Select(title="Color", options=varoptions, value="None")

# Create Column Data Source that will be used by the plot
source = ColumnDataSource(data=dict(x=[], y=[], color=[]))

p = figure(plot_height=600, plot_width=700, title="", toolbar_location=None)
p.circle(x="x", y="y", color="color", source=source, size=7, line_color=None)


dataset = None
#dataset = netCDF4.Dataset("https://dods.ndbc.noaa.gov/thredds/dodsC/oceansites/DATA/CCE1/OS_CCE1_01_D_AQUADOPP.nc")
dataset = netCDF4.Dataset("/home/max/Downloads/OS_CCE1_01_D_AQUADOPP.nc")


for k,v in dataset.variables.items():
    print(k)
    varoptions.append(k)

def updateVariable():
    pass

def update():
    #if dataset is None:
    #   return
    #if dataset.variables is None:
    #    return

    df = dataset.variables

    x_name = x_axis.value
    y_name = y_axis.value
    variable_name = variable_axis.value

    if x_name is None or y_name is None:
        return
    if x_name is "None" or y_name is "None":
        return

    print("Selected %s and %s" % (x_name,y_name) )

    p.xaxis.axis_label = x_axis.value
    p.yaxis.axis_label = y_axis.value

    p.title.text = "%d dataitems selected" % len(df)
    source.data = dict(
        x=df[x_name][:10],
        y=df[y_name][:10],
        color=df[color_name][:10],
    )

variable_axis.on_change('value', lambda attr, old, new: updateVariable())

controls = [x_axis, y_axis]
for control in controls:
    control.on_change('value', lambda attr, old, new: update())

sizing_mode = 'fixed'  # 'scale_width' also looks nice with this example

def loadCallback():
    global dataset
    global axis_map

    url = urlinput.value
    dataset = netCDF4.Dataset(url)

    # lookup a variable
    #print("Keys:")
    #print(dataset.variables.keys())

    #print("variables:")
    #print(dataset.variables)

    for k,v in dataset.variables.items():
        options.append(k)


    #axis_map = dataset.variables
    # print the first 10 values
    #lonvariable = dataset.variables["lon"]
    #print("printing")
    #for i in range(0,10):
    #	print(lonvariable[i],latvariable[i])
    #pass
    update()
    print("Done loadCallback")

inputs = widgetbox(variable_axis,x_axis,y_axis, sizing_mode=sizing_mode)

urlinput = TextInput(value="default", title="netCFD/OpenDAP Source URL:")
btLoad = bokeh.models.Button(label="load")
btLoad.on_click(loadCallback)

l = layout([
    [desc],
    [widgetbox(urlinput)],
    [widgetbox(btLoad)],
    [inputs, p],
], sizing_mode=sizing_mode)

update()  # initial load of the data

curdoc().add_root(l)
curdoc().title = "ncview2"

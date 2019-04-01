# myapp.py

from random import random

import bokeh

from bokeh.plotting import figure, curdoc, gridplot
from bokeh.layouts import column, row, widgetbox

# create a callback that will add a number in a random location
def callback():
    print("Test")
    pass

# ControllButtons
btBackwards = bokeh.models.Button(label="<<")
btBackwards.on_click(callback)
btBack = bokeh.models.Button(label="<")
btBack.on_click(callback)
btPause = bokeh.models.Button(label="P")
btPause.on_click(callback)
btFore = bokeh.models.Button(label=">")
btFore.on_click(callback)
btForeward = bokeh.models.Button(label=">>")
btForeward.on_click(callback)

#OptionButtons
bt3Gauss = bokeh.models.Button(label="3Gauss")
bt3Gauss.on_click(callback)
btInvP = bokeh.models.Button(label="Inv P")
btInvP.on_click(callback)
btInvC = bokeh.models.Button(label="Inv C")
btInvC.on_click(callback)
btMaxX1 = bokeh.models.Button(label="Max X1")
btMaxX1.on_click(callback)
btLinear = bokeh.models.Button(label="Linear")
btLinear.on_click(callback)
btAxes = bokeh.models.Button(label="Axes")
btAxes.on_click(callback)
btRange = bokeh.models.Button(label="Range")
btRange.on_click(callback)
btBlowUp = bokeh.models.Button(label="blowup_")
btBlowUp.on_click(callback)
btPrint = bokeh.models.Button(label="Print")
btPrint.on_click(callback)

#w1 = row(children=[btBackwards, btBack, btPause, btFore, btForeward], sizing_mode='scale_width', width=800)
#w2 = row(children=[bt3Gauss, btInvP, btInvC, btMaxX1, btLinear, btAxes, btRange, btBlowUp, btPrint], sizing_mode='scale_width', width=800 )

w1 = row(children=[btBackwards, btBack, btPause, btFore, btForeward], sizing_mode='scale_width', width=100)
w2 = row(children=[bt3Gauss, btInvP, btInvC, btMaxX1, btLinear, btAxes, btRange, btBlowUp, btPrint], sizing_mode='scale_width', width=100 )

# put the button and plot in a layout and add to the document
curdoc().add_root(w1)
curdoc().add_root(w2)

from bokeh.layouts import layout, widgetbox
from bokeh.models.widgets import Select, TextInput
from bokeh.io import curdoc

import bokeh

dimoptions = ["None"]

slctInput = Select(title="X Axis", options=dimoptions, value="None")

sizing_mode = 'fixed'  # 'scale_width' also looks nice with this example



def loadCallback():
    global dimoptions
    print(dimoptions)
    d = ["New", "New1"]
    for i in d:
        dimoptions.append(i)
    print(dimoptions)

btLoad = bokeh.models.Button(label="load")
btLoad.on_click(loadCallback)


l = layout([
    [btLoad],
    [slctInput],
], sizing_mode=sizing_mode)

curdoc().add_root(l)

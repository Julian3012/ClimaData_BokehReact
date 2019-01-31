from bokeh.plotting import figure, output_file, show
from bokeh.models import ColumnDataSource, ColorBar
from bokeh.palettes import Spectral6
from bokeh.transform import linear_cmap

import pandas as pd
import xarray as xr
import matplotlib.pyplot as plt

first = xr.open_dataset("/home/max/Downloads/OS_CCE1_01_D_AQUADOPP.nc")

df =first.to_dataframe().reset_index()

#df.drop(columns=["INST_MFGR","INST_MODEL","INST_SN"], inplace=True)
#df =first.to_dataframe()

mapper = linear_cmap(field_name='TEMP', palette=Spectral6 ,low=10 ,high=20)

print(df.head(10))

src = ColumnDataSource(df)
print(src.column_names)


p = figure(plot_width=400, plot_height=400)

# add a circle renderer with a size, color, and alpha
#p.circle(source=src, size=20, color="navy", alpha=0.5)
p.circle(x='TIME', y="PRES", line_color=mapper,color=mapper, source=df)
color_bar = ColorBar(color_mapper=mapper['transform'], width=8,  location=(0,0))
p.add_layout(color_bar, 'right')

# show the results
show(p)

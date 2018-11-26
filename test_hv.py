from bokeh.plotting import figure, output_file, show
from bokeh.models import ColumnDataSource, ColorBar
from bokeh.palettes import Spectral6
from bokeh.transform import linear_cmap

import pandas as pd
import numpy as np
import xarray as xr
import holoviews as hv

data = xr.open_dataset("/home/max/Downloads/OS_CCE1_01_D_AQUADOPP.nc")

points = hv.Scatter(data, 'TIME','PRES')
points

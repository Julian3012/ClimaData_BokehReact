#!/usr/bin/python
from bokeh.layouts import layout, widgetbox
from bokeh.models import ColumnDataSource, Div
from bokeh.models.widgets import TextInput
from bokeh.io import curdoc
#import geoviews
#import geoviews.feature as gf

import bokeh as bokeh
import pandas as pd
import xarray as xr
import holoviews as hv
import numpy as np

from cartopy import crs

from holoviews.operation.datashader import datashade, rasterize

import math

renderer = hv.renderer('bokeh').instance(mode='server',size=300)
#gv.extension('bokeh')

START = 0
LOADINGMETA = 1
LOADEDMETA = 2
LOADING = 3
LOADED = 4
ERROR = 1000

state = START

urlinput = TextInput(value="default", title="netCFD/OpenDAP Source URL:")
slVar = None
slMesh = None
slCMap = None
txTitle = None

aggregates = []

COLORMAPS = ["Inferno","Magma","Plasma","Viridis","BrBG","PiYG","PRGn","PuOr","RdBu","RdGy","RdYlBu","RdYlGn","Spectral","Blues","BuGn","BuPu","GnBu","Greens","Greys","Oranges","OrRd","PuBu","PuBuGn","PuRd","Purples","RdPu","Reds","YlGn","YlGnBu","YlOrBr","YlOrRd"]

tmPlot = None
xrData = None

class Aggregates():
    def __init__(self, dim, f):
        self.dim = dim
        self.f = f

class TriMeshPlot():
    def __init__(self, xrData, tris, verts, cm="Magma"):
        self.xrData = xrData
        self.cm = cm
        self.tris = tris
        self.verts = verts

    def getPlotObject(self, variable, title, cm="None"):
        self.variable = variable

        if cm is not "None":
            self.cm = cm
        print(self.cm)
        self.title = title
        return self.buildDynamicMaps()

    def buildDynamicMaps(self):
        """
        Function to capsulate the free dimensions together with the actual
        Trimeshgraph.

        Returns:
            : a rasterizes plot of the DynamicMap with the TriMesh graph in it.
        """
        self.freeDims = []
        self.nonFreeDims = []
        for d in getattr(self.xrData,self.variable).dims:
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d == "height":
                self.freeDims.append("hi")
                continue
            if d != "ncells" and (len(getattr(getattr(self.xrData,self.variable),d))-1) > 0:
                self.freeDims.append(d)
            if d != "ncells" and (len(getattr(getattr(self.xrData,self.variable),d))-1) == 0:
                self.nonFreeDims.append(d)

        ranges = {}
        for d in self.freeDims:
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d != "hi":
                ranges[d] = (0,len(getattr(getattr(self.xrData,self.variable),d))-1)
            else:
                ranges[d] = (0,len(getattr(getattr(self.xrData,self.variable),"height"))-1)
        dm = hv.DynamicMap(self.buildTrimeshbuildDynamicMap, kdims=self.freeDims).redim.range(**ranges)

        return rasterize(dm).opts(cmap=self.cm,colorbar=True)

    def buildTrimeshbuildDynamicMap(self, *args):
        """
        Function that builds up the TriMesh-Graph
        Args:
            Take multiple arguments. A value for every free dimension.
        Returns:
            The TriMesh-Graph object
        """

        # Define aggregates
        #aggregateFunctions = ["mean","sum"]
        #aggregateDimensions = ["lon","height"]
        #slAggregateFunction = bokeh.models.Select(title="Aggregate Function", options=aggregateFunctions, value="mean")
        #slAggregateDimension = bokeh.models.Select(title="Aggregate Dimension", options=aggregateDimensions, value="lon")

        selectors = {}
        idx = 0
        # Build the data selector for the free dimensions. For those are the DynamicMap shows sliders to the right of the graph
        for d in self.freeDims:
            # WORKAROUND because Holoview is not working with a kdim with name "height"
            # See issue https://github.com/pyviz/holoviews/issues/3448
            if d == "hi":
                selectors["height"] = args[idx]
            else:
                selectors[d] = args[idx]
            idx = idx +1

        # Also select non-free-dimensions. Those are dimensions that are of length 1
        for d in self.nonFreeDims:
            if d == "hi":
                selectors["height"] = 0
            else:
                selectors[d] = 0
            idx = idx +1

        self.tris["var"] = getattr(self.xrData, self.variable).isel(selectors)

        # Apply unit
        factor = 1
        self.tris["var"] = self.tris["var"] * factor

        res = hv.TriMesh((self.tris,self.verts), label=(self.title))
        return res

def getURL():
    """
    Function to capsulate the url input.

    Returns:
        str: The entered data url
    """
    #url = urlinput.value
    url = "/home/max/Downloads/2016033000-ART-passive_grid_pmn_DOM01_ML_0002.nc"
    return url

def loadData(url):
    """
    Function load OPeNDAP data

    Returns:
        xarray Dataset: Loads the url as xarray Dataset
    """
    xrData = xr.open_dataset(url,decode_cf=False)
    return xrData

def loadMesh(xrData):
    """
    Function to build up a mesh

    Returns:
        array of triangles and vertices: Builds the mesh from the loaded xrData
    """
    verts = np.column_stack((xrData.clon_bnds.stack(z=('vertices','ncells')),xrData.clat_bnds.stack(z=('vertices','ncells'))))

    #not so performant
    f = 180 / math.pi
    for v in verts:
        v[0] = v[0] * f
        v[1] = v[1] * f

    l = len(xrData.clon_bnds)
    n1 = []
    n2 = []
    n3 = []

    n1 = np.arange(l)
    n2 = n1 + l
    n3 = n2 + l

    n = np.column_stack((n1,n2,n3,n1))

    verts = pd.DataFrame(verts,  columns=['Longitude', 'Latitude'])
    tris  = pd.DataFrame(n, columns=['v0', 'v1', 'v2',"var"], dtype = np.float64)
    tris['v0'] = tris["v0"].astype(np.int32)
    tris['v1'] = tris["v1"].astype(np.int32)
    tris['v2'] = tris["v2"].astype(np.int32)
    return (tris,verts)

def prebuildDynamicMapingDialog():
    global slVar, slMesh, xrData
    state = LOADINGMETA

    divLoading = Div(text="loading metadata...")
    curdoc().clear()
    l = layout([
    [widgetbox(divLoading)]
    ])
    curdoc().add_root(l)

    try:
        xrData = xr.open_dataset(getURL(),decode_cf=False)
    except:
        divError = Div(text="Failed to load metadata")
        curdoc().clear()
        l = layout([
        [widgetbox(divError)]
        ])
        curdoc().add_root(l)
        state = ERROR
        return


    state = LOADEDMETA
    variables = ["None"]
    meshOptions = ["calculate", "DOM1", "DOM2 (not implemented)", "DOM3 (not implemented)"]
    for k,v in xrData.variables.items():
        variables.append(k)

    slVar = bokeh.models.Select(title="Variable", options=variables, value="None")
    slMesh = bokeh.models.Select(title="Mesh", options=meshOptions, value="DOM1")

    btShow = bokeh.models.Button(label="show")
    btShow.on_click(mainbuildDynamicMapDialog)

    curdoc().clear()
    l = layout([
    [widgetbox(slVar)],
    [widgetbox(slMesh)],
    [widgetbox(btShow)]
    ])
    curdoc().add_root(l)


def variableUpdate(attr,old,new):
    """
    This function is only a wrapper round the main function for building the buildDynamicMap.
    It is called if at property like the cmap is changed and the whole buildDynamicMap needs
    to be rebuild.
    """
    variable = new
    mainbuildDynamicMapDialog()


def cmapUpdate(attr, old, new):
    """
    This function is only a wrapper round the main function for building the buildDynamicMap.
    It is called if at property like the cmap is changed and the whole buildDynamicMap needs
    to be rebuild.
    """
    mainbuildDynamicMapDialog()

def mainbuildDynamicMapDialog():
    global slVar, slCMap, txTitle
    global tmPlot, xrData

    state =LOADING

    if slVar is not None:
        variable = slVar.value
    if slCMap is not None:
        cm = slCMap.value
    else:
        cm = COLORMAPS[0]

    variables = ["None"]
    for k,v in xrData.variables.items():
        variables.append(k)

    if slVar is None:
        slVar = bokeh.models.Select(title="Variable", options=variables, value="None")

    if slCMap is None:
        slCMap = bokeh.models.Select(title="Colormap", options=COLORMAPS, value="Magma")

    if txTitle is None:
        txTitle = bokeh.models.TextInput(value="TR_stn, height ...", title="Title:")

    txPre = bokeh.models.PreText(text=str(xrData),width=800)
    cbOpts = bokeh.models.CheckboxButtonGroup(
        labels=["Colorbar", "x-Axis", "y-Axis"], active=[1, 1, 1])

    btShow = bokeh.models.Button(label="show")
    btShow.on_click(mainbuildDynamicMapDialog)

    slVar.on_change("value",variableUpdate)
    slCMap.on_change("value",cmapUpdate)


    variable = slVar.value
    title = txTitle.value
    cm = slCMap.value

    divLoading = Div(text="loading buildDynamicMap...")
    curdoc().clear()
    l = layout([
        [widgetbox(divLoading)]
    ])
    curdoc().add_root(l)

    if xrData is None:
        xrData = loadData(getURL())

    if tmPlot is None:
        (tris, verts) = loadMesh(xrData)
        tmPlot = TriMeshPlot(xrData, tris, verts, cm=cm)

    plot = renderer.get_widget(tmPlot.getPlotObject(variable=variable,title=title,cm=cm),'widgets')
    print(plot.state)
    curdoc().clear()
    l = layout([
        [widgetbox(txTitle)],
        [widgetbox(slVar)],
        [widgetbox(cbOpts)],
        [widgetbox(slCMap)],
        [plot.state],
        [widgetbox(txPre)]
    ])

    curdoc().add_root(l)
    state = LOADED

# This function is showing the landingpage. Here one could enter the url for the datasource.
# Entering the url is the first step in the dialog
def entry(doc):
    doc.title = 'ncview2'
    btLoad = bokeh.models.Button(label="load")
    btLoad.on_click(prebuildDynamicMapingDialog)

    doc.clear()
    l = layout([
    [widgetbox(urlinput)],
    [widgetbox(btLoad)]
    ])
    doc.add_root(l)


entry(curdoc())

#!/usr/bin/python


import pandas as pd
import xarray as xr
import holoviews as hv
import numpy as np


from .Plot import Plot

class HeightProfilePlot(Plot):
    def getPlotObject(self, variable, title, aggDim="None", aggFn="None",cm="Magma", cSymmetric=False, cLogZ=False, cLevels=0, dataUpdate=True):
        """
        Function that builds up a plot object for Bokeh to display
        Returns:
            : a plot object
        """
        self.variable = variable
        self.title = title

        self.aggDim = aggDim
        self.aggFn = aggFn

        self.cm = cm

        # Implement maximum and minimum to use this part TODO
        #self.useFixColoring = useFixColoring
        #self.fixColoringMin = fixColoringMin
        #self.fixColoringMax = fixColoringMax

        self.cSymmetric = cSymmetric
        self.cLogZ = cLogZ

        self.cLevels = cLevels

        self.dataUpdate = dataUpdate

        # Dirty! Fix this TODO
        if self.aggDim == "heightProfile":
            self.cells = []
            for i in range(0,360):
                self.cells.append(np.loadtxt("dom01/dom01_lon_"+str(i)+"deg.dat",dtype='int16'))
            self.logger.info("Loaded dom files!")

        # Builds up the free and non-free dimensions array
        self.buildDims()
        return self.buildDynamicMap()

    def buildDynamicMap(self):
        ranges = self.getRanges()

        # TODO do not hardcode the sizes
        totalgraphopts = {"height": 150, "width": 300}

        self.freeDims.remove("hi")
        if len(self.freeDims) > 0:
            self.logger.info("Show with DynamicMap")
            dm = hv.DynamicMap(self.buildHeightProfilePlot, kdims=self.freeDims).redim.range(**ranges)
            return self.renderer.get_plot(dm.opts(**totalgraphopts))
        else:
            # This is needed as DynamicMap is not working with an empty kdims array.
            self.logger.info("Show without DynamicMap")
            return self.renderer.get_plot(self.buildHeightProfilePlot().opts(**totalgraphopts))

    def buildHeightProfilePlot(self, *args):
        """
        Function that builds up the HeightProfile-Graph
        Args:
            Take multiple arguments.
        Returns:
            The Curve-Graph object
        """

        self.logger.info("FreeDims: %s" % str(self.freeDims))
        selectors = self.buildSelectors(args)
        self.logger.info("Loading data")

        # PERFORMANCE: Not optimal. Load cells via isel only one time should be faster
        if self.dataUpdate == True:
            if self.aggFn == "mean":
                self.dat = [[getattr(self.xrData, self.variable).isel(**selectors, height=h, ncells=self.cells[i]).mean() for i in range(0,360)] for h in range(0,90)]
            elif self.aggFn == "sum":
                self.dat = [[getattr(self.xrData, self.variable).isel(**selectors, height=h, ncells=self.cells[i]).sum() for i in range(0,360)] for h in range(0,90)]


        # TODO Apply unit
        #factor = 1
        #dat = dat * factor

        # TODO Dimensions hardcoded
        res = hv.Image((range(360), range(90), self.dat), datatype=['grid'], label=self.title).opts(xlabel="Longitude", ylabel="height",cmap=self.cm,symmetric=self.cSymmetric,logz=self.cLogZ,color_levels=self.cLevels,colorbar=True)

        return res

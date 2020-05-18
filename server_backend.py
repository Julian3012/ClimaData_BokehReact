import math
import logging
import time

from main_backend import PlotGenerator

import json
from bokeh.embed import json_item
from flask import Flask, request
from flask_cors import CORS
from gevent.pywsgi import WSGIServer
from werkzeug.serving import run_with_reloader
from werkzeug.debug import DebuggedApplication

app = Flask(__name__)
# CORS enabled so react frontend can pull data from python backend
CORS(app)

PARAMS = {
    "dataPath": "2016032700-ART-chemtracer_grid_DOM01_PL_0007.nc",
    "mesh": "DOM1",
    "variable": "TR_stn",
    "showCoastline": True,
    "colorMap": "Blues",
    "fixColoring": False,
    "symColoring": False,
    "logzColoring": False,
    "colorLevels": 0,
    "aggregateDim": "None",
    "aggregateFun": "None",
}

plot1 = PlotGenerator()
logger = plot1.logger

@app.route("/postParams", methods=["POST"])
def postParams():
    global PARAMS

    if request.method == "POST":
        PARAMS = request.get_json()["state"]
        plot1.setParams(PARAMS)
        plot1.mainDialog(True)
        logger.info(plot1.parameter)

    return ""

@app.route("/pushParams")
def pushParams():

    return json.dumps(plot1.parameter)

@app.route("/pushVariables")
def pushVariables():

    return plot1.getVariables()


@app.route("/pushAggDim")
def pushAggDim():

    return plot1.getAggDim()


@app.route("/plot1")
def startPlot1():

    return plot1.mainDialog(True)


# @app.route("/plot2")
# def startPlot2():
#     return plots.mainDialog(True)

# @app.route("/plot3")
# def startPlot3():
#     return plots.mainDialog(True)

# @app.route("/plot4")
# def startPlot4():
#     return plots.mainDialog(True)


@run_with_reloader
def run_server():
    print("Listening on HTTP port 5000")
    http_server = WSGIServer(("", 5000), DebuggedApplication(app))
    http_server.serve_forever()


if __name__ == "__main__":
    run_server()

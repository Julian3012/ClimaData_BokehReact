import math
import logging
import time

from main_local_new import PlotGenerator

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

params = {
    "dataPath": None
}

logger = None

@app.route("/params", methods=["POST","GET"])
def postParams():
    global params

    json_request = {}
    if request.method == "POST":
        json_request = request.get_json()["state"]
        logger.info("Params loaded")
  
    params = json_request
    return ""

@app.route("/plot1")
def startPlot1():
    global logger

    plot = PlotGenerator()
    logger = plot.logger
    return plot.mainDialog(True)

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
    http_server = WSGIServer(('', 5000), DebuggedApplication(app))
    http_server.serve_forever()

if __name__ == "__main__":
    run_server()
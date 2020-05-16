import math
import logging
import time

import main_local_new as plots

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

@app.route("/params", methods=["POST"])
def postParams():
    global params

    json_request = {}
    if request.method == "POST":
        json_request = request.get_json()["state"]

    params = json_request
    plots.logger.info("Params loaded")

    return ""

@app.route("/plot1")
def startPlot1():
    return plots.mainDialog(True)

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
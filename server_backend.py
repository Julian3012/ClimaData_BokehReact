import math
import logging
import time

# from main_backend import PlotGenerator

import json
from flask import Flask, request, render_template
from flask_cors import CORS
from gevent.pywsgi import WSGIServer
from werkzeug.serving import run_with_reloader
from werkzeug.debug import DebuggedApplication

from bokeh.client import pull_session, show_session, push_session
from bokeh.embed import server_session

app = Flask(__name__)
# CORS enabled so react frontend can pull data from python backend
CORS(app)

PARAMS = {
    "dataPath": "2016032700-ART-chemtracer_grid_DOM01_PL_0007.nc",
    "mesh": "DOM1",
    "variable": "TR_stn",
    "showCoastline": True,
    "colorMap": "Inferno",
    "fixColoring": False,
    "symColoring": False,
    "logzColoring": False,
    "colorLevels": 0,
    "aggregateDim": "None",
    "aggregateFun": "None",
}

script = ""

# new_plot = PlotGenerator()
# new_plot.setParams(PARAMS)
# genNewPlot = new_plot.mainDialog(True)

app_url = "http://localhost:5010/main_local"

@app.route('/', methods=['GET'])
def bkapp_page():
    global script
    
    with pull_session(url=app_url) as session:

        # Path to all widgets
        first_widgets = session.document.roots[0].children

        # each widget alone
        fileText = first_widgets[0].children[0].children[0]
        variableSelect = first_widgets[1].children[0].children[0]
        meshSelect = first_widgets[2].children[0].children[0]
        show_btn = first_widgets[3].children[0].children[0]

        print("File: ",fileText.value)
        print("Variable: ",variableSelect.value)
        print("Mesh: ",meshSelect.value)
        print("Show Button: ",show_btn)

        # generate a script to load the customized session
        script = server_session(session_id=session.id, url=app_url)

        return render_template("embed.html",script=script,Template="Flask")

        # use the script in the rendered page

# plot1 = PlotGenerator()
# logger = plot1.logger
# plot = plot1.mainDialog(True)

# @app.route("/postParams", methods=["POST"])
# def postParams():
#     global PARAMS, plot

#     if request.method == "POST":
#         PARAMS = request.get_json()["state"]
#         plot1.setParams(PARAMS)
#         plot = plot1.mainDialog(True)
#         logger.info(plot1.parameter)

#     return ""

# @app.route("/pushParams")
# def pushParams():

#     return json.dumps(plot1.parameter)

# @app.route("/pushVariables")
# def pushVariables():

#     return plot1.getVariables()


# @app.route("/pushAggDim")
# def pushAggDim():

#     return plot1.getAggDim()

# @app.route("/plot1")
# def startPlot1():
#     global plot 
#     return plot


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

import math
import logging
import time

import json
from bs4 import BeautifulSoup as bs
from flask import Flask, request, render_template,jsonify
from flask_cors import CORS
from gevent.pywsgi import WSGIServer
from werkzeug.serving import run_with_reloader
from werkzeug.debug import DebuggedApplication

from bokeh.client import pull_session, show_session, push_session
from bokeh.embed import server_session
from bokeh.layouts import layout, WidgetBox, row, column
from bokeh.models import ColumnDataSource, Div, Select, CheckboxGroup, Button
from bokeh.models.widgets import TextInput

app = Flask(__name__)
# CORS enabled so react frontend can pull data from python backend
CORS(app)

app_url = "http://localhost:5010/main_backend"


@app.route("/script", methods=["GET"])
def bkapp_page():

    with pull_session(url=app_url) as session:

        # Path to all widgets
        widget_list = session.document.roots[0].children

        sessionInfo(widget_list)

        print("Id of widget: ",widget_list[3].children[0].children[0].children[0].id)
        widget_list[13].children[0].children[1].children[1].title = "Slider title"
        widget_list[3].children[0].children[0].children[0].title = "Slider title"

        # generate a script to load the customized session
        script = server_session(session_id=session.id, url=app_url)

        # Get tag values
        soup = bs(script,features="lxml")
        scriptId = soup.script["id"]
        scriptSrc = soup.script["src"]

        print("Script id: ",scriptId)
        print("Script src: ",scriptSrc)
        
        varJson = getJson(widget_list[3].children[0].children[0].children[0].options)
        aggDimJson = getJson(widget_list[10].children[0].children[0].children[0].options)

        plotJson = {
            "id": scriptId,
            "src": scriptSrc,
            "variables": varJson,
            "aggDim": aggDimJson
        }

        return jsonify(plotJson)

def getJson(itemList):

    jsonItems = []
    for item in itemList:
       entry = { "value": item, "label": item }
       jsonItems.append(entry)

    return jsonItems


def sessionInfo(widget_list):
    pos = 0
    for child in widget_list:
        try:
            widget = child.children[0].children[0]
            if isinstance(widget, WidgetBox):
                widget = child.children[0].children[0].children[0]
            else:
                figure = child.children[0].children[0]
                slider = child.children[0].children[1].children[1]

            if isinstance(widget, Button):
                print("Position ", pos, ": ", widget.label)
            elif isinstance(widget, CheckboxGroup):
                print("Position ", pos, ": ", widget.labels[0],": ",widget.active)
            elif isinstance(widget, Select):
                print("Position ", pos, ": ", widget.title, ": ", widget.value)
                # print("\tOptions: ", widget.options)
            elif isinstance(widget, TextInput):
                print("Position ", pos, ": ", widget.title, ": ", widget.value)
            else:
                print("Position ", pos, ": ", figure)
                print("Position ", pos, ": Slider: ", slider.value)
            pos += 1
        except Exception as e:
            print(e)


# @app.route("/script")
# def postScript():
#     global script
#     bkapp_page()
#     return jsonify(script)

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

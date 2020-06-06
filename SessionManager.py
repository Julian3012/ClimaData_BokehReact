from bokeh.client import pull_session, show_session, push_session
from bokeh.embed import server_session
from bokeh.layouts import layout, WidgetBox, row, column
from bokeh.models import ColumnDataSource, Div, Select, CheckboxGroup, Button
from bokeh.models.widgets import TextInput

import logging
from bs4 import BeautifulSoup as bs


class SessionManager:
    def __init__(self, app_url, session):
        # FORMAT = "%(asctime)-15s %(clientip)s %(user)-8s %(message)s"
        # logging.basicConfig(format=FORMAT,level=logging.DEBUG)
        # self.logger = logging.getLogger("Session Manager")
        # self.logger.setLevel(logging.DEBUG)

        self.app_url = app_url
        self.session = session
        self.scriptSrc = ""
        self.idTag = ""
        self.sessionIds = {}
        self.sessionValues = {}
        self.optVars = {}
        self.optAggDim = {}

        self.initScript()
        self.initValues()

    def initScript(self):

        # generate a script to load the customized session
        script = server_session(session_id=self.session.id, url=self.app_url)

        # Get source, id tag and session
        soup = bs(script, features="lxml")
        self.idTag = soup.script["id"]
        self.scriptSrc = soup.script["src"]

        print("Script tag generated")
        # self.logger.info("Session pulled")

    def initValues(self):
        valueDict = {}
        valueDict["ids"] = {}
        valueDict["values"] = {}

        widget_list = self.session.document.roots[0].children
        for child in widget_list:
            try:
                widget = child.children[0].children[0]
                if isinstance(widget, WidgetBox):
                    widget = child.children[0].children[0].children[0]
                else:
                    figure = child.children[0].children[0]
                    slider = child.children[0].children[1].children[1]

                if isinstance(widget, Button):
                    valueDict["ids"][widget.label] = widget.id
                elif isinstance(widget, CheckboxGroup):
                    valueDict["ids"][widget.labels[0]] = widget.id
                    valueDict["values"][widget.labels[0]] = widget.active
                elif isinstance(widget, Select):
                    valueDict["ids"][widget.title] = widget.id
                    valueDict["values"][widget.title] = widget.value
                elif isinstance(widget, TextInput):
                    valueDict["ids"][widget.title] = widget.id

                    if widget.title == "Colorlevels":
                        valueDict["values"][widget.title] = int(widget.value)
                    else:
                        valueDict["values"][widget.title] = widget.value
                else:
                    valueDict["ids"]["figure.label"] = figure.id
                    valueDict["ids"]["slider.label"] = slider.id
                    valueDict["values"]["slider.label"] = slider.value

            except Exception as e:
                print(e)

        self.optVars = self.genJson(
            widget_list[3].children[0].children[0].children[0].options
        )
        self.optAggDim = self.genJson(
            widget_list[10].children[0].children[0].children[0].options
        )
        self.sessionIds = valueDict["ids"]
        self.sessionValues = valueDict["values"]
        # self.logger.info("Ids and values loaded")

    def modifiySession(self, parameter):

        # with pull_session(url=self.app_url) as session:
        try:
            self.changeValues(parameter)
            print(self.session.document)
            print(self.session.id)
            push_session(document=self.session.document, session_id=self.session.id, url=self.app_url)
            print("finished push")
        except Exception as e:
            print(e)

    def changeValues(self, parameter, session):
        self.session = session

        if parameter["file"] != self.sessionValues["File"]:
            self.session.document.roots[0].children[0].children[0].children[0].children[0].value = parameter["file"]
        print("file checked")

        if parameter["mesh"] != self.sessionValues["Mesh"]:
            self.session.document.roots[0].children[1].children[0].children[0].children[0].value = parameter["mesh"]
        print("mesh checked")

        # if parameter["title"] != self.sessionValues["Title"]:
        #     self.session.document.roots[0].children[2].children[0].children[0].children[0].value = parameter["title"]

        if parameter["variable"] != self.sessionValues["Variable"]:
            self.session.document.roots[0].children[3].children[0].children[0].children[0].value = parameter["variable"]
        print("variable checked")

        coastline = [0] if parameter["showCoastline"] == True else []
        if coastline != self.sessionValues["Show coastline"]:
            self.session.document.roots[0].children[4].children[0].children[0].children[0].active = coastline
        print("showCoastline checked")

        if parameter["colorMap"] != self.sessionValues["Colormap"]:
            self.session.document.roots[0].children[5].children[0].children[0].children[0].value = parameter["colorMap"]
        print("colorMap checked")

        fixColoring = [0] if parameter["fixColoring"] == True else []
        if fixColoring != self.sessionValues["Use fixed coloring"]:
            self.session.document.roots[0].children[6].children[0].children[0].children[0].active = fixColoring
        print("fixColoring checked")

        symColoring = [0] if parameter["symColoring"] == True else []
        if symColoring != self.sessionValues["symmetric coloring"]:
            self.session.document.roots[0].children[7].children[0].children[0].children[0].active = symColoring
        print("symColoring checked")

        logzColoring = [0] if parameter["logzColoring"] == True else []
        if logzColoring != self.sessionValues["logz coloring"]:
            self.session.document.roots[0].children[8].children[0].children[0].children[0].active = logzColoring
        print("logzColoring checked")

        if parameter["colorLevels"] != self.sessionValues["Colorlevels"]:
            self.session.document.roots[0].children[9].children[0].children[0].children[0].value = parameter["colorLevels"]
        print("colorLevels checked")

        if parameter["aggregateDim"] != self.sessionValues["Aggregate Dimension"]:
            self.session.document.roots[0].children[10].children[0].children[0].children[0].value = parameter["aggregateDim"]
        print("aggregateDim checked")

        if parameter["aggregateFun"] != self.sessionValues["Aggregate Function"]:
            self.session.document.roots[0].children[11].children[0].children[0].children[0].value = parameter["aggregateFun"]

        print("changeValues() done")
        
        return self.session

    def genJson(self, itemList):
        jsonItems = []
        for item in itemList:
            entry = {"value": item, "label": item}
            jsonItems.append(entry)
        return jsonItems

    def getAggDim(self):
        return self.optAggDim

    def getVars(self):
        return self.optVars

    def getAppUrl(self):
        return self.app_url

    def getIdTag(self):
        return self.idTag

    def getScriptSrc(self):
        return self.scriptSrc

    def getSession(self):
        return self.session

    def getSessionIds(self):
        return self.sessionIds

    def getSessionValues(self):
        return self.sessionValues

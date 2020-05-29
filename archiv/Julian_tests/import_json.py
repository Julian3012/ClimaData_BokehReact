import json

from flask import Flask
from jinja2 import Template

from bokeh.embed import json_item
from bokeh.plotting import figure
from bokeh.resources import CDN

from ...main_backend import PlotGenerator


app = Flask(__name__)

plot = PlotGenerator()


page = Template("""
<!DOCTYPE html>
<html lang="en">
<head>
  {{ resources }}
</head>
<body>
  <div id="myplot"></div>
  <script>
  fetch('/plot')
    .then(function(response) { return response.json(); })
    .then(function(item) { return Bokeh.embed.embed_item(item); })
  </script>
</body>
""")



@app.route('/')
def root():
    return page.render(resources=CDN.render())

@app.route('/plot')
def plot1():

    return plot.mainDialog(True)

if __name__ == '__main__':
    app.run()
import random
from bokeh.models import (HoverTool, FactorRange, Plot, LinearAxis, Grid,
                          Range1d)
from bokeh.models.glyphs import VBar
from bokeh.plotting import figure
from bokeh.embed import components
from bokeh.models.sources import ColumnDataSource
from flask import Flask, render_template

app = Flask(__name__)


@app.route("/<int:bars_count>/")
def chart(bars_count):
    if bars_count <= 0:
        bars_count = 1

    data = {"days": [], "bugs": [], "costs": []}
    for i in range(1, bars_count + 1):
        data['days'].append(i)
        data['bugs'].append(random.randint(1,100))
        data['costs'].append(random.uniform(1.00, 1000.00))

    hover = create_hover_tool()
    plot = create_bar_chart(data, "Bugs found per day", "days",
                            "bugs", hover)
    script, div = components(plot)

    return render_template("chart.html", bars_count=bars_count,
                           the_div=div, the_script=script)

def create_hover_tool():
    # we'll code this function in a moment
    return None


def create_bar_chart(data, title, x_name, y_name, hover_tool=None,
                     width=1200, height=300):
    p = figure(plot_width=400, plot_height=400)

# add a circle renderer with a size, color, and alpha
    p.circle(data['days'], data['bugs'], size=20, color="navy", alpha=0.5)

    return p

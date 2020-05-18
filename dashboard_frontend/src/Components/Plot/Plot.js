import React, { Component } from 'react';
import Axios from 'axios';

// ran into this issue (hence no npm import of bokehjs):
// https://github.com/bokeh/bokeh/issues/8197

class Plot extends Component {

  getPlot1 = () => {
    Axios.get("http://localhost:5000/plot1").then(resp => window.Bokeh.embed.embed_item(resp.data, 'plot1'))
  }

  componentDidMount() {
    this.getPlot1();
    console.log("Plot: Component did mount");
  }

  render() {
    return (
      <div className="Plot" style={{ margin: 20 }}>
        <div id='plot1' className="bk-root" ></div>
      </div>
    );
  }
}

export default Plot;

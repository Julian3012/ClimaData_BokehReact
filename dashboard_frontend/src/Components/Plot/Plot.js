import React, { Component } from 'react';
import Axios from 'axios';

// ran into this issue (hence no npm import of bokehjs):
// https://github.com/bokeh/bokeh/issues/8197

class Plot extends Component {

  getPlot1 = () => {
    Axios.get("http://localhost:5000/plot1").then(resp => window.Bokeh.embed.embed_item(resp.data, 'plot1'))
  }


  componentDidMount () {
    const script = document.createElement("script");
    script.src = "http://localhost:5010/main_local/autoload.js?bokeh-autoload-element=1060&bokeh-app-path=/main_local&bokeh-absolute-url=http://localhost:5010/main_local&bokeh-session-id=vth0mw5Mdy8t8J76XaTXhM0pNZ65UBfFBCZKLkREpaaG";
    script.async = true;

    document.body.appendChild(script);
}

  render() {
    return (
      <div className="Plot" style={{ margin: 20 }}>
        <div id="1060"/>
      </div>
    );
  }
}

export default Plot;

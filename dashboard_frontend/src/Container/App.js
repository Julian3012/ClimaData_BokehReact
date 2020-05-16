import React, { Component } from 'react';
import Sidebar from "../Components/Sidebar/Sidebar"
import Axios from 'axios';

// ran into this issue (hence no npm import of bokehjs):
// https://github.com/bokeh/bokeh/issues/8197

class App extends Component {

  getPlot1 = () => {
    Axios.get("http://localhost:5000/plot1").then(resp => window.Bokeh.embed.embed_item(resp.data, 'plot1'))
  }

  // getPlot2 = () => {
  //   Axios.get("http://localhost:5000/plot2").then(resp => window.Bokeh.embed.embed_item(resp.data, 'plot2'))
  // }

  // getPlot3 = () => {
  //   Axios.get("http://localhost:5000/plot3").then(resp => window.Bokeh.embed.embed_item(resp.data, 'plot3'))
  // }

  // getPlot4 = () => {
  //   Axios.get("http://localhost:5000/plot4").then(resp => window.Bokeh.embed.embed_item(resp.data, 'plot4'))
  // }



  componentDidMount() {
    this.getPlot1();
    // this.getPlot2();
    // this.getPlot3();
    // this.getPlot4();
    console.log("Component did mount");
  }

  render() {
    return (
      <div className="App" style={{ margin: 20 }}>
        <Sidebar></Sidebar>
        <div id='plot1' className="bk-root" onChange={this.getPlot1}></div>
        {/* <div id='plot2' className="bk-root" onChange={this.getPlot2}></div>
        <div id='plot3' className="bk-root" onChange={this.getPlot2}></div>
        <div id='plot4' className="bk-root" onChange={this.getPlot2}></div> */}
      </div>
    );
  }
}

export default App;

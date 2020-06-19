import React, { Component } from 'react';
import Axios from 'axios';
// import { Autoload } from "./Autoload.js";

class Plot extends Component {

  render() {
    return (
      <div className="Plot" style={{ margin: 20 }}>
        <div id={this.props.id}></div>
      </div>
    );
  }
}

export default Plot;

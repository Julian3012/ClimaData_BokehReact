import React, { Component } from 'react';

class Plot extends Component {

  marginPlot = (active) => {
    if (active){
      return "23%"
    } else {
      return "15%"
    }
  }

  render() {
    const plotStyle = {
      marginTop: 70,
      marginLeft: this.marginPlot(this.props.activeSidebar)
    }
      return (
        <div className="Plot" id={this.props.plotId} style={plotStyle}></div>
      )
  }
}

export default Plot;

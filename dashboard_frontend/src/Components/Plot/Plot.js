import React, { Component } from 'react';

class Plot extends Component {

  render() {
      return (
        <div className="Plot" id={this.props.plotId}></div>
      )
  }
}

export default Plot;

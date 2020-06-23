import React, { Component } from 'react';

class Plot extends Component {

  render() {
    return (
      <div className="Plot">
        <div id={this.props.id}></div>
      </div>
    );
  }
}

export default Plot;

import React, { Component } from 'react';
import Axios from 'axios';

// ran into this issue (hence no npm import of bokehjs):
// https://github.com/bokeh/bokeh/issues/8197

class Plot extends Component {
  state = {
    script: "",
    src: "",
    id: ""
  }

  getScript = () => {
    Axios.get("http://localhost:5000/script").then((response) => {
      return { src: response.data.src, id: response.data.id}
      // this.setState({ src: response.data.src, id: response.data.id});
      // console.log("Src: " + this.state.src)
      // console.log("Id: " + this.state.id)
  }).then((data) => {
    this.setState({ src: data.src, id: data.id});
    const script = document.createElement("script");
    script.src = this.state.src;
    script.async = true;
    document.body.appendChild(script);
  })
  }

  componentDidMount() {
    this.getScript();
  }

  render() {
    return (
      <div className="Plot" style={{ margin: 20 }}>
        <div id={this.state.id} />
      </div>
    );
  }
}

export default Plot;

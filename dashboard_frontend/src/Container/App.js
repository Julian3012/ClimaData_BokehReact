import React, { Component } from 'react';
import Sidebar from "../Components/Sidebar/Sidebar"
import Axios from 'axios';

// ran into this issue (hence no npm import of bokehjs):
// https://github.com/bokeh/bokeh/issues/8197

class App extends Component {


  render() {
    return (
      <div className="App" style={{ margin: 20 }}>
        <Sidebar></Sidebar>
      </div>
    );
  }
}

export default App;

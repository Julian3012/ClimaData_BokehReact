import React, { Component } from 'react';
import Sidebar from "../Components/Sidebar/Sidebar"
import Plot from "../Components/Plot/Plot"
import * as constants from "../Components/constants"
import './App.css';


// ran into this issue (hence no npm import of bokehjs):
// https://github.com/bokeh/bokeh/issues/8197

class App extends Component {

  constructor(props) {
    super(props);
    console.log('[Sidebars.js] constructor');

    this.state = {
      file: "2016032700-ART-chemtracer_grid_DOM01_PL_0007.nc",
      mesh: "DOM1", 
      variable: "clon", 
      showCoastline: true,  
      colorMap: "Blues", 
      fixColoring: false, 
      symColoring: false, 
      logzColoring: false, 
      colorLevels: 0, 
      aggregateDim: "None", 
      aggregateFun: "None", 
      filePos: 0,
      meshPos: 1, 
      variablePos: 3, 
      showCoastlinePos: 4,  
      colorMapPos: 5, 
      fixColoringPos: 6, 
      symColoringPos: 7, 
      logzColoringPos: 8, 
      colorLevelsPos: 9, 
      aggregateDimPos: 10, 
      aggregateFunPos: 11, 
      aggDimSelect: [{
        value: "None",
        label: "None",
      }], 
      variables: [{
        value: "TR_stn",
        label: "TR_stn",
      }], 
      sessionIds: {},
      id: "",
      src: "",
      model: "",
      sliderDisabled: false,
      startMarks: 10,
      endMarks: 100
    };
  }


  componentDidMount() {
    this.appendScript().then(setTimeout(this.initState, 2000));
    // setTimeout(this.getBokehInfo, 3000);
  }

  getBokehInfo = () => {
    console.log(this.state)
  }

  getMesh = () => {
    if (this.state.file.includes("DOM1")) {
      this.setState({})
    }
  }

  appendScript = () => {
    return new Promise((resolve) => {

      const script = document.createElement("script");
      script.src = "http://localhost:5010/main_backend/autoload.js?bokeh-autoload-element=5023&bokeh-app-path=/main_backend&bokeh-absolute-url=http://localhost:5010/main_backend&bokeh-session-id=xdGdOjpUPyKW23owmGVIJmWm0zYNjMlWkHvBCOwZWwFE";
      script.async = true;
      document.body.appendChild(script);

      resolve(true)
    })
  }

  initState = (event) => {
    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    let optsVar = this.mkOptions(model.attributes.children[3].attributes.children[0].attributes.children[0].attributes.children[0].options);
    let optsAd = this.mkOptions(model.attributes.children[10].attributes.children[0].attributes.children[0].attributes.children[0].options);
    this.setState({ variables: optsVar });
    this.setState({ aggDimSelect: optsAd });

    // this.setState({ model: model });

    console.log(this.state)

    this.setState({ file: model.attributes.children[0].attributes.children[0].attributes.children[0].attributes.children[0].value });

    this.setState({ variable: model.attributes.children[3].attributes.children[0].attributes.children[0].attributes.children[0].value });

    const hasCoastline = this.getActiveEvent(model.attributes.children[4].attributes.children[0].attributes.children[0].attributes.children[0].active);
    this.setState({ showCoastline: hasCoastline});

    this.setState({ colorMap: model.attributes.children[5].attributes.children[0].attributes.children[0].attributes.children[0].value });

    const hasFixedColoring = this.getActiveEvent(model.attributes.children[6].attributes.children[0].attributes.children[0].attributes.children[0].active);
    this.setState({ fixColoring: hasFixedColoring});

    const hasSymColoring = this.getActiveEvent(model.attributes.children[7].attributes.children[0].attributes.children[0].attributes.children[0].active);
    this.setState({ symColoring: hasSymColoring});

    const hasLogzColoring = this.getActiveEvent(model.attributes.children[8].attributes.children[0].attributes.children[0].attributes.children[0].active);
    this.setState({ logzColoring: hasLogzColoring});

    this.setState({ colorLevels: model.attributes.children[9].attributes.children[0].attributes.children[0].attributes.children[0].value });

    let aggregateDim = model.attributes.children[10].attributes.children[0].attributes.children[0].attributes.children[0].value;
    if(aggregateDim === null){
      aggregateDim = "None";
    }

    this.setState({ aggregateDim: aggregateDim });

    this.setState({ aggregateFun: model.attributes.children[11].attributes.children[0].attributes.children[0].attributes.children[0].value });

    this.isActiveSlider();

    console.log("model loaded")
  }

  mkOptions = (option) => {
    let arr = []
    option.map(el => {
      arr.push({ label: el, value: el })
    });
    return arr;
  }

  setColorMap = (event) => {
    this.setState({ colorMap: event.target.value })
    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[5].attributes.children[0].attributes.children[0].attributes.children[0].value = event.target.value

    console.log("Changed colormap")
  };

  setActiveEvent = (doesShow) => {
    if (doesShow === true) {
      return []
    } else {
      return [0]
    }
  }

  getActiveEvent = (val) => {
    if (val[0] == 0) {
      return true;
    } else {
      return false;
    }
  }

  setShowCoastline = (event) => {
    let doesShow = this.state.showCoastline;
    this.setState({ showCoastline: !doesShow })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[4].attributes.children[0].attributes.children[0].attributes.children[0].active = this.setActiveEvent(doesShow);

    console.log("State showCoastline changed")
  };

  setFixColoring = (event) => {
    let doesShow = this.state.fixColoring;
    this.setState({ fixColoring: !doesShow })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[6].attributes.children[0].attributes.children[0].attributes.children[0].active = this.setActiveEvent(doesShow);

    console.log("State fixColoring changed")
  };

  setSymColoring = (event) => {
    let doesShow = this.state.symColoring;
    this.setState({ symColoring: !doesShow })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[7].attributes.children[0].attributes.children[0].attributes.children[0].active = this.setActiveEvent(doesShow);

    console.log("State symColoring changed")
  };

  setLogzColoring = (event) => {
    let doesShow = this.state.logzColoring;
    this.setState({ logzColoring: !doesShow })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[8].attributes.children[0].attributes.children[0].attributes.children[0].active = this.setActiveEvent(doesShow);

    console.log("State logzColoring changed")
  };

  setMesh = (event) => {
    this.setState({ mesh: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[1].attributes.children[0].attributes.children[0].attributes.children[0].value = event.target.value;

    console.log("State mesh changed")
  };

  setAggregateFun = (event) => {
    this.setState({ aggregateFun: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[11].attributes.children[0].attributes.children[0].attributes.children[0].value = event.target.value;

    console.log("State aggregateFun changed")
  };

  setAggregateDim = (event) => {
    this.setState({ aggregateDim: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[10].attributes.children[0].attributes.children[0].attributes.children[0].value = event.target.value;

    console.log("State aggregateDim changed")
  };

  setColorLevels = (event) => {
    this.setState({ colorLevels: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[9].attributes.children[0].attributes.children[0].attributes.children[0].value = event.target.value;

    console.log("State colorLevels changed")
  };

  setVariable = (event) => {
    this.setState({ variable: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[3].attributes.children[0].attributes.children[0].attributes.children[0].value = event.target.value;

    this.isActiveSlider();
    console.log("State variable changed")
  };

  setDataPath = (event) => {
    this.setState({ file: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    model.attributes.children[0].attributes.children[0].attributes.children[0].attributes.children[0].value = event.target.value;

    console.log("State file changed")
  };

  setHeight = () => {
    let height = "";
    if (this.state.file.includes("ML")) {
      height = "height"
    } else if (this.state.file.includes("PL")) {
      height = "lev"
    } else {
      height = "alt"
    };
    return height;
  }

  isActiveSlider = () => {
    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    let hasSlider = model.children[13].attributes.children[0].attributes.hasOwnProperty("children");
    console.log("Slider active: " + hasSlider);

    if (hasSlider) {
      let slider = model.attributes.children[13].attributes.children[0].attributes.children[1].attributes.children[1];

      this.setState({ endMarks: slider.end });
      this.setState({ startMarks: slider.start });

      return this.setState({ sliderDisabled: false });;
    } else {
      return this.setState({ sliderDisabled: true });
    }
  }

  sliderMarks = () => {
    console.log("Slider active: " + this.isActiveSlider)
    if (this.isActiveSlider) {
      let model = window.Bokeh.documents[0].get_model_by_id("1000");
      let slider = model.attributes.children[13].attributes.children[0].attributes.children[1].attributes.children[1]
      let marks = [{
        value: slider.start,
        label: toString(slider.start)
      },
      {
        value: slider.end,
        label: toString(slider.end)
      }]
      return marks;
    } else {
      return [{
        value: -1,
        label: "undef"
      }]
    }
  }

  startMarks = () => {
    if (this.state.isActiveSlider) {
      let model = window.Bokeh.documents[0].get_model_by_id("1000");
      let slider = model.attributes.children[13].attributes.children[0].attributes.children[1].attributes.children[1]
      return this.setState({ startMarks: slider.start })
    }
  }

  endMarks = () => {
    if (this.state.isActiveSlider) {
      let model = window.Bokeh.documents[0].get_model_by_id("1000");
      let slider = model.attributes.children[13].attributes.children[0].attributes.children[1].attributes.children[1]
      return this.setState({ endMarks: slider.end })
    }
  }

  render() {
    const meshSelect = constants.meshSelect;
    const cmSelect = constants.cmSelect;
    const funcSelect = constants.funcSelect;

    return (
      <div className="App" style={{ margin: 20 }}>
        <Sidebar
          txLabFile="Filepath"
          txValFile={this.state.file}
          txChFile={this.setDataPath}

          selLabVar="Variable"
          selValVar={this.state.variable}
          selChVar={this.setVariable}
          selMapVar={this.state.variables}

          cbLabCl="Show Coastline"
          cbStCl={this.state.showCoastline}
          cbChCl={this.setShowCoastline}

          cbLabFc="Fix Coloring"
          cbStFc={this.state.fixColoring}
          cbChFc={this.setFixColoring}

          cbLabSc="Symmetric Coloring"
          cbStSc={this.state.symColoring}
          cbChSc={this.setSymColoring}

          cbLabLc="Log z Coloring"
          cbStLc={this.state.logzColoring}
          cbChLc={this.setLogzColoring}

          selLabMesh="Mesh"
          selValMesh={this.state.mesh}
          selChMesh={this.setMesh}
          selMapMesh={meshSelect}

          selLabCm="Colormap"
          selValCm={this.state.colorMap}
          selChCm={this.setColorMap}
          selMapCm={cmSelect}

          selLabAd="Aggregate Dimension"
          selValAd={this.state.aggregateDim}
          selChAd={this.setAggregateDim}
          selMapAd={this.state.aggDimSelect}

          selLabAf="Aggregate Function"
          selValAf={this.state.aggregateFun}
          selChAf={this.setAggregateFun}
          selMapAf={funcSelect}

          txLabCol="Color Levels"
          txChCol={this.setColorLevels}
          txValCol={this.state.colorLevels}

          marksStart={this.state.startMarks}
          marksEnd={this.state.endMarks}
          isActiveSlider={this.state.sliderActive}

          btClick={this.getBokehInfo}
        />
        <Plot id={5023}></Plot>
      </div>
    );
  }
}

export default App;

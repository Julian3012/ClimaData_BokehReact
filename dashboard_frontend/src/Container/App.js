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
      positions: {
        file: 0,
        mesh: 1,
        title: 2,
        variable: 3,
        showCoastline: 4,
        colorMap: 5,
        fixColoring: 6,
        symColoring: 7,
        logzColoring: 8,
        colorLevels: 9,
        fixColMin: 10,
        fixColMax: 11,
        logx: 12,
        logy: 13,
        aggregateDim: 14,
        aggregateFun: 15,
        uselessBtn: 16,
        slider: 17
      },
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
      sliderStart: 0,
      sliderEnd: 20
    };
  }

  componentDidMount() {
    this.appendScript().then(setTimeout(this.initState, 2000));
  }

  getWidget = (model, position) => {
    if (position <= 16) {
      return model.attributes.children[position].attributes.children[0].attributes.children[0].attributes.children[0]
    } else if (position === 17) {
      return model.attributes.children[position].attributes.children[0].attributes.children[1].attributes.children[1]
    } else {
      console.log("Position value does not exist")
    }
  }

  getBokehInfo = () => {
    console.log(this.state)
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
    let optsVar = this.mkOptions(this.getWidget(model,this.state.positions.variable).options);
    let optsAd = this.mkOptions(this.getWidget(model,this.state.positions.aggregateDim).options);
    this.setState({ variables: optsVar });
    this.setState({ aggDimSelect: optsAd });

    // this.setState({ model: model });

    console.log(this.state)

    this.setState({ file: this.getWidget(model,this.state.positions.file).value });

    this.setState({ variable: this.getWidget(model,this.state.positions.variable).value });

    const hasCoastline = this.getActiveEvent(this.getWidget(model,this.state.positions.showCoastline).active);
    this.setState({ showCoastline: hasCoastline });

    this.setState({ colorMap: this.getWidget(model,this.state.positions.colorMap).value });

    const hasFixedColoring = this.getActiveEvent(this.getWidget(model,this.state.positions.fixColoring).active);
    this.setState({ fixColoring: hasFixedColoring });

    const hasSymColoring = this.getActiveEvent(this.getWidget(model,this.state.positions.symColoring).active);
    this.setState({ symColoring: hasSymColoring });

    const hasLogzColoring = this.getActiveEvent(this.getWidget(model,this.state.positions.logzColoring).active);
    this.setState({ logzColoring: hasLogzColoring });

    this.setState({ colorLevels: this.getWidget(model,this.state.positions.colorLevels).value });

    let aggregateDim = this.getWidget(model,this.state.positions.aggregateDim).value;
    if (aggregateDim === null) {
      aggregateDim = "None";
    }
    this.setState({ aggregateDim: aggregateDim });

    this.setState({ aggregateFun: this.getWidget(model,this.state.positions.aggregateFun).value });

    this.initSlider();

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
    this.getWidget(model,this.state.positions.colorMap).value = event.target.value

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
    this.getWidget(model,this.state.positions.showCoastline).active = this.setActiveEvent(doesShow);

    console.log("State showCoastline changed")
  };

  setFixColoring = (event) => {
    let doesShow = this.state.fixColoring;
    this.setState({ fixColoring: !doesShow })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    this.getWidget(model,this.state.positions.fixColoring).active = this.setActiveEvent(doesShow);

    console.log("State fixColoring changed")
  };

  setSymColoring = (event) => {
    let doesShow = this.state.symColoring;
    this.setState({ symColoring: !doesShow })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    this.getWidget(model,this.state.positions.symColoring).active = this.setActiveEvent(doesShow);

    console.log("State symColoring changed")
  };

  setLogzColoring = (event) => {
    let doesShow = this.state.logzColoring;
    this.setState({ logzColoring: !doesShow })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    this.getWidget(model,this.state.positions.logzColoring).active = this.setActiveEvent(doesShow);

    console.log("State logzColoring changed")
  };

  setMesh = (event) => {
    this.setState({ mesh: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    this.getWidget(model,this.state.positions.mesh).value = event.target.value;

    console.log("State mesh changed")
  };

  setAggregateFun = (event) => {
    this.setState({ aggregateFun: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    this.getWidget(model,this.state.positions.aggregateFun).value = event.target.value;

    console.log("State aggregateFun changed")
  };

  setAggregateDim = (event) => {
    this.setState({ aggregateDim: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    this.getWidget(model,this.state.positions.aggregateDim).value = event.target.value;

    console.log("State aggregateDim changed")
  };

  setColorLevels = (event) => {
    this.setState({ colorLevels: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    this.getWidget(model,this.state.positions.colorLevels).value = event.target.value;

    console.log("State colorLevels changed")
  };

  setVariable = (event) => {
    this.setState({ variable: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    this.getWidget(model,this.state.positions.variable).value = event.target.value;

    setTimeout(this.initSlider, 1500);
    console.log("State variable changed")
  };

  setDataPath = (event) => {
    this.setState({ file: event.target.value })

    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    this.getWidget(model,this.state.positions.file).value = event.target.value;

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

  handleSlider = (event, newValue) => {
    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    let slider = this.getWidget(model,this.state.positions.slider);

    if (newValue <= this.state.sliderEnd) {
      slider.value = newValue;
    }
  }

  initSlider = () => {
    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    let hasSlider = model.children[this.state.positions.slider].attributes.children[0].attributes.hasOwnProperty("children");
    console.log("Slider active: " + hasSlider);

    if (hasSlider) {
      let slider = this.getWidget(model,this.state.positions.slider);
      console.log("Init Slider: " + slider.end)

      this.setState({ sliderEnd: slider.end });
      this.setState({ sliderStart: slider.start });
      this.setState({ sliderDisabled: false });;
    } else {
      this.setState({ sliderDisabled: true });
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

          start={this.state.sliderStart}
          end={this.state.sliderEnd}
          isActiveSlider={this.state.sliderDisabled}
          slChLev={this.handleSlider}

          btClick={this.getBokehInfo}
        />
        <Plot id={5023}></Plot>
      </div>
    );
  }
}

export default App;

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
      fixColMin: "",
      fixColMax: "",
      logx: false,
      logy: false,
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
      disabled_Logxy: true,
      disabled_FixCol: true,
      diabled_Slider: true,
      disabled_default: false,
      sliderStart: 0,
      sliderEnd: 20
    };
  }

  componentDidMount() {
    this.appendScript().then(setTimeout(this.initState, 2000));
  }

  getWidget = (position) => {
    let model = window.Bokeh.documents[0].get_model_by_id("1000");
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
    let optsVar = this.mkOptions(this.getWidget(this.state.positions.variable).options);
    let optsAd = this.mkOptions(this.getWidget(this.state.positions.aggregateDim).options);
    this.setState({ variables: optsVar });
    this.setState({ aggDimSelect: optsAd });

    this.setState({ file: this.getWidget(this.state.positions.file).value });

    this.setState({ variable: this.getWidget(this.state.positions.variable).value });

    const hasCoastline = this.getActiveEvent(this.getWidget(this.state.positions.showCoastline).active);
    this.setState({ showCoastline: hasCoastline });

    this.setState({ colorMap: this.getWidget(this.state.positions.colorMap).value });

    const hasFixedColoring = this.getActiveEvent(this.getWidget(this.state.positions.fixColoring).active);
    this.setState({ fixColoring: hasFixedColoring });

    const hasSymColoring = this.getActiveEvent(this.getWidget(this.state.positions.symColoring).active);
    this.setState({ symColoring: hasSymColoring });

    const hasLogzColoring = this.getActiveEvent(this.getWidget(this.state.positions.logzColoring).active);
    this.setState({ logzColoring: hasLogzColoring });

    this.setState({ colorLevels: this.getWidget(this.state.positions.colorLevels).value });

    let aggregateDim = this.getWidget(this.state.positions.aggregateDim).value;
    if (aggregateDim === null) {
      aggregateDim = "None";
    }
    this.setState({ aggregateDim: aggregateDim });

    this.setState({ aggregateFun: this.getWidget(this.state.positions.aggregateFun).value });

    this.checkActive();
    this.initSlider();

    console.log("model loaded")
  }

  checkActive = () => {
    if (this.state.aggregateDim !== "lat" || this.state.aggregateFun === "None") {
      this.setState({ disabled_default: false });
    } else {
      this.setState({ disabled_default: true });
    }

    if (this.state.fixColoring) {
      console.log("Enable Fix Coloring")
      this.setState({ disabled_FixCol: false });
    } else {
      console.log("Disable Fix Coloring")
      this.setState({ disabled_FixCol: true });
    }

    if (this.state.aggregateDim === "lat" || this.state.aggregateFun !== "None") {
      this.setState({ disabled_Logxy: false });
    } else {
      this.setState({ disabled_Logxy: true });
    }
  }

  mkOptions = (option) => {
    let arr = []
    option.map(el => {
      arr.push({ label: el, value: el })
    });
    return arr;
  }

  handleColorMap = (event) => {
    this.setState({ colorMap: event.target.value })
    this.getWidget(this.state.positions.colorMap).value = event.target.value

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

  handleShowCoastline = () => {
    let doesShow = this.state.showCoastline;
    this.setState({ showCoastline: !doesShow });
    this.getWidget(this.state.positions.showCoastline).active = this.setActiveEvent(doesShow);

    console.log("State showCoastline changed")
  };

  handleFixColoring = () => {
    let doesShow = this.state.fixColoring;
    this.setState({ fixColoring: !doesShow });
    this.setState({ disabled_FixCol: doesShow });
    this.getWidget(this.state.positions.fixColoring).active = this.setActiveEvent(doesShow);

    console.log("State fixColoring changed")
  };

  handleSymColoring = () => {
    let doesShow = this.state.symColoring;
    this.setState({ symColoring: !doesShow });
    this.getWidget(this.state.positions.symColoring).active = this.setActiveEvent(doesShow);

    console.log("State symColoring changed")
  };

  handleLogzColoring = () => {
    let doesShow = this.state.logzColoring;
    this.setState({ logzColoring: !doesShow });
    this.getWidget(this.state.positions.logzColoring).active = this.setActiveEvent(doesShow);

    console.log("State logzColoring changed")
  };

  handleLogx = () => {
    let doesShow = this.state.logx;
    this.setState({ logx: !doesShow });
    this.getWidget(this.state.positions.logx).active = this.setActiveEvent(doesShow);

    console.log("State logx changed")
  };

  handleLogy = () => {
    let doesShow = this.state.logy;
    this.setState({ logy: !doesShow });
    this.getWidget(this.state.positions.logy).active = this.setActiveEvent(doesShow);

    console.log("State logy changed")
  };

  handleAggregateFun = (event) => {
    this.setState({ aggregateFun: event.target.value });
    console.log("Value: " + event.target.value)

    if (this.state.aggregateDim !== "lat" || event.target.value === "None") {
      console.log("Enable default widgets")
      this.setState({ disabled_default: false });
      this.setState({ disabled_Logxy: true });
    } else {
      console.log("Disable default widgets")
      this.setState({ disabled_default: true });
      this.setState({ disabled_Logxy: false });
    }

    this.getWidget(this.state.positions.aggregateFun).value = event.target.value;

    console.log("State aggregateFun changed")
  };

  handleAggregateDim = (event) => {
    this.setState({ aggregateDim: event.target.value });

    if (event.target.value !== "lat" || this.state.aggregateFun === "None") {
      console.log("Enable default widgets")
      this.setState({ disabled_default: false });
      this.setState({ disabled_Logxy: true });
    } else {
      console.log("Disable default widgets")
      this.setState({ disabled_default: true });
      this.setState({ disabled_default: false });
    }

    this.getWidget(this.state.positions.aggregateDim).value = event.target.value;

    console.log("State aggregateDim changed")
  };

  handleColorLevels = (event) => {
    this.setState({ colorLevels: event.target.value })
    this.getWidget(this.state.positions.colorLevels).value = event.target.value;

    console.log("State colorLevels changed")
  };

  handleVariable = (event) => {
    this.setState({ variable: event.target.value });
    this.getWidget(this.state.positions.variable).value = event.target.value;

    setTimeout(this.initSlider, 1500);
    console.log("State variable changed")
  };

  handleSubmit = (event) => {
    if (event.keyCode === 13) {
      this.getWidget(this.state.positions.file).value = this.state.file;
      window.location.reload(true); 
    }
  };

  handleDataPath = (event) => {
    this.setState({ file: event.target.value });
  }

  handleHeight = () => {
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

    let slider = this.getWidget(this.state.positions.slider);

    if (newValue <= this.state.sliderEnd) {
      slider.value = newValue;
    }
  }

  initSlider = () => {
    let model = window.Bokeh.documents[0].get_model_by_id("1000");
    let hasSlider = model.children[this.state.positions.slider].attributes.children[0].attributes.hasOwnProperty("children");
    console.log("Slider active: " + hasSlider);

    if (hasSlider) {
      let slider = this.getWidget(this.state.positions.slider);
      console.log("Init Slider: " + slider.end)

      this.setState({ sliderEnd: slider.end });
      this.setState({ sliderStart: slider.start });
      this.setState({ diabled_Slider: false });;
    } else {
      this.setState({ diabled_Slider: true });
    }
  }

  render() {
    const cmSelect = constants.cmSelect;
    const funcSelect = constants.funcSelect;

    return (
      <div className="App" style={{ margin: 20 }}>
        <Sidebar
          txLabFile="Filepath"
          txValFile={this.state.file}
          txChFile={this.handleDataPath}
          txSbFile={this.handleSubmit}

          selLabVar="Variable"
          selValVar={this.state.variable}
          selChVar={this.handleVariable}
          selMapVar={this.state.variables}

          cbLabCl="Show Coastline"
          cbStCl={this.state.showCoastline}
          cbChCl={this.handleShowCoastline}

          cbLabFc="Fix Coloring"
          cbStFc={this.state.fixColoring}
          cbChFc={this.handleFixColoring}

          cbLabSc="Symmetric Coloring"
          cbStSc={this.state.symColoring}
          cbChSc={this.handleSymColoring}

          cbLabLc="Log z Coloring"
          cbStLc={this.state.logzColoring}
          cbChLc={this.handleLogzColoring}

          selLabCm="Colormap"
          selValCm={this.state.colorMap}
          selChCm={this.handleColorMap}
          selMapCm={cmSelect}

          selLabAd="Aggregate Dimension"
          selValAd={this.state.aggregateDim}
          selChAd={this.handleAggregateDim}
          selMapAd={this.state.aggDimSelect}

          selLabAf="Aggregate Function"
          selValAf={this.state.aggregateFun}
          selChAf={this.handleAggregateFun}
          selMapAf={funcSelect}

          txLabCol="Color Levels"
          txChCol={this.handleColorLevels}
          txValCol={this.state.colorLevels}

          txLabFmi="Fix color minimum"
          txValFmi={this.state.fixColMin}
          txChFmi={this.handleFixColMi}

          txLabFma="Fix color maximum"
          txValFma={this.state.fixColMax}
          txChFma={this.handleFixColMa}

          cbLabLx="logX"
          cbChLx={this.handleLogx}
          cbStLx={this.state.logy}

          cbLabLy="logY"
          cbChLy={this.handleLogy}
          cbStLy={this.state.logx}

          txActFm={this.state.disabled_FixCol}
          cbActLxy={this.state.disabled_Logxy}
          disableDefault={this.state.disabled_default}

          start={this.state.sliderStart}
          end={this.state.sliderEnd}
          isActiveSlider={this.state.diabled_Slider}
          slChLev={this.handleSlider}

          btClick={this.getBokehInfo}
        />
        <Plot id={5023}></Plot>
      </div>
    );
  }
}

export default App;

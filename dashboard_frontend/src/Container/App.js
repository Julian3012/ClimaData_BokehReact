import React, { Component } from 'react';
import MultiPlot from "../Components/MultiPlot"
import * as constants from "../Components/constants"
import './App.css';
import $ from 'jquery';
import PlotRange from "./Counter";
import plotLoader from "../autoload";
import { connect } from "react-redux";

class App extends Component {

  constructor(props) {
    super(props);
    console.log('[App.js] constructor');

    // TODO: Unique key prop for render methods
    // TODO: Delete redux storage when window closes
    // TODO: ColorMap in Sidebar
    // TODO: Put handler in respective components
    // TODO: Do not disable Navbar Parameter
    // TODO: Synchronize zoom checkbox too much
    if (this.props.list.length === 0 || this.props.list[0] === null) {
      let sessionId = Math.random().toString(36).substring(2,10);
      this.state = {
        bk_session: [],
        positions: constants.POSITIONS,
        changeLayout: false,
        activeSidebar: false,
        observer: [],
        plotId: "plot-el",
        sessionId: sessionId,
      };
    } else {
      this.state = JSON.parse(JSON.stringify(this.props.list[0]));
    }
  }

  createPlot = () => {
    const numPlots = this.state.bk_session.length;
    const newPos = this.state.bk_session.length === 0 ? 0 : this.state.bk_session[numPlots - 1].pos + 1;
    return {
      pos: newPos,
      file: "",
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
      aggDimSelect: [{
        value: "None",
        label: "None",
      }],
      variables: [{
        value: "clon",
        label: "clon",
      }],
      disabled_Logxy: true,
      disabled_FixCol: true,
      diabled_Slider: true,
      disabled_default: false,
      sliderStart: 0,
      sliderEnd: 20,
      x_range_start: 0,
      x_range_end: 0,
      y_range_start: 0,
      y_range_end: 0,
    }
  }

  componentDidMount() {
    this.appendScript();

  }

  getWidget = (posWidget, posPlot) => {
    try {
      let model = window.Bokeh.documents[0].get_model_by_id("1000");
      if (posWidget <= 16) {
        return model.attributes.children[posPlot === 0 ? 3 : posPlot + 3].attributes.children[0].attributes.children[posWidget]
      } else if (posWidget === this.state.positions.slider) {
        return model.attributes.children[0].attributes.children[posPlot - 1].attributes.children[1].attributes.children[1]
      } else if (posWidget === 17) {
        console.log("delte")
        return model.attributes.children[6 + 3]
      } else {
        console.log("Position value does not exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  appendScript = () => {
    return new Promise((resolve) => {
      resolve(plotLoader(window, this.state.plotId, this.state.sessionId))
    })
  }

  setSession = (pos, plot) => {
    const bk_session = [...this.state.bk_session];
    bk_session[pos] = plot;
    this.setState({ bk_session: bk_session });
    this.props.add(this.state);
  }

  addPlot = () => {
    console.log(this.state.bk_session.length)
    if (this.state.bk_session.length < 6) {
      let promise = new Promise((resolve) => {
        resolve(this.createPlot());
      })

      promise.then((plot) => {
        let plots = [...this.state.bk_session, plot];
        this.setState({ bk_session: plots })
        this.props.add(this.state)
      })
      console.log("Plot added")
    }
  }

  deletePlot = () => {
    let plots = [];
    this.setState({ bk_session: plots });
    this.props.remove();
    try{
      this.getWidget(17,-1).active = [0];
    } catch (error){
      console.log(error)
    }
  }

  checkActive = (posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };

    if (this.state.bk_session[posPlot].aggregateDim !== "lat" || this.state.bk_session[posPlot].aggregateFun === "None") {
      plot.disabled_default = false;
    } else {
      plot.disabled_default = true;
    }

    if (this.state.bk_session[posPlot].fixColoring) {
      console.log("Enable Fix Coloring")
      plot.disabled_FixCol = false;
    } else {
      console.log("Disable Fix Coloring")
      plot.disabled_FixCol = true;
    }

    if (this.state.bk_session[posPlot].aggregateDim === "lat" || this.state.bk_session[posPlot].aggregateFun !== "None") {
      console.log("Enable Logx Logy")
      plot.disabled_Logxy = false;
    } else {
      console.log("Disable Logx Logy")
      plot.disabled_Logxy = true;
    }

    this.setSession(posPlot, plot)
  }

  mkOptions = (option) => {
    let arr = []
    option.map(el => {
      return arr.push({ label: el, value: el })
    });
    return arr;
  }

  handleColorMap = (event, posPlot) => {
    try {
      posPlot.map((sess) => {
        sess.colorMap = event.target.value;
        this.getWidget(this.state.positions.colorMap, sess.pos).value = event.target.value;

        this.setSession(sess.pos, sess);

        return "";
      })
    } catch (e) {
      console.log(e)
    }
  };

  setActiveEvent = (doesShow) => {
    if (doesShow === true) {
      return []
    } else {
      return [0]
    }
  }

  getActiveEvent = (val) => {
    if (val[0] === 0) {
      return true;
    } else {
      return false;
    }
  }

  handleShowCoastline = (event, posPlot) => {

    try {
      posPlot.map((sess) => {
        let doesShow = this.state.bk_session[sess.pos].showCoastline;
        sess.showCoastline = !doesShow;
        this.getWidget(this.state.positions.showCoastline, sess.pos).active = this.setActiveEvent(doesShow);

        return this.setSession(sess.pos, sess);
      })
    } catch (e) {
      console.log(e)
    }

  };

  handleFixColoring = (event, posPlot) => {

    try {
      posPlot.map((sess) => {
        let doesShow = this.state.bk_session[sess.pos].fixColoring;
        sess.fixColoring = !doesShow;
        sess.disabled_FixCol = doesShow;
        this.getWidget(this.state.positions.fixColoring, sess.pos).active = this.setActiveEvent(doesShow);

        return this.setSession(sess.pos, sess);
      })
    } catch (e) {
      console.log(e)
    }
  };

  handleSymColoring = (event, posPlot) => {

    try {
      posPlot.map((sess) => {
        let doesShow = this.state.bk_session[sess.pos].symColoring;
        sess.symColoring = !doesShow;
        this.getWidget(this.state.positions.symColoring, sess.pos).active = this.setActiveEvent(doesShow);

        return this.setSession(sess.pos, sess);
      })
    } catch (error) {
      console.log(error)
    }
  };

  handleLogzColoring = (event, posPlot) => {
    try {
      posPlot.map((sess) => {
        let doesShow = this.state.bk_session[sess.pos].logzColoring;
        sess.logzColoring = !doesShow;
        this.getWidget(this.state.positions.logzColoring, sess.pos).active = this.setActiveEvent(doesShow);

        return this.setSession(sess.pos, sess);
      })
    } catch (error) {
      console.log(error)
    }
  };

  handleLogx = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos])
    })

    plot.map((sess) => {
      let doesShow = this.state.bk_session[sess.pos].logx;
      sess.logx = !doesShow;
      this.getWidget(this.state.positions.logx, sess.pos).active = this.setActiveEvent(doesShow);

      return this.setSession(sess.pos, sess);
    })
  };

  handleLogy = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos])
    })

    plot.map((sess) => {
      let doesShow = this.state.bk_session[sess.pos].logy;
      sess.logy = !doesShow;
      this.getWidget(this.state.positions.logy, sess.pos).active = this.setActiveEvent(doesShow);

      return this.setSession(sess.pos, sess);
    })
  };

  handleAggregateFun = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos])
    })

    plot.map((sess) => {
      sess.aggregateFun = event.target.value;
      console.log("Value: " + event.target.value)

      if (this.state.bk_session[sess.pos].aggregateDim !== "lat" || event.target.value === "None") {
        console.log("Enable default widgets")
        sess.disabled_default = false;
        sess.disabled_Logxy = true;
      } else {
        console.log("Disable default widgets")
        sess.disabled_default = true;
        sess.disabled_Logxy = false;
      }

      this.setSession(sess.pos, sess);

      return this.getWidget(this.state.positions.aggregateFun, sess.pos).value = event.target.value;
    })

    console.log("State aggregateFun changed")
  };

  handleAggregateDim = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos])
    })

    plot.map((sess) => {
      sess.aggregateDim = event.target.value;

      if (event.target.value !== "lat" || this.state.bk_session[sess.pos].aggregateFun === "None") {
        console.log("Enable default widgets")
        sess.disabled_default = false;
        sess.disabled_Logxy = true;
      } else {
        console.log("Disable default widgets")
        sess.disabled_default = true;
        sess.disabled_default = false;
      }

      this.setSession(sess.pos, sess);

      return this.getWidget(this.state.positions.aggregateDim, sess.pos).value = event.target.value;
    })

    console.log("State aggregateDim changed")
  };

  handleColorLevels = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos]);
    })

    plot.map((sess) => {

      sess.colorLevels = event.target.value;
      this.getWidget(this.state.positions.colorLevels, sess.pos).value = event.target.value;

      return this.setSession(sess.pos, sess);
    });
    console.log("State colorLevels changed")
  };

  handleVariable = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos]);
    })

    plot.map((sess) => {

      sess.variable = event.target.value;
      this.getWidget(this.state.positions.variable, sess.pos).value = event.target.value;

      return this.setSession(sess.pos, sess);

    })
    console.log("State variable changed")
  };

  handleSubmit = (event, posPlot) => {
    try{
      if (event.keyCode === 13) {
        posPlot.map((pos) => {
          console.log("handleSubmit: " + pos)
          return this.getWidget(this.state.positions.file, pos).value = this.state.bk_session[pos].file;
        })
        console.log(this.state.bk_session)
        setTimeout(() => { this.setParams(posPlot[0]) }, 3000)
      }
    } catch(e){
      console.log(e)
    }
  };

  setParams = (posPlot) => {
    try {
      console.log("setParams " + posPlot)

      let optsVar = this.mkOptions(this.getWidget(this.state.positions.variable, posPlot).options);
      let optsAd = this.mkOptions(this.getWidget(this.state.positions.aggregateDim, posPlot).options);
      console.log(optsVar)
      const plot = {
        ...this.state.bk_session[posPlot]
      };

      plot.variables = optsVar;
      plot.aggDimSelect = optsAd;

      this.setSession(posPlot, plot);
      this.props.add(this.state);
      
    } catch (error) {
      console.log(error)
    }
  }

  handleDataPath = (event, posPlot) => {

    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos]);
    })

    plot.map((sess) => {
      sess.file = event.target.value;

      return this.setSession(sess.pos, sess);
    });
  }

  handleSlider = (event, newValue, posPlot) => {
    try {
      let plot = []
      posPlot.map((pos) => {
        return plot.push(this.state.bk_session[pos]);
      })

      plot.map((sess) => {
        let slider = this.getWidget(this.state.positions.slider, sess.pos);

        if (newValue <= this.state.bk_session[sess.pos].sliderEnd) {
          slider.value = newValue;
        }
        return "";
      })
    }
    catch (e) {
      console.log(e);
    }
  };

  handleExpandClick = () => {
    let exp = this.state.expanded;
    this.setState({ expanded: !exp });
  }

  initSlider = (posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos]);
    })

    plot.map((sess) => {

      let model = window.Bokeh.documents[sess.pos].get_model_by_id("1000");
      let hasSlider = false;

      if (model.children.length === 22) {
        hasSlider = model.children[this.state.positions.slider].attributes.children[0].attributes.hasOwnProperty("children");
      } else {
        hasSlider = false;
      }

      console.log("Slider active: " + hasSlider);

      if (hasSlider) {
        let slider = this.getWidget(this.state.positions.slider, sess.pos);
        sess.sliderEnd = slider.end;
        sess.sliderStart = slider.start;
        sess.diabled_Slider = false;

        console.log("Slider initialized");
      } else {
        sess.diabled_Slider = true;
      }

      return this.setSession(sess.pos, sess);
    })
  }

  handleSidebar = () => {
    let activeSidebar = this.state.activeSidebar;
    this.setState({ activeSidebar: !activeSidebar });
  }

  activeLayout = () => {
    const cmSelect = constants.cmSelect;
    const funcSelect = constants.funcSelect;
    return (
      <MultiPlot
        plotId={this.state.plotId}
        // Navbar
        cbStCl={this.state.bk_session.length === 0 ? true : this.state.bk_session[0].showCoastline}
        cbChCl={this.handleShowCoastline}

        cbStFc={this.state.bk_session.length === 0 ? false : this.state.bk_session[0].fixColoring}
        cbChFc={this.handleFixColoring}

        cbStSc={this.state.bk_session.length === 0 ? false : this.state.bk_session[0].symColoring}
        cbChSc={this.handleSymColoring}

        cbStLc={this.state.bk_session.length === 0 ? false : this.state.bk_session[0].logzColoring}
        cbChLc={this.handleLogzColoring}

        selValCm={this.state.bk_session.length === 0 ? "Blues" : this.state.bk_session[0].colorMap}
        selChCm={this.handleColorMap}
        selMapCm={cmSelect}

        disableDefaultNavbar={this.state.bk_session.length === 0 ? false : this.state.bk_session[0].disabled_default}

        // Plots
        txChFile={this.handleDataPath}
        txSbFile={this.handleSubmit}

        selChVar={this.handleVariable}

        selChAd={this.handleAggregateDim}
        selChAf={this.handleAggregateFun}
        selMapAf={funcSelect}

        txChCol={this.handleColorLevels}

        txChFmi={this.handleFixColMi}
        txChFma={this.handleFixColMa}

        cbChLx={this.handleLogx}
        cbChLy={this.handleLogy}

        slChLev={this.handleSlider}
        bk_session={this.state.bk_session}

        activeSidebar={this.state.activeSidebar}
        showSidebar={this.handleSidebar}

        addPlot={this.addPlot}
        deletePlot={this.deletePlot}

      />
    )
  }

  getPlotRange = (model) => {
    let range_dict = {
      "model_y_end": model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.end,
      "model_y_start": model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.start,
      "model_x_end": model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.end,
      "model_x_start": model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.start,
    }
    return range_dict;
  }

  adjustZoom = (posPlot) => {
    try {
      let model = window.Bokeh.documents[posPlot].get_model_by_id("1000");
      const ranges = this.getPlotRange(model);

      this.state.bk_session.map((sess) => {
        let model = window.Bokeh.documents[sess.pos].get_model_by_id("1000");

        model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.end = ranges["model_y_end"];
        model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.start = ranges["model_y_start"];
        model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.end = ranges["model_x_end"];
        model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.start = ranges["model_x_start"];
      })

      console.log("Zoom")
    }
    catch (e) {
      console.log(e);
    }
  }

  render() {
    console.log('[App.js] render method');
    // TODO: Add scroll in sidebar
    return (
      <div className="App" >
        {this.activeLayout()}
      </div >
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    list: state.list,
  }
}

const mapDispachToProps = (dispatch) => {
  return {
    add: (value) => {
      dispatch({ type: "ADD", payload: value })
    },
    remove: (value) => {
      dispatch({ type: "REMOVE", payload: value })
    }
  }
}

// export default App;
export default connect(mapStateToProps, mapDispachToProps)(App);

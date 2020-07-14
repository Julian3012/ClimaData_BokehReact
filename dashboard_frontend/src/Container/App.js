import React, { Component } from 'react';
import Panel from "../Components/Panel"
import MultiPlot from "../Components/MultiPlot"
import * as constants from "../Components/constants"
import Button from '@material-ui/core/Button';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    console.log('[App.js] constructor');

    let session1 = this.createSession("0000", "1000", 0);
    let session2 = this.createSession("0001", "1001", 1);
    let session3 = this.createSession("0002", "1002", 2);
    let session4 = this.createSession("0003", "1003", 3);

    this.state = {
      bk_session: [session1, session2, session3, session4],
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
        slider: 21
      },
      didMount: 0,
      changeLayout: false,
      activeSidebar: false,
    };
  }

  createSession = (sessId, plotId, pos) => {
    return {
      id: plotId,
      session: sessId,
      pos: pos,
      file: "",
      mesh: "DOM1",
      variable: "None",
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
        value: "None",
        label: "None",
      }],
      disabled_Logxy: true,
      disabled_FixCol: true,
      diabled_Slider: true,
      disabled_default: false,
      sliderStart: 0,
      sliderEnd: 20,
      default_ranges: [-89.99999999999957, 89.99999999999955, -179.99999999999997, 179.99999999999997],
      x_range_start: 0,
      x_range_end: 0,
      y_range_start: 0,
      y_range_end: 0,
    }
  }

  componentDidMount() {
    this.appendScript().then(setTimeout(this.initState, 2000));
  }

  getWidget = (posWidg, posPlot) => {
    let model = window.Bokeh.documents[posPlot].get_model_by_id("1000");
    if (posWidg <= 16) {
      return model.attributes.children[posWidg].attributes.children[0].attributes.children[0]
    } else if (posWidg === this.state.positions.slider) {
      return model.attributes.children[posWidg].attributes.children[0].attributes.children[1].attributes.children[1]
    } else {
      console.log("Position value does not exist")
    }
  }

  appendScript = () => {
    return new Promise((resolve) => {

      this.state.bk_session.map((sess) => {
        const script = document.createElement("script");
        script.src = this.getScriptSrc(sess.id, sess.session);
        script.async = true;

        return document.body.appendChild(script);
      })

      resolve(true)
    })
  }

  getScriptSrc = (id, session) => {
    const part1 = "http://localhost:5010/main_backend/autoload.js?bokeh-autoload-element=";
    let strId = id;
    const part2 = "&bokeh-app-path=/main_backend&bokeh-absolute-url=http://localhost:5010/main_backend&bokeh-session-id=";
    let strSession = session;

    return part1 + strId + part2 + strSession;
  }

  setSession = (pos, plot) => {
    const bk_session = [...this.state.bk_session];
    bk_session[pos] = plot;
    this.setState({ bk_session: bk_session });
  }

  initState = () => {
    console.log("Start initializing state")
    try {
      this.state.bk_session.map((sess) => {
        let optsVar = this.mkOptions(this.getWidget(this.state.positions.variable, sess.pos).options);
        let optsAd = this.mkOptions(this.getWidget(this.state.positions.aggregateDim, sess.pos).options);

        const plot = {
          ...this.state.bk_session[sess.pos]
        };

        plot.variables = optsVar;
        plot.aggDimSelect = optsAd;

        plot.file = this.getWidget(this.state.positions.file, sess.pos).value;
        this.setSession(sess.pos, plot);

        plot.variable = (this.getWidget(this.state.positions.variable, sess.pos).value != null) ? this.getWidget(this.state.positions.variable, sess.pos).value : "";

        const hasCoastline = this.getActiveEvent(this.getWidget(this.state.positions.showCoastline, sess.pos).active);
        plot.showCoastline = hasCoastline;

        plot.colorMap = this.getWidget(this.state.positions.colorMap, sess.pos).value;

        const hasFixedColoring = this.getActiveEvent(this.getWidget(this.state.positions.fixColoring, sess.pos).active);
        plot.fixColoring = hasFixedColoring;

        const hasSymColoring = this.getActiveEvent(this.getWidget(this.state.positions.symColoring, sess.pos).active);
        plot.symColoring = hasSymColoring;

        const hasLogzColoring = this.getActiveEvent(this.getWidget(this.state.positions.logzColoring, sess.pos).active);
        plot.logzColoring = hasLogzColoring;

        plot.colorLevels = this.getWidget(this.state.positions.colorLevels, sess.pos).value;

        let aggregateDim = this.getWidget(this.state.positions.aggregateDim, sess.pos).value;
        if (aggregateDim === null) {
          aggregateDim = "None";
        }
        plot.aggregateDim = aggregateDim;

        plot.aggregateFun = this.getWidget(this.state.positions.aggregateFun, sess.pos).value;

        this.setSession(sess.pos, plot)

        console.log(plot)

        this.checkActive(sess.pos);
        this.initSlider([sess.pos]);

        return console.log("model loaded")
      })
    } catch (e) {
      console.log(e);
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
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos])
    })

    plot.map((sess) => {
      sess.colorMap = event.target.value;
      this.getWidget(this.state.positions.colorMap, sess.pos).value = event.target.value;

      return this.setSession(sess.pos, sess);
    })

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
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos])
    })

    plot.map((sess) => {
      let doesShow = this.state.bk_session[sess.pos].showCoastline;
      sess.showCoastline = !doesShow;
      this.getWidget(this.state.positions.showCoastline, sess.pos).active = this.setActiveEvent(doesShow);

      return this.setSession(sess.pos, sess);
    })
  };

  handleFixColoring = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos])
    })

    plot.map((sess) => {
      let doesShow = this.state.bk_session[sess.pos].fixColoring;
      sess.fixColoring = !doesShow;
      sess.disabled_FixCol = doesShow;
      this.getWidget(this.state.positions.fixColoring, sess.pos).active = this.setActiveEvent(doesShow);

      return this.setSession(sess.pos, sess);
    })
  };

  handleSymColoring = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos])
    })

    plot.map((sess) => {
      let doesShow = this.state.bk_session[sess.pos].symColoring;
      sess.symColoring = !doesShow;
      this.getWidget(this.state.positions.symColoring, sess.pos).active = this.setActiveEvent(doesShow);

      return this.setSession(sess.pos, sess);
    })

  };

  handleLogzColoring = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos])
    })

    plot.map((sess) => {
      let doesShow = this.state.bk_session[sess.pos].logzColoring;
      sess.logzColoring = !doesShow;
      this.getWidget(this.state.positions.logzColoring, sess.pos).active = this.setActiveEvent(doesShow);

      return this.setSession(sess.pos, sess);
    })
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

      this.setSession(sess.pos, sess);

      return setTimeout(() => { this.initSlider([sess.pos]) }, 1500);
    })
    console.log("State variable changed")
  };

  handleSubmit = (event, posPlot) => {

    if (event.keyCode === 13) {
      posPlot.map((pos) => {
        return this.getWidget(this.state.positions.file, pos).value = this.state.bk_session[pos].file;
      })
      console.log(this.state.bk_session)
      setTimeout(this.initState, 5000);
      // window.location.reload(true);
      // setTimeout(() => {window.location.reload(true)}, 30000);
    }
  };

  handleDataPath = (event, posPlot) => {

    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos]);
    })

    plot.map((sess) => {
      sess.file = event.target.value;

      return this.setSession(sess.pos, sess);
    });
    console.log("Plot position: " + posPlot)
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

        console.log("Init Slider End: " + slider.end);
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
    if (this.state.changeLayout) {
      return (
        <Panel
          txChFile={this.handleDataPath}
          txSbFile={this.handleSubmit}
          selChVar={this.handleVariable}
          cbChCl={this.handleShowCoastline}
          cbChFc={this.handleFixColoring}
          cbChSc={this.handleSymColoring}
          cbChLc={this.handleLogzColoring}
          selChCm={this.handleColorMap}
          selMapCm={cmSelect}
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
          onClick={this.handleZoom}
        />
      )
    } else {
      return (
        <MultiPlot
          // Navbar
          cbStCl={this.state.bk_session[0].showCoastline}
          cbChCl={this.handleShowCoastline}

          cbStFc={this.state.bk_session[0].fixColoring}
          cbChFc={this.handleFixColoring}

          cbStSc={this.state.bk_session[0].symColoring}
          cbChSc={this.handleSymColoring}

          cbStLc={this.state.bk_session[0].logzColoring}
          cbChLc={this.handleLogzColoring}

          selValCm={this.state.bk_session[0].colorMap}
          selChCm={this.handleColorMap}
          selMapCm={cmSelect}

          disableDefaultNavbar={this.state.bk_session[0].disabled_default}

          onClick={this.handleZoom}

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
        />
      )
    }
  }

  changeLayout = () => {
    this.setState({ changeLayout: !this.state.changeLayout })
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

  handleZoom = (posPlot) => {
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
    return (
      <div className="App" >
        {this.activeLayout()}
      </div >
    )
  }
}

export default App;

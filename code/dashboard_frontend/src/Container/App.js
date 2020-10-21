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
    if (this.props.list.length === 0 || this.props.list[0] === null) {
      let sessionId = Math.random().toString(36).substring(2, 10);
      console.log("Session ID: " + sessionId)
      this.state = {
        bk_session: [],
        positions: constants.POSITIONS,
        changeLayout: false,
        activeSidebar: false,
        observer: [],
        isSynched: false,
        plotId: "plot-el",
        sessionId: sessionId,
        disableOnLoad: false,
      };
    } else {
      let rdx_store = JSON.parse(JSON.stringify(this.props.list[0]));
      rdx_store.disableOnLoad = false;
      this.state = rdx_store;
    }
  }

  createPlot = () => {
    const numPlots = this.state.bk_session.length;
    const newPos = numPlots === 0 ? 0 : this.state.bk_session[numPlots - 1].pos + 1;
    return {
      pos: newPos,
      file: "",
      mesh: "DOM1",
      variable: "",
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
        value: "",
        label: "",
      }],
      disabled_Logxy: true,
      disabled_FixCol: true,
      diabled_Slider: true,
      disabled_default: false,
      x_range_start: 0,
      x_range_end: 0,
      y_range_start: 0,
      y_range_end: 0,
    }
  }

  componentDidMount() {
    this.appendScript();

  }

  /**
   * Method to access bokeh parameter from react frontend.
   * @param {int} posWidget -  Position of widget in layout:
   * Positions:
   * 1. For posWidget <= 16: constants.POSITIONS
   * 2. posWidget === this.state.positions.plot: Get plot object
   * 3. posWidget === 17: delete plot checkbox
   * 4. posWidget === 18: apply checkbox
   * @param {int} posPlot -  Position of plot. Number between 1-6
   * @returns bokehwidget 
   * @example 
   * this.getWidget(this.state.positions.aggregateFun, sess.pos).value
   * "-> returns active value of aggregate function selection"
   */
  getWidget = (posWidget, posPlot) => {
    console.log("posPlot: " + posPlot)
    try {
      let model = window.Bokeh.documents[0].get_model_by_id("1000");
      if (posWidget <= 16) {
        return model.attributes.children[posPlot === 0 ? 3 : posPlot + 3].attributes.children[0].attributes.children[posWidget]
      } else if (posWidget === this.state.positions.plot) {
        let divPlot = Math.floor(posPlot / 2);
        let numPlot = posPlot % 2;
        if (model.attributes.children[divPlot].attributes.children[numPlot].attributes.hasOwnProperty("children")) {
          return model.attributes.children[divPlot].attributes.children[numPlot].attributes.children[0]
        } else {
          return model.attributes.children[divPlot].attributes.children[numPlot]
        }
      } else if (posWidget === 17) {
        return model.attributes.children[6 + 3]
      } else if (posWidget === 18) {
        return model.attributes.children[6 + 4]
      } else {
        console.log("Position value does not exist")
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Load bokeh session with bokeh document to react app.
   */
  appendScript = () => {
    return new Promise((resolve) => {
      resolve(plotLoader(window, this.state.plotId, this.state.sessionId))
    })
  }

  /**
   * Update state of plot for all parameters.
   * @param {Number} pos -  Position of plot. Number between 1-6
   * @param {*} plot - Object containing the state of the plot.
   */
  setSession = (pos, plot) => {
    const bk_session = [...this.state.bk_session];
    bk_session[pos] = plot;
    this.setState({ bk_session: bk_session });
    this.setState({ isSynched: false });
    this.props.add(this.state);
  }

  /**
   * Add plot in frontend. This is a handler function for the add-button.
   */
  addPlot = () => {
    console.log(this.state.bk_session.length)
    if (this.state.bk_session.length < 6) {
      let promise = new Promise((resolve) => {
        resolve(this.createPlot());
      })

      promise.then((plot) => {
        let plots = [...this.state.bk_session, plot];
        this.setState({ bk_session: plots });
        this.setState({ isSynched: false });
        this.props.add(this.state)
      })
      console.log("Plot added")
    }
  }

  /**
   * Handler function for the delete button. It also resets the bokeh backend.
   */
  deletePlot = () => {
    let plots = [];
    this.setState({ bk_session: plots });
    this.props.remove();
    try {
      this.getWidget(17, -1).active = [0];
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Handler function for color based parameters.
   */
  handleApply = (posPlot) => {
    try {
      let plot = this.state.bk_session[posPlot]
      if (plot.file !== this.getWidget(this.state.positions.file, posPlot).value) {
        this.setState({ disableOnLoad: true })
        this.getWidget(this.state.positions.file, posPlot).value = plot.file
      } else {
        this.getWidget(18, -1).active = [0];
      }
    } catch (error) {
      console.log(error)
    }
    setTimeout(() => { this.setState({ disableOnLoad: false }) }, 3000)
  }

  /**
   * Handler function for zoom synchronization checkbox.
   */
  handleSyncZoom = () => {
    let isActive = this.state.isSynched;
    this.setState({ isSynched: !isActive });

    if (!isActive === false) {
      this.handleApply();
    }

    console.log("Sync zoom: " + !isActive)
  }

  /**
   * Creates an Observer class for the toolbox on a bokeh plot. If the toolbox of a plot refreshes, the ranges of all plots get synchronized.
   * @param {*} sess - State of bokeh plot
   */
  plotObserver = (sess) => {

    if (!this.state.isSynched) {

      const adjustZoom = () => { this.adjustZoom(sess.pos) };
      let ranges = new PlotRange(0, sess.pos);

      var plotObserver = new MutationObserver(function (mutations) {
        try {
          const model = window.Bokeh.documents[0].get_model_by_id("1000");
          if (ranges.compare(model)) {
            if (ranges.counter % 25 === 0 || ranges.isDefault(model)) {
              adjustZoom();
              ranges.adjust();
            }
            ranges.add();
          }
        } catch (e) {
          console.log(e)
        }
      });

      try {
        const plotId = ".plot_" + sess.pos;
        var myElement = $(plotId).find('.bk-toolbar.bk-toolbar-right');
        plotObserver.observe(myElement[0], {
          childList: true,
          subtree: true
        });

        console.log("Observer added to plot: " + sess.pos)
      } catch (error) {
        console.log("Observer failed on position: " + sess.pos)
      }
    } else {
      console.log("Observer disconnected")
    }
  }

  /**
   * Takes array of options for a selection parameter and returns an array of objects that can be used to initialize a selection parameter.
   * @param {Array} option - List of options
   */
  mkOptions = (option) => {
    let arr = []
    option.map(el => {
      return arr.push({ label: el, value: el })
    });
    return arr;
  }

  /**
   * Transforms true/false values into an active/not active value for checkbox parameters.
   * @param {boolean} doesShow 
   */
  setActiveEvent = (doesShow) => {
    if (doesShow === true) {
      return []
    } else {
      return [0]
    }
  }

  /**
   * Handler for the show coastline checkbox.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for the fix coloring checkbox.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for the symmetric coloring checkbox.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for the logz coloring checkbox.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for the logx checkbox.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for the logy checkbox.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for the aggregate function selection.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for the aggregate dimension selection.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for the color levels textbox.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for minimum fix coloring textbox.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
  handleFixColMi = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos]);
    })
    plot.map((sess) => {
      sess.fixColMin = event.target.value;
      this.getWidget(this.state.positions.fixColMin, sess.pos).value = event.target.value;
      return this.setSession(sess.pos, sess);
    });
  };

  /**
   * Handler for maximum fix coloring textbox.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
  handleFixColMa = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos]);
    })
    plot.map((sess) => {
      sess.fixColMax = event.target.value;
      this.getWidget(this.state.positions.fixColMax, sess.pos).value = event.target.value;
      return this.setSession(sess.pos, sess);
    });
  };

  /**
   * Handler for colormap selection.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
  handleColorMap = (event, posPlot) => {
    let plot = []
    posPlot.map((pos) => {
      return plot.push(this.state.bk_session[pos]);
    })
    plot.map((sess) => {
      sess.colorMap = event.target.value;
      this.getWidget(this.state.positions.colorMap, sess.pos).value = event.target.value;
      return this.setSession(sess.pos, sess);
    })
    console.log("State variable changed")
  };

  /**
   * Handler for variable selection.
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
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

  /**
   * Handler for filepath textbox. Submission on hitting enter key (event.keyCode === 13). 
   * @param {*} event 
   * @param {*} posPlot - Number for the position of the plot. 
   */
  handleSubmit = (event, posPlot) => {
    try {
      if (event.keyCode === 13) {
        posPlot.map((pos) => {
          console.log("handleSubmit: " + pos)
          return this.getWidget(this.state.positions.file, pos).value = this.state.bk_session[pos].file;
        })
        console.log(this.state.bk_session)
        this.setState({ disableOnLoad: true })
        setTimeout(() => { this.setParams(posPlot[0]) }, 3000)
      }
    } catch (e) {
      console.log(e)
    }
  };
  /**
   * Set variable and aggregate dimension selection.
   * @param {*} posPlot - Number for the position of the plot. 
   */
  setParams = (posPlot) => {
    try {
      console.log("setParams " + posPlot)
      let optsAd = this.mkOptions(this.getWidget(this.state.positions.aggregateDim, posPlot).options);
      let optsVar = this.mkOptions(this.getWidget(this.state.positions.variable, posPlot).options);

      const plot = {
        ...this.state.bk_session[posPlot]
      };
      plot.variables = optsVar;
      plot.variable = this.state.bk_session[posPlot].variable === "" ? this.state.bk_session[posPlot].variables[0].label : this.state.bk_session[posPlot].variable;
      plot.aggDimSelect = optsAd;
      this.setSession(posPlot, plot);
      this.props.add(this.state);
    } catch (error) {
      console.log(error)
    }
    this.setState({ disableOnLoad: false });
  }

  /**
   * Handler for datapath textbox.
   * @param {*} event 
   * @param {*} posPlot - Position of plot
   */
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

  /**
   * Handler for slider.
   * @param {*} event 
   * @param {*} newValue 
   * @param {*} posPlot 
   */
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
  }

  /**
   * Handler for opening the variable selection
   * @param {*} event 
   * @param {*} posPlot 
   */
  handleVarClick = (event, posPlot) => {
    try {
      this.setParams(posPlot)
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * Handler for sidebar.
   */
  handleSidebar = () => {
    let activeSidebar = this.state.activeSidebar;
    this.setState({ activeSidebar: !activeSidebar });
  }

  /**
   * All active Components
   */
  activeLayout = () => {
    const funcSelect = constants.funcSelect;
    return (
      <MultiPlot
        // Bokeh
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

        disableDefaultNavbar={this.state.bk_session.length === 0 ? false : this.state.bk_session[0].disabled_default}
        disableOnLoad={this.state.disableOnLoad}

        // Plots
        txChFile={this.handleDataPath}
        txSbFile={this.handleSubmit}

        selChVar={this.handleVariable}
        handleVarClick={this.handleVarClick}

        selChCm={this.handleColorMap}

        selChAd={this.handleAggregateDim}
        selChAf={this.handleAggregateFun}
        selMapAf={funcSelect}

        txChCol={this.handleColorLevels}

        txChFmi={this.handleFixColMi}
        txChFma={this.handleFixColMa}

        cbChLx={this.handleLogx}
        cbChLy={this.handleLogy}

        bk_session={this.state.bk_session}
        handleApply={this.handleApply}

        activeSidebar={this.state.activeSidebar}
        showSidebar={this.handleSidebar}

        addPlot={this.addPlot}
        deletePlot={this.deletePlot}

        cbStSyZoom={this.state.isSynched}
        cbChSyZoom={() => {
          this.handleSyncZoom();
          this.state.bk_session.map((sess) => {
            this.plotObserver(sess); return ""
          })
        }
        }
      />
    )
  }

  /**
   * Return object with x/y-ranges of plot object.
   * @param {*} posPlot 
   */
  getPlotRange = (posPlot) => {
    return {
      "model_y_end": this.getWidget(this.state.positions.plot, posPlot).y_range.end,
      "model_y_start": this.getWidget(this.state.positions.plot, posPlot).y_range.start,
      "model_x_end": this.getWidget(this.state.positions.plot, posPlot).x_range.end,
      "model_x_start": this.getWidget(this.state.positions.plot, posPlot).x_range.start,
    }
  }

  /**
   * Adjust zoom of all plots.
   * @param {*} posPlot 
   */
  adjustZoom = (posPlot) => {
    try {
      const ranges = this.getPlotRange(posPlot);
      this.state.bk_session.map((sess) => {
        if (sess.pos !== posPlot) {
          this.getWidget(this.state.positions.plot, sess.pos).y_range.end = ranges["model_y_end"];
          this.getWidget(this.state.positions.plot, sess.pos).y_range.start = ranges["model_y_start"];
          this.getWidget(this.state.positions.plot, sess.pos).x_range.end = ranges["model_x_end"];
          this.getWidget(this.state.positions.plot, sess.pos).x_range.start = ranges["model_x_start"];
        }
        return ""
      })
      console.log("Zoom")
    }
    catch (e) {
      console.log("Zoom failed on position: " + posPlot);
    }
  }

  render() {
    console.log('[App.js] render method');
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

export default connect(mapStateToProps, mapDispachToProps)(App);
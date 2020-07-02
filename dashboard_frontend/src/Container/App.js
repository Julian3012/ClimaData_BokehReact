import React, { Component } from 'react';
import Panel from "../Components/Panel"
import * as constants from "../Components/constants"
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    console.log('[App.js] constructor');

    this.state = {
      bk_session: [
        {
          id: "1001",
          session: "AAABBB",
          pos: 0,
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
            value: "TR_stn",
            label: "TR_stn",
          }],
          disabled_Logxy: true,
          disabled_FixCol: true,
          diabled_Slider: true,
          disabled_default: false,
          sliderStart: 0,
          sliderEnd: 20,
        },
        {
          id: "1002",
          session: "AAACCC",
          pos: 1,
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
            value: "TR_stn",
            label: "TR_stn",
          }],
          disabled_Logxy: true,
          disabled_FixCol: true,
          diabled_Slider: true,
          disabled_default: false,
          sliderStart: 0,
          sliderEnd: 20,
        },
      ],
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
      didMount: 0,
    };
  }

  componentDidMount() {
    this.appendScript().then(setTimeout(this.initState, 4000));
  }

  getWidget = (posWidg, posPlot) => {
    let model = window.Bokeh.documents[posPlot].get_model_by_id("1000");
    if (posWidg <= 16) {
      return model.attributes.children[posWidg].attributes.children[0].attributes.children[0]
    } else if (posWidg === 17) {
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
        document.body.appendChild(script);
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
        this.initSlider(sess.pos);

        console.log("model loaded")
      })
    } catch (e) {
      this.componentDidMount();
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
      plot.disabled_Logxy = false;
    } else {
      plot.disabled_Logxy = true;
    }

    this.setSession(posPlot, plot)
  }

  mkOptions = (option) => {
    let arr = []
    option.map(el => {
      arr.push({ label: el, value: el })
    });
    return arr;
  }

  handleColorMap = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };

    plot.colorMap = event.target.value;
    this.getWidget(this.state.positions.colorMap, posPlot).value = event.target.value;

    this.setSession(posPlot, plot);
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
    if (val[0] === 0) {
      return true;
    } else {
      return false;
    }
  }

  handleShowCoastline = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };

    let doesShow = this.state.bk_session[posPlot].showCoastline;
    plot.showCoastline = !doesShow;
    this.getWidget(this.state.positions.showCoastline, posPlot).active = this.setActiveEvent(doesShow);

    this.setSession(posPlot, plot);
    console.log("State showCoastline changed")
  };

  handleFixColoring = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };

    let doesShow = this.state.bk_session[posPlot].fixColoring;
    plot.fixColoring = !doesShow;
    plot.disabled_FixCol = doesShow;
    this.getWidget(this.state.positions.fixColoring, posPlot).active = this.setActiveEvent(doesShow);

    this.setSession(posPlot, plot);

    console.log("Fix Coloring Position: " + posPlot)
    console.log("State fixColoring changed")
  };

  handleSymColoring = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };
    let doesShow = this.state.bk_session[posPlot].symColoring;
    plot.symColoring = !doesShow;
    this.getWidget(this.state.positions.symColoring, posPlot).active = this.setActiveEvent(doesShow);

    this.setSession(posPlot, plot);
    console.log("State symColoring changed")
  };

  handleLogzColoring = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };

    let doesShow = this.state.bk_session[posPlot].logzColoring;
    plot.logzColoring = !doesShow;
    this.getWidget(this.state.positions.logzColoring, posPlot).active = this.setActiveEvent(doesShow);

    this.setSession(posPlot, plot);
    console.log("State logzColoring changed")
  };

  handleLogx = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };

    let doesShow = this.state.bk_session[posPlot].logx;
    plot.logx = !doesShow;
    this.getWidget(this.state.positions.logx, posPlot).active = this.setActiveEvent(doesShow);

    this.setSession(posPlot, plot);
    console.log("State logx changed")
  };

  handleLogy = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };

    let doesShow = this.state.bk_session[posPlot].logy;
    plot.logy = !doesShow;
    this.getWidget(this.state.positions.logy, posPlot).active = this.setActiveEvent(doesShow);

    this.setSession(posPlot, plot);
    console.log("State logy changed")
  };

  handleAggregateFun = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };
    plot.aggregateFun = event.target.value;
    console.log("Value: " + event.target.value)

    if (this.state.bk_session[posPlot].aggregateDim !== "lat" || event.target.value === "None") {
      console.log("Enable default widgets")
      plot.disabled_default = false;
      plot.disabled_Logxy = true;
    } else {
      console.log("Disable default widgets")
      plot.disabled_default = true;
      plot.disabled_Logxy = false;
    }

    this.setSession(posPlot, plot);

    this.getWidget(this.state.positions.aggregateFun, posPlot).value = event.target.value;

    console.log("State aggregateFun changed")
  };

  handleAggregateDim = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };
    plot.aggregateDim = event.target.value;

    if (event.target.value !== "lat" || this.state.aggregateFun === "None") {
      console.log("Enable default widgets")
      plot.disabled_default = false;
      plot.disabled_Logxy = true;
    } else {
      console.log("Disable default widgets")
      plot.disabled_default = true;
      plot.disabled_default = false;
    }

    this.setSession(posPlot, plot);

    this.getWidget(this.state.positions.aggregateDim, posPlot).value = event.target.value;

    console.log("State aggregateDim changed")
  };

  handleColorLevels = (event, posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };

    plot.colorLevels = event.target.value;
    this.getWidget(this.state.positions.colorLevels, posPlot).value = event.target.value;

    this.setSession(posPlot, plot);
    console.log("State colorLevels changed")
  };

  handleVariable = (event, posPlot) => {

    const plot = {
      ...this.state.bk_session[posPlot]
    };

    plot.variable = event.target.value;
    this.getWidget(this.state.positions.variable, posPlot).value = event.target.value;

    this.setSession(posPlot, plot);

    setTimeout(() => { this.initSlider(posPlot) }, 1500);

    console.log("State variable changed")
  };

  handleSubmit = (event, posPlot) => {

    if (event.keyCode === 13) {
      this.getWidget(this.state.positions.file, posPlot).value = this.state.bk_session[posPlot].file;
      console.log(this.state.bk_session)
      setTimeout(this.initState, 5000);
      // window.location.reload(true);
      // setTimeout(() => {window.location.reload(true)}, 30000);
    }
  };

  handleDataPath = (event, posPlot) => {

    const plot = {
      ...this.state.bk_session[posPlot]
    };
    plot.file = event.target.value;

    this.setSession(posPlot, plot);
    console.log("Plot position: " + posPlot)
  }

  handleSlider = (event, newValue, posPlot) => {

    let slider = this.getWidget(this.state.positions.slider, posPlot);

    if (newValue <= this.state.bk_session[posPlot].sliderEnd) {
      slider.value = newValue;
    }
  }

  initSlider = (posPlot) => {
    const plot = {
      ...this.state.bk_session[posPlot]
    };

    let model = window.Bokeh.documents[posPlot].get_model_by_id("1000");
    let hasSlider = false;

    if (model.children.length === 18) {
      hasSlider = model.children[this.state.positions.slider].attributes.children[0].attributes.hasOwnProperty("children");
    } else {
      hasSlider = false;
    }

    console.log("Slider active: " + hasSlider);

    if (hasSlider) {
      let slider = this.getWidget(this.state.positions.slider, posPlot);
      plot.sliderEnd = slider.end;
      plot.sliderStart = slider.start;
      plot.diabled_Slider = false;

      console.log("Init Slider End: " + slider.end);
    } else {
      plot.diabled_Slider = true;
    }

    this.setSession(posPlot, plot)

  }

  render() {
    const cmSelect = constants.cmSelect;
    const funcSelect = constants.funcSelect;

    return this.state.bk_session.map((sess) => {
      return (
        <div className="App">
          <Panel
            txLabFile="Filepath"
            txValFile={sess.file}
            txChFile={(event) => { this.handleDataPath(event, sess.pos) }}
            txSbFile={(event) => { this.handleSubmit(event, sess.pos) }}

            selLabVar="Variable"
            selValVar={sess.variable}
            selChVar={(event) => { this.handleVariable(event, sess.pos) }}
            selMapVar={sess.variables}

            cbLabCl="Show Coastline"
            cbStCl={sess.showCoastline}
            cbChCl={(event) => { this.handleShowCoastline(event, sess.pos) }}

            cbLabFc="Fix Coloring"
            cbStFc={sess.fixColoring}
            cbChFc={(event) => { this.handleFixColoring(event, sess.pos) }}

            cbLabSc="Symmetric Coloring"
            cbStSc={sess.symColoring}
            cbChSc={(event) => { this.handleSymColoring(event, sess.pos) }}

            cbLabLc="Log z Coloring"
            cbStLc={sess.logzColoring}
            cbChLc={(event) => { this.handleLogzColoring(event, sess.pos) }}

            selLabCm="Colormap"
            selValCm={sess.colorMap}
            selChCm={(event) => { this.handleColorMap(event, sess.pos) }}
            selMapCm={cmSelect}

            selLabAd="Dimension"
            selValAd={sess.aggregateDim}
            selChAd={(event) => { this.handleAggregateDim(event, sess.pos) }}
            selMapAd={sess.aggDimSelect}

            selLabAf="Function"
            selValAf={sess.aggregateFun}
            selChAf={(event) => { this.handleAggregateFun(event, sess.pos) }}
            selMapAf={funcSelect}

            txLabCol="Color Levels"
            txChCol={(event) => { this.handleColorLevels(event, sess.pos) }}
            txValCol={sess.colorLevels}

            txLabFmi="Fix color minimum"
            txValFmi={sess.fixColMin}
            txChFmi={(event) => { this.handleFixColMi(event, sess.pos) }}

            txLabFma="Fix color maximum"
            txValFma={sess.fixColMax}
            txChFma={(event) => { this.handleFixColMa(event, sess.pos) }}

            cbLabLx="logX"
            cbChLx={(event) => { this.handleLogx(event, sess.pos) }}
            cbStLx={sess.logx}

            cbLabLy="logY"
            cbChLy={(event) => { this.handleLogy(event, sess.pos) }}
            cbStLy={sess.logy}

            txActFm={sess.disabled_FixCol}
            cbActLxy={sess.disabled_Logxy}
            disableDefault={sess.disabled_default}

            start={sess.sliderStart}
            end={sess.sliderEnd}
            isActiveSlider={sess.diabled_Slider}
            slChLev={(event, newValue) => { this.handleSlider(event, newValue, sess.pos) }}

            plotId={sess.id}
          />
        </div>
      )
    });
  }
}

export default App;

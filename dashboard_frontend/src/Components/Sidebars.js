import React, { Component } from 'react';
import Plot from "./Plot/Plot"
import Sidebar from "./Sidebar/Sidebar"
import * as constants from "./constants"

class Sidebars extends Component {

    constructor(props) {
        super(props);
        console.log('[Sidebars.js] constructor');
      }

    state = {
        parameter: {
            file: "2016032700-ART-chemtracer_grid_DOM01_PL_0007.nc",
            mesh: "DOM1", // Selection
            variable: "TR_stn", // Selection
            showCoastline: true,  // Checkbox
            colorMap: "Blues", // Selection
            fixColoring: false, // Checkbox
            symColoring: false, // Checkbox
            logzColoring: false, // Checkbox
            colorLevels: 0, // Selection
            aggregateDim: "None", // Selection
            aggregateFun: "None", // Selection
        },
        aggDimSelect: [{
            value: "None",
            label: "None",
        }], // Placeholder for variables from server
        variables: [{
            value: "TR_stn",
            label: "TR_stn",
        }], // Placeholder for variables from server
        sessionIds: {},
        id: "",
        src: "",
        model: "",
    };

    componentDidMount() {
        // this.getParams();
    }

    getBokehInfo = (event) => {
        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        console.log(model.attributes.children[5].attributes.children[0].attributes.children[0].attributes.children[0].options)
        // model.attributes.children[5].attributes.children[0].attributes.children[0].attributes.children[0].value = ""
    }

    getParams = () => {
        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        // console.log(model)
        // this.setState({variables: attributes.children[3].attributes.children[0].attributes.children[0].attributes.children[0].options})
        this.setState({aggDimSelect: model.attributes.children[10].attributes.children[0].attributes.children[0].attributes.children[0].options})
    };

    setColorMap = (event) => {
        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.colorMap = event.target.value
        this.setState({ property })
        model.attributes.children[5].attributes.children[0].attributes.children[0].attributes.children[0].value = property.colorMap

        // console.log(model.attributes.children[5].attributes.children[0].attributes.children[0].attributes.children[0].options)
        console.log("Changed colormap")
    };

    setActiveEvent = (doesShow) => {
        if (doesShow == true) {
            return []
        } else {
            return [0]
        }
    }

    setShowCoastline = (event) => {
        let doesShow = this.state.parameter.showCoastline;

        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.showCoastline = !doesShow
        this.setState({ property })
        model.attributes.children[4].attributes.children[0].attributes.children[0].attributes.children[0].active = this.setActiveEvent(doesShow);

        console.log("State showCoastline changed")
    };

    setFixColoring = (event) => {
        let doesShow = this.state.parameter.fixColoring;

        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.fixColoring = !doesShow
        this.setState({ property })
        model.attributes.children[6].attributes.children[0].attributes.children[0].attributes.children[0].active = this.setActiveEvent(doesShow);

        console.log("State fixColoring changed")
    };

    setSymColoring = (event) => {
        let doesShow = this.state.parameter.symColoring;

        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.symColoring = !doesShow;
        this.setState({ property })
        model.attributes.children[7].attributes.children[0].attributes.children[0].attributes.children[0].active = this.setActiveEvent(doesShow);

        console.log("State symColoring changed")
    };

    setLogzColoring = (event) => {
        let doesShow = this.state.parameter.fixColoring;

        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.logzColoring = !doesShow;
        this.setState({ property })
        model.attributes.children[8].attributes.children[0].attributes.children[0].attributes.children[0].active = this.setActiveEvent(doesShow);

        console.log("State logzColoring changed")
    };

    setMesh = (event) => {

        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.mesh = event.target.value;
        this.setState({ property })
        model.attributes.children[1].attributes.children[0].attributes.children[0].attributes.children[0].value = property.setMesh;

        console.log("State mesh changed")
    };

    setAggregateFun = (event) => {
        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.aggregateFun = event.target.value;
        this.setState({ property })
        model.attributes.children[11].attributes.children[0].attributes.children[0].attributes.children[0].value = property.aggregateFun;

        console.log("State aggregateFun changed")
    };

    setAggregateDim = (event) => {
        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.aggregateDim = event.target.value;
        this.setState({ property })
        model.attributes.children[10].attributes.children[0].attributes.children[0].attributes.children[0].value = property.aggregateDim;

        console.log("State aggregateDim changed")
    };

    setfile = (event) => {
        this.setState({ file: event.target.value })
        console.log("State file changed")
    };

    setColorLevels = (event) => {
        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.colorLevels = event.target.value;
        this.setState({ property })
        model.attributes.children[9].attributes.children[0].attributes.children[0].attributes.children[0].value = property.colorLevels;

        console.log("State colorLevels changed")
    };

    setVariable = (event) => {
        let model = window.Bokeh.documents[0].get_model_by_id("1000");
        let property = this.state.parameter;
        property.variable = event.target.value;
        this.setState({ property })
        model.attributes.children[3].attributes.children[0].attributes.children[0].attributes.children[0].value = property.variable;

        console.log("State variable changed")
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

    render() {
        const meshSelect = constants.meshSelect;
        const cmSelect = constants.cmSelect;
        const funcSelect = constants.funcSelect;

        return (
            <Sidebar
                txValFile={this.state.parameter.dataPath}
                txChFile={this.setDataPath}
                selValVar={this.state.parameter.variable}
                selChVar={this.setVariable}
                selMapVar={this.state.variables}
                cbStCl={this.state.parameter.showCoastline}
                cbChCl={this.setShowCoastline}
                cbStFc={this.state.parameter.fixColoring}
                cbChFc={this.setFixColoring}
                cbStSc={this.state.parameter.symColoring}
                cbChSc={this.setSymColoring}
                cbStLc={this.state.parameter.logzColoring}
                cbChLc={this.setLogzColoring}
                selValMesh={this.state.parameter.mesh}
                selChMesh={this.setMesh}
                selMapMesh={meshSelect}
                selValCm={this.state.parameter.colorMap}
                selChCm={this.setColorMap}
                selMapCm={cmSelect}
                selValAd={this.state.parameter.aggregateDim}
                selChAd={this.setAggregateDim}
                selMapAd={this.state.aggDimSelect}
                selValAf={this.state.parameter.aggregateFun}
                selChAf={this.setAggregateFun}
                selMapAf={funcSelect}
                txChCl={this.setColorLevels}
                txValCl={this.state.parameter.colorLevels}
            />

        );
    }
}

export default Sidebars;
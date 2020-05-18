import React, { Component } from 'react';
import Aux from "../../Hoc/Aux"
import Plot from "../Plot/Plot"
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import * as constants from "./constants"

import Axios from 'axios';

class Sidebar extends Component {
    state = {
        dataPath: "2016032700-ART-chemtracer_grid_DOM01_PL_0007.nc",
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
        aggDimSelect: [], // Placeholder for variables from server
        variables: [] // Placeholder for variables from server
    };

    componentDidMount() {
        this.getAggDim();
        this.getVariables();
        this.getParameter();
        this.getPlot1();

    }

    postData = () => {
        Axios.post("http://localhost:5000/postParams", {
            state: this.state
        }).then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }

    getParameter = () => {
        Axios.get("http://localhost:5000/pushParams").then((response) => {
            this.setState(response.data)
        });
    };

    getAggDim = () => {
        Axios.get("http://localhost:5000/pushAggDim").then((response) => {
            this.setState({ aggDimSelect: response.data })
        });
    };

    getVariables = () => {
        Axios.get("http://localhost:5000/pushVariables").then((response) => {
            this.setState({ variables: response.data })
        });
    };

    setShowCoastline = (event) => {
        const doesShow = this.state.showCoastline;
        this.setState({ showCoastline: !doesShow })
        console.log("State showCoastline changed")
    };

    setFixColoring = (event) => {
        const doesShow = this.state.fixColoring;
        this.setState({ fixColoring: !doesShow })
        console.log("State fixColoring changed")
    };

    setSymColoring = (event) => {
        const doesShow = this.state.symColoring;
        this.setState({ symColoring: !doesShow })
        console.log("State symColoring changed")
    };

    setLogzColoring = (event) => {
        const doesShow = this.state.logzColoring;
        this.setState({ logzColoring: !doesShow })
        console.log("State logzColoring changed")
    };

    setMesh = (event) => {
        this.setState({ mesh: event.target.value })
        console.log("State mesh changed")
    };

    setColorMap = (event) => {
        this.setState({ colorMap: event.target.value })
        console.log("State colorMap changed")
    };

    setAggregateFun = (event) => {
        this.setState({ aggregateFun: event.target.value })
        console.log("State aggregateFun changed")
    };

    setAggregateDim = (event) => {
        this.setState({ aggregateDim: event.target.value })
        console.log("State aggregateDim changed")
    };

    setDataPath = (event) => {
        this.setState({ dataPath: event.target.value })
        console.log("State dataPath changed")
    };

    setColorLevels = (event) => {
        this.setState({ colorLevels: event.target.value })
        console.log("State colorLevels changed")
    };

    setVariable = (event) => {
        this.setState({ variable: event.target.value })
        console.log("State variable changed")
    };

    setHeight = () => {
        let height = "";
        if (this.state.datapath.includes("ML")) {
            height = "height"
        } else if (this.state.datapath.includes("PL")) {
            height = "lev"
        } else {
            height = "alt"
        };
        return height;
    }

    getPlot1 = () => {
        Axios.get("http://localhost:5000/plot1").then(resp => window.Bokeh.embed.embed_item(resp.data, 'plot1'))
    }

    render() {
        const meshSelect = constants.meshSelect;
        const cmSelect = constants.cmSelect;
        const funcSelect = constants.funcSelect;

        return (
            <Aux>
                <p>
                    <TextField
                        id="standard-basic"
                        value={this.state.dataPath}
                        label="Fill in data path"
                        onChange={this.setDataPath} />
                    <TextField
                        style={{ marginLeft: 20 }}
                        id="standard-select-currency"
                        select
                        label="Variable"
                        value={this.state.variable}
                        onChange={this.setVariable}
                        helperText="Please select Variable for file"
                    >
                        {this.state.variables.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </p>
                <p>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.showCoastline}
                                onChange={this.setShowCoastline}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />}
                        label={"showCoastline"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.fixColoring}
                                onChange={this.setFixColoring}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />}
                        label={"Use fixed coloring"}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.symColoring}
                                onChange={this.setSymColoring}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />}
                        label={"Use symmetric coloring"}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.state.logzColoring}
                                onChange={this.setLogzColoring}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                            />}
                        label={"Logz coloring"}
                    />
                </p>

                <p>
                    <TextField
                        // id="standard-select-currency"
                        select
                        label="Mesh"
                        value={this.state.mesh}
                        onChange={this.setMesh}
                        helperText="Please select mesh for file"
                    >
                        {meshSelect.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        style={{ marginLeft: 20 }}
                        // id="standard-select-currency"
                        select
                        label="Color Map"
                        value={this.state.colorMap}
                        onChange={this.setColorMap}
                        helperText="Please select color map for file"
                    >
                        {cmSelect.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        style={{ marginLeft: 20 }}
                        // id="standard-select-currency"
                        select
                        label="Aggregate dimension"
                        value={this.state.aggregateDim}
                        onChange={this.setAggregateDim}
                        helperText="Please select aggregate dimension"
                    >
                        {this.state.aggDimSelect.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        style={{ marginLeft: 20 }}
                        // id="standard-select-currency"
                        select
                        label="Aggregate function"
                        value={this.state.aggregateFun}
                        onChange={this.setAggregateFun}
                        helperText="Please select aggegate function"
                    >
                        {funcSelect.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </p>

                <p>
                    <TextField id="standard-basic" label="Colorlevels (0:inf):" onChange={this.setColorLevels} value={this.state.colorLevels} />

                </p>

                <p>
                    <Button variant="contained" onClick={this.postData}>Apply</Button>
                </p>
                <div id='plot1' className="bk-root" ></div>

                {/* <Plot
                /> */}
            </Aux>
        );
    }
}

export default Sidebar;
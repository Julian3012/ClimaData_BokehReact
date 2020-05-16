import React, { Component } from 'react';
import Aux from "../../Hoc/Aux"
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import * as constants from "./constants"

import Axios from 'axios';

// ran into this issue (hence no npm import of bokehjs):
// https://github.com/bokeh/bokeh/issues/8197

class Sidebar extends Component {
    state = {
        dataPath: "",
        mesh: "DOM1", // Selection
        variable: "TR_stn", // Selection
        showCoastline: true,  // Checkbox
        colorMap: "Blues", // Selection
        fixColoring: false, // Checkbox
        symColoring: false, // Checkbox
        logzColoring: false, // Checkbox
        colorLevels: 0, // Selection
        aggregateDim: "None", // Selection
        aggregateFun: "None" // Selection
    };


    postData = () => {
        Axios.post("http://localhost:5000/params", {
            state: this.state
        }).then((response) => {
            console.log(response);
        }, (error) => {
            console.log(error);
        });
    }

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

    render() {
        const meshSelect = constants.meshSelect;
        const cmSelect = constants.cmSelect;
        const dimSelect = constants.dimSelect;
        const funcSelect = constants.funcSelect;

        return (
            <Aux>
                <p> <TextField id="standard-basic" label="Fill in data path" onChange={this.setDataPath} /> </p>
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
                        id="standard-select-currency"
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
                        id="standard-select-currency"
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
                        id="standard-select-currency"
                        select
                        label="Aggregate dimension"
                        value={this.state.aggregateDim}
                        onChange={this.setAggregateDim}
                        helperText="Please select aggregate dimension"
                    >
                        {dimSelect.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        style={{ marginLeft: 20 }}
                        id="standard-select-currency"
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
            </Aux>
        );
    }
}

export default Sidebar;
import React, { Component } from 'react';
import { Button, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Axios from 'axios';

// ran into this issue (hence no npm import of bokehjs):
// https://github.com/bokeh/bokeh/issues/8197
const styles = theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

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
        aggregateFun: "None", // Selection
        age: '',
        name: 'hai',
    };

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
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

    render() {
        const { classes } = this.props;

        return (
            <div className="Sidebar" style={{ margin: 20 }}>
                <TextField></TextField>
                <form className={classes.root} autoComplete="off">
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="age-simple">Mesh</InputLabel>
                        <Select
                            value={this.state.age}
                            onChange={this.handleChange}
                            inputProps={{
                                name: 'age',
                                id: 'age-simple',
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </FormControl>
                </form>

                <Button variant="contained" onClick={this.postData}>Apply</Button>
            </div>
        );
    }
}

export default withStyles(styles)(Sidebar);
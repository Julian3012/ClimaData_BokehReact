import React, { Component } from 'react';
import { StyledCheckbox, StyledFormControlLabel } from "../Styles/StyledCheckbox";
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

class Navbar extends Component {

    constructor(props) {
        super(props);
        console.info('[Navbar.js] constructor');
    }

    CbCoastline = () => {
        return (
            <StyledFormControlLabel
                control={
                    <StyledCheckbox
                        checked={this.props.cbStCl}
                        onChange={this.props.cbChCl}
                        variant="outlined"
                        size="small"
                        inputProps={{ 'aria-label': 'primary  Checkbox' }}
                        disabled={this.props.disableOnLoad}
                    />}
                label={this.props.cbLabCl}
            />

        );
    }

    CbFixColoring = () => {
        return (
            <StyledFormControlLabel
                control={
                    <StyledCheckbox
                        checked={this.props.cbStFc}
                        onChange={this.props.cbChFc}
                        variant="outlined"
                        size="small"
                        inputProps={{ 'aria-label': 'primary  Checkbox' }}
                        disabled={this.props.disableOnLoad}
                    />}
                label={this.props.cbLabFc}
            />
        );
    }

    CbSymColoring = () => {
        return (
            <StyledFormControlLabel
                control={
                    <StyledCheckbox
                        checked={this.props.cbStSc}
                        onChange={this.props.cbChSc}
                        size="small"
                        inputProps={{ 'aria-label': 'primary  Checkbox' }}
                        disabled={this.props.disableOnLoad}
                    />}
                label={this.props.cbLabSc}
            />
        );
    }

    CbLogColoring = () => {
        return (
            <StyledFormControlLabel
                control={
                    <StyledCheckbox
                        checked={this.props.cbStLc}
                        onChange={this.props.cbChLc}
                        size="small"
                        inputProps={{ 'aria-label': 'primary  Checkbox' }}
                        disabled={this.props.disableOnLoad}
                    />}
                label={this.props.cbLabLc}
            />
        );
    }

    CbLogX = () => {
        return (
            <StyledFormControlLabel
                control={
                    <StyledCheckbox
                        checked={this.props.cbStLx}
                        variant="outlined"
                        size="small"
                        onChange={this.props.cbChLx}
                        inputProps={{ 'aria-label': 'primary  Checkbox' }}
                        disabled={this.props.cbActLxy || this.props.disableOnLoad}
                    />}
                label={this.props.cbLabLx}
            />
        );
    }

    CbSynchZoom = () => {
        return (
            <StyledFormControlLabel
                control={
                    <StyledCheckbox
                        checked={this.props.cbStSyZoom}
                        variant="outlined"
                        size="small"
                        onChange={this.props.cbChSyZoom}
                        inputProps={{ 'aria-label': 'primary  Checkbox' }}
                        disabled={this.props.disableOnLoad}
                    />}
                label={this.props.cbLabSyZoom}
            />
        )
    }

    render() {
        const navbarStyle = {
            background: "white",
            paddingLeft: 50,
            width: "100%",
            align: "right",
            borderRight: "solid #DADDE7 1px",
            borderTop: "solid #DADDE7 1px",
            borderBottom: "solid #DADDE7 1px",
            position: "fixed",
            zIndex: 1
        };

        return (
            <Toolbar style={navbarStyle} >
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.props.showSidebar}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6">
                    Ncview
                </Typography>

                <Grid container justify="center" alignItems="center" spacing={1}>
                    {this.CbSynchZoom()}
                    {this.CbCoastline()}
                    {this.CbFixColoring()}
                    {this.CbLogColoring()}
                    {this.CbSymColoring()}
                </Grid>
            </Toolbar>
        );
    }
}

export default Navbar;
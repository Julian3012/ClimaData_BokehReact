import React, { Component } from 'react';
import { StyledCheckbox, StyledFormControlLabel } from "../Styles/StyledCheckbox";
import { StyledSelection, StyledMenuItem } from "../Styles/StyledSelection";
import Toolbar from '@material-ui/core/Toolbar';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Button from '@material-ui/core/Button';

class Navbar extends Component {

    constructor(props) {
        super(props);
        console.log('[Navbar.js] constructor');
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
                        disabled={this.props.disableDefault}
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
                        disabled={this.props.disableDefault}
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
                        disabled={this.props.disableDefault}
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
                        disabled={this.props.disableDefault}
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
                        disabled={this.props.cbActLxy}
                    />}
                label={this.props.cbLabLx}
            />
        );
    }

<<<<<<< HEAD
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
                    />}	
                label={this.props.cbLabSyZoom}	
            />	
        )	
    }

=======
>>>>>>> 823c3a46cf2faacb5af7337b1791c220cb16e683
    render() {
        const navbarStyle = {
            background: "white",
            paddingLeft: 50,
            align: "right",
            borderRight: "solid #DADDE7 1px",
            borderTop: "solid #DADDE7 1px",
            borderBottom: "solid #DADDE7 1px",
        };

        return (
            <Toolbar style={navbarStyle}>
                <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.props.showSidebar}>
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6">
                    Ncview
                </Typography>

                <Grid container justify="center" alignItems="center" spacing={1}>
<<<<<<< HEAD
                    {this.CbSynchZoom()}	
=======
                    {this.SelCm()}
>>>>>>> 823c3a46cf2faacb5af7337b1791c220cb16e683
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
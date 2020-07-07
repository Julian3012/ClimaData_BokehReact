import React, { Component } from 'react';
import {StyledCheckbox, StyledFormControlLabel} from "../Styles/StyledCheckbox";
import StyledButton from "../Styles/StyledButton";
import { StyledSelection, StyledMenuItem } from "../Styles/StyledSelection";
import Toolbar from '@material-ui/core/Toolbar';


class Navbar extends Component {

    SelCm = () => {
        return (
            <StyledSelection
                style={{ marginLeft: 20 }}
                select={true}
                variant="outlined"
                size="small"
                label={this.props.selLabCm}
                value={this.props.selValCm}
                onChange={this.props.selChCm}
                disabled={this.props.disableDefault}
            >
                {this.props.selMapCm.map((option) => (
                    <StyledMenuItem key={option.value} value={option.value}>
                        {option.label}
                    </StyledMenuItem>
                ))}
            </StyledSelection>

        );
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

    BtnZoom = () => {
        return (
            <StyledButton variant="contained" style={{ margin: 20 }} onClick={this.props.onClick}>Get Zoom</StyledButton>
        );
    }

    render() {
        const navbarStyle = {
            background: "white",
            // position: "center",
            paddingLeft: 50,
            borderRight: "solid #DADDE7 1px",
            borderTop: "solid #DADDE7 1px",
            borderBottom: "solid #DADDE7 1px",
        };
        return (
            <Toolbar style={navbarStyle}>
                {this.SelCm()}
                {this.CbCoastline()}
                {this.CbFixColoring()}
                {this.CbLogColoring()}
                {this.CbSymColoring()}
                {this.BtnZoom()}
            </Toolbar>
        );
    }
}

export default Navbar;
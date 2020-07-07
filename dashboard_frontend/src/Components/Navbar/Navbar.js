import React, { Component } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { StyledTextField, StyledSlider, ValueLabelComponent } from '../Styles/StyledComponents'
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

class Navbar extends Component {

    TxFile = () => {
        return (
            < StyledTextField
                variant="outlined"
                size="small"
                value={this.props.txValFile}
                label={this.props.txLabFile}
                onChange={this.props.txChFile}
                onKeyDown={this.props.txSbFile}
            />
        );
    }

    SelCm = () => {
        return (
            <TextField
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
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

        );
    }

    CbCoastline = () => {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.props.cbStCl}
                        onChange={this.props.cbChCl}
                        variant="outlined"
                        size="small"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        disabled={this.props.disableDefault}
                    />}
                label={this.props.cbLabCl}
            />

        );
    }

    CbFixColoring = () => {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.props.cbStFc}
                        onChange={this.props.cbChFc}
                        variant="outlined"
                        size="small"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        disabled={this.props.disableDefault}
                    />}
                label={this.props.cbLabFc}
            />
        );
    }

    CbSymColoring = () => {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.props.cbStSc}
                        onChange={this.props.cbChSc}
                        size="small"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        disabled={this.props.disableDefault}
                    />}
                label={this.props.cbLabSc}
            />
        );
    }

    CbLogColoring = () => {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.props.cbStLc}
                        onChange={this.props.cbChLc}
                        size="small"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        disabled={this.props.disableDefault}
                    />}
                label={this.props.cbLabLc}
            />
        );
    }

    SelAggDimension = () => {
        return (

            <TextField
                variant="outlined"
                size="small"
                select={true}
                label={this.props.selLabAd}
                value={this.props.selValAd}
                onChange={this.props.selChAd}
            >
                {this.props.selMapAd.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

        );
    }

    SelAggFunction = () => {
        return (
            <TextField
                style={{ marginLeft: 20 }}
                select={true}
                variant="outlined"
                size="small"
                label={this.props.selLabAf}
                value={this.props.selValAf}
                onChange={this.props.selChAf}
            >
                {this.props.selMapAf.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

        );
    }

    TxColorlvl = () => {
        return (
            <TextField
                style={{ marginLeft: 20 }}
                label={this.props.txLabCol}
                variant="outlined"
                size="small"
                onChange={this.props.txChCol}
                value={this.props.txValCol}
                disabled={this.props.disableDefault}
                onKeyDown={this.props.txSbFile}
            />
        );
    }

    TxFixColMin = () => {
        return (
            <TextField
                label={this.props.txLabFmi}
                variant="outlined"
                size="small"
                onChange={this.props.txChFmi}
                value={this.props.txValFmi}
                disabled={this.props.txActFm} />

        );
    }

    TxFixColMax = () => {
        return (
            <TextField
                label={this.props.txLabFma}
                style={{ marginLeft: 20 }}
                variant="outlined"
                size="small"
                onChange={this.props.txChFma}
                value={this.props.txValFma}
                disabled={this.props.txActFm} />
        );
    }

    CbLogX = () => {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.props.cbStLx}
                        variant="outlined"
                        size="small"
                        onChange={this.props.cbChLx}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        disabled={this.props.cbActLxy}
                    />}
                label={this.props.cbLabLx}
            />
        );
    }

    BtnZoom = () => {
        return (
            <Button variant="contained" style={{ margin: 20 }} onClick={this.props.onClick}>Get Zoom</Button>
        );
    }


    CbLogY = () => {
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        checked={this.props.cbStLy}
                        variant="outlined"
                        size="small"
                        onChange={this.props.cbChLy}
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        disabled={this.props.cbActLxy}
                    />}
                label={this.props.cbLabLy}
            />
        );
    }

    valuetext = (value) => {
        return `${value}`;
    }

    SliderLev = () => {
        return (
            <StyledSlider
                ValueLabelComponent={ValueLabelComponent}
                defaultValue={0}
                orientation="horizontal"
                aria-labelledby="vertical-slider"
                getAriaValueText={this.valuetext}
                step={1}
                min={this.props.start}
                max={this.props.end}
                valueLabelDisplay="on"
                disabled={this.props.isActiveSlider}
                onChange={this.props.slChLev}
            />
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
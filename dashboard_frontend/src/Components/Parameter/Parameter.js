import React, { Component } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { StyledTextField, StyledSlider, ValueLabelComponent } from './StyledComponents'
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

class Parameter extends Component {

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

    SelVariable = () => {
        return (
            <TextField
                // style={{ marginLeft: 20 }}
                variant="outlined"
                size="small"
                select={true}
                label={this.props.selLabVar}
                value={this.props.selValVar}
                onChange={this.props.selChVar}
            >
                {this.props.selMapVar.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
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
      
        return (
            <div>
                <Grid container={true} spacing={3}>
                    <Grid item xs={10}>
                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            {this.TxFile()}
                        </Grid>

                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            {this.SelVariable()}
                            {this.SelCm()}
                        </Grid>

                        <Grid item md={12} xs={6}>
                            {this.CbCoastline()}
                            {this.CbFixColoring()}
                        </Grid>

                        <Grid item md={12} xs={6} style={{ marginBottom: 20 }}>
                            {this.CbSymColoring()}
                            {this.CbLogColoring()}
                        </Grid>

                        <Grid item md={12} xs={4} style={{ marginBottom: 20 }}>
                            {this.SelAggDimension()}
                            {this.SelAggFunction()}
                            {this.TxColorlvl()}
                        </Grid>

                        <Grid item xs={12} style={{ marginTop: 10, marginBottom: 10 }}>
                            {this.SliderLev()}
                        </Grid>

                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            {this.TxFixColMin()}
                            {this.TxFixColMax()}
                        </Grid>

                        <Grid item xs={12}>
                            {this.CbLogX()}
                            {this.CbLogY()}
                        </Grid>

                    </Grid>

                </Grid>
            </div>
        );
    }
}

export default Parameter;
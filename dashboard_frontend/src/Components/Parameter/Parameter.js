import React, { Component } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import styled from 'styled-components';

import Grid from '@material-ui/core/Grid';

class Parameter extends Component {

    render() {
        function valuetext(value) {
            return `${value}`;
        }

        const StyledTextField = styled(TextField)`
                width: 90%;
            `;

        const TxFile = () => {
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

        const SelVariable = () => {
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

        const SelCm = () => {
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

        const CbCoastline = () => {
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

        const CbFixColoring = () => {
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

        const CbSymColoring = () => {
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

        const CbLogColoring = () => {
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

        const SelAggDimension = () => {
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

        const SelAggFunction = () => {
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

        const TxColorlvl = () => {
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

        const TxFixColMin = () => {
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

        const TxFixColMax = () => {
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

        const CbLogX = () => {
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

        const CbLogY = () => {
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

        const SliderLev = () => {
            return (
                <Slider
                    defaultValue={0}
                    orientation="vertical"
                    aria-labelledby="vertical-slider"

                    getAriaValueText={valuetext}
                    step={1}
                    min={this.props.start}
                    max={this.props.end}
                    valueLabelDisplay="on"
                    disabled={this.props.isActiveSlider}
                    onChange={this.props.slChLev}
                />
            );
        }

        return (
            <div>
                <Grid container={true} spacing={3}>
                    <Grid item xs={10}>
                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <TxFile />
                        </Grid>

                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <SelVariable />
                            <SelCm />
                        </Grid>

                        <Grid item xs={12}>
                            <CbCoastline />
                            <CbFixColoring />
                        </Grid>

                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <CbSymColoring />
                            <CbLogColoring />
                        </Grid>

                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <SelAggDimension />
                            <SelAggFunction />
                            <TxColorlvl />
                        </Grid>

                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <TxFixColMin />
                            <TxFixColMax />
                        </Grid>

                        <Grid item xs={12}>
                            <CbLogX />
                            <CbLogY />
                        </Grid>

                    </Grid>

                    <Grid container xs={1}>
                        <Grid item style={{ marginTop: 10 }}>
                            <SliderLev />
                        </Grid>
                    </Grid>

                </Grid>
            </div>
        );
    }
}

export default Parameter;
import React, { Component } from 'react';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { StyledTextField, StyledSlider, ValueLabelComponent } from './StyledComponents'

export const TxFile = () => {
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

export const SelVariable = () => {
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

export const SelCm = () => {
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

export const CbCoastline = () => {
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

export const CbFixColoring = () => {
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

export const CbSymColoring = () => {
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

export const CbLogColoring = () => {
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

export const SelAggDimension = () => {
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

export const SelAggFunction = () => {
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

export const TxColorlvl = () => {
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

export const TxFixColMin = () => {
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

export const TxFixColMax = () => {
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

export const CbLogX = () => {
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

export const CbLogY = () => {
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

export const valuetext = (value) => {
    return `${value}`;
}  

export const SliderLev = () => {
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

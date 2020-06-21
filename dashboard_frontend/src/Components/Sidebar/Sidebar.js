import React, { Component } from 'react';
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

import Grid from '@material-ui/core/Grid';

class Sidebar extends Component {


    render() {

        function valuetext(value) {
            return `${value}`;
        }

        return (
            <div style={{ marginTop: 40 }}>
                <Grid container={true} spacing={3}>
                    <Grid item xs={10} spacing={3}>
                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                value={this.props.txValFile}
                                label={this.props.txLabFile}
                                onChange={this.props.txChFile}
                                onKeyDown={this.props.txSbFile}
                            />
                        </Grid>

                        <Grid item xs={12} style={{ marginBottom: 20 }}>
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
                        </Grid>

                        <Grid item xs={12}>
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
                        </Grid>
                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.props.cbStSc}
                                        onChange={this.props.cbChSc}
                                        variant="outlined"
                                        size="small"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        disabled={this.props.disableDefault}
                                    />}
                                label={this.props.cbLabSc}
                            />

                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.props.cbStLc}
                                        onChange={this.props.cbChLc}
                                        variant="outlined"
                                        size="small"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        disabled={this.props.disableDefault}
                                    />}
                                label={this.props.cbLabLc}
                            />
                        </Grid>

                        <Grid item xs={12} style={{ marginBottom: 20 }}>

                            <TextField
                                // style={{ marginLeft: 20 }}
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
                        </Grid>

                        <Grid item xs={12} style={{ marginBottom: 20 }}>
                            <TextField
                                label={this.props.txLabFmi}
                                variant="outlined"
                                size="small"
                                onChange={this.props.txChFmi}
                                value={this.props.txValFmi}
                                disabled={this.props.txActFm} />

                            <TextField
                                label={this.props.txLabFma}
                                style={{ marginLeft: 20 }}
                                variant="outlined"
                                size="small"
                                onChange={this.props.txChFma}
                                value={this.props.txValFma}
                                disabled={this.props.txActFm} />


                        </Grid>

                        <Grid item xs={12}>
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
                        </Grid>

                    </Grid>

                    <Grid container xs={2}>
                        <Grid item xs={4}>
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
                        </Grid>
                    </Grid>

                </Grid>

            </div>
        );

    }
}

export default Sidebar;
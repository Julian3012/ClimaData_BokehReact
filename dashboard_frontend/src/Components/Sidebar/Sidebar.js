import React, { Component } from 'react';
import Aux from "../../Hoc/Aux"
import Plot from "../Plot/Plot"
import { Button, Checkbox, FormControlLabel } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Slider from '@material-ui/core/Slider';

import Axios from 'axios';

class Sidebar extends Component {


    render() {

        // const PrettoSlider = withStyles({
        //     root: {
        //       color: '#52af77',
        //       height: 8,
        //     },
        //     thumb: {
        //       height: 24,
        //       width: 24,
        //       backgroundColor: '#fff',
        //       border: '2px solid currentColor',
        //       marginTop: -8,
        //       marginLeft: -12,
        //       '&:focus, &:hover, &$active': {
        //         boxShadow: 'inherit',
        //       },
        //     },
        //     active: {},
        //     valueLabel: {
        //       left: 'calc(-50% + 4px)',
        //     },
        //     track: {
        //       height: 8,
        //       borderRadius: 4,
        //     },
        //     rail: {
        //       height: 8,
        //       borderRadius: 4,
        //     },
        //   })(Slider);

        function valuetext(value) {
            return `${value}`;
        }

        const marks = [
            {
                value: 0,
                label: '0°C',
            },
            {
                value: 20,
                label: '20°C',
            },
            {
                value: 37,
                label: '37°C',
            },
            {
                value: 100,
                label: '100°C',
            },
        ];

        return (
            <Aux>
                <div>
                    <TextField
                        value={this.props.txValFile}
                        label={this.props.txLabFile}
                        onChange={this.props.txChFile} 
                        onKeyDown={this.props.txSbFile}
                        />
                    <TextField
                        style={{ marginLeft: 20 }}
                        select
                        label={this.props.selLabVar}
                        value={this.props.selValVar}
                        onChange={this.props.selChVar}
                        helperText="Please select Variable for file"
                    >
                        {this.props.selMapVar.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.props.cbStCl}
                                onChange={this.props.cbChCl}
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
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                disabled={this.props.disableDefault}
                            />}
                        label={this.props.cbLabFc}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.props.cbStSc}
                                onChange={this.props.cbChSc}
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
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                disabled={this.props.disableDefault} 
                            />}
                        label={this.props.cbLabLc}
                    />
                </div>

                <div>
             
                    <TextField
                        style={{ marginLeft: 20 }}
                        // id="standard-select-currency"
                        select
                        label={this.props.selLabCm}
                        value={this.props.selValCm}
                        onChange={this.props.selChCm}
                        helperText="Please select color map for file"
                        disabled={this.props.disableDefault} 
                    >
                        {this.props.selMapCm.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        style={{ marginLeft: 20 }}
                        // id="standard-select-currency"
                        select
                        label={this.props.selLabAd}
                        value={this.props.selValAd}
                        onChange={this.props.selChAd}
                        helperText="Please select aggregate dimension"
                    >
                        {this.props.selMapAd.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        style={{ marginLeft: 20 }}
                        select
                        label={this.props.selLabAf}
                        value={this.props.selValAf}
                        onChange={this.props.selChAf}
                        helperText="Please select aggegate function"
                    >
                        {this.props.selMapAf.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </div>

                <div>
                    <TextField
                        label={this.props.txLabCol}
                        onChange={this.props.txChCol}
                        value={this.props.txValCol}
                        disabled={this.props.disableDefault} 
                        onKeyDown={this.props.txSbFile}
                        />
                </div>

                <div>
                    <Button variant="contained" onClick={this.props.btClick}>Apply</Button>
                </div>

                <div>
                    <TextField
                        label={this.props.txLabFmi}
                        onChange={this.props.txChFmi}
                        value={this.props.txValFmi} 
                        disabled={this.props.txActFm}/>
                        
                    <TextField
                        label={this.props.txLabFma}
                        onChange={this.props.txChFma}
                        value={this.props.txValFma} 
                        disabled={this.props.txActFm}/>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={this.props.cbStLx}
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
                                onChange={this.props.cbChLy}
                                inputProps={{ 'aria-label': 'primary checkbox' }}
                                disabled={this.props.cbActLxy}
                            />}
                        label={this.props.cbLabLy}
                    />
                </div>

                <div>
                    <Slider
                        defaultValue={0}
                        getAriaValueText={valuetext}
                        // aria-labelledby="discrete-slider-always"
                        step={1}
                        min={this.props.start}
                        max={this.props.end}
                        valueLabelDisplay="on"
                        disabled={this.props.isActiveSlider}
                        onChange={this.props.slChLev}
                    />
                </div>
            </Aux>
        );

    }
}

export default Sidebar;
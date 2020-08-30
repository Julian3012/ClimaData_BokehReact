import React, { Component } from 'react';
import { StyledSlider, ValueLabelComponent } from '../Styles/StyledSlider';
import StyledButton from "../Styles/StyledButton";
import FileTextField from "../Styles/FileTextField";
import { StyledCheckbox, StyledFormControlLabel } from "../Styles/StyledCheckbox";
import { StyledSelection, StyledMenuItem } from "../Styles/StyledSelection";
import Grid from '@material-ui/core/Grid';
import StyledTextField from '../Styles/StyledTextField';
import Hidden from '@material-ui/core/Hidden';

class Parameter extends Component {

    TxFile = () => {
        return (
            < FileTextField
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
            <StyledSelection
                variant="outlined"
                size="small"
                select={true}
                label={this.props.selLabVar}
                value={this.props.selValVar}
                onChange={this.props.selChVar}
            >
                {this.props.selMapVar.map((option) => (
                    <StyledMenuItem key={option.value} value={option.value}>
                        {option.label}
                    </StyledMenuItem>
                ))}
            </StyledSelection>
        );
    }

    SelCm = () => {
        return (
            <StyledSelection
                style={{ marginRight: 20 }}
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

    SelAggDimension = () => {
        return (
            <StyledSelection
                variant="outlined"
                size="small"
                select={true}
                label={this.props.selLabAd}
                value={this.props.selValAd}
                onChange={this.props.selChAd}
            >
                {this.props.selMapAd.map((option) => (
                    <StyledMenuItem key={option.value} value={option.value}>
                        {option.label}
                    </StyledMenuItem>
                ))}
            </StyledSelection>
        );
    }

    SelAggFunction = () => {
        return (
            <StyledSelection
                select={true}
                variant="outlined"
                size="small"
                label={this.props.selLabAf}
                value={this.props.selValAf}
                onChange={this.props.selChAf}
            >
                {this.props.selMapAf.map((option) => (
                    <StyledMenuItem key={option.value} value={option.value}>
                        {option.label}
                    </StyledMenuItem>
                ))}
            </StyledSelection>

        );
    }

    styles = theme => ({
        textField: {
            width: '90%',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingBottom: 0,
            marginTop: 0,
            fontWeight: 500
        },
        input: {
            color: 'white'
        }
    });

    TxColorlvl = () => {
        return (
            <StyledTextField
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
            <StyledTextField
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
            <StyledTextField
                label={this.props.txLabFma}
                variant="outlined"
                size="small"
                onChange={this.props.txChFma}
                value={this.props.txValFma}
                disabled={this.props.txActFm} />
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
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                        disabled={this.props.cbActLxy}
                    />}
                label={this.props.cbLabLx}
            />
        );
    }

    CbLogY = () => {
        return (
            <StyledFormControlLabel
                control={
                    <StyledCheckbox
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
                display={"none"}
            />
        );
    }

    BtnZoom = () => {
        return (
            <StyledButton variant="contained" onClick={this.props.onClick}>Get Zoom</StyledButton>
        );
    }

    render() {

        return (
            <div>
                <Grid container spacing={3}>
                    <Grid item xs={12} >
                        {this.TxFile()}
                    </Grid>

                    <Grid item md={12} xs={4} >
                        {this.SelVariable()}
                        {this.SelCm()}
                    </Grid>

                    <Grid item md={12} xs={4} >
                        {this.SelAggDimension()}
                        {this.SelAggFunction()}
                        <Hidden xlDown={this.props.disableDefault}>
                            {this.TxColorlvl()}
                        </Hidden>
                    </Grid>

                    <Grid item xs={12} >
                        <Hidden xlDown={this.props.txActFm}>
                            {this.TxFixColMin()}
                            {this.TxFixColMax()}
                        </Hidden>
                    </Grid>

                    <Grid item xs={12}>
                        <Hidden xlDown={this.props.cbActLxy}>
                            {this.CbLogX()}
                            {this.CbLogY()}
                        </Hidden>
                    </Grid>

                </Grid>
            </div>
        );
    }
}

export default Parameter;
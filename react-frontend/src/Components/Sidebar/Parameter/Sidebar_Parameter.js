import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import FileTextField from "../../Styles/FileTextField";
import { StyledCheckbox, StyledFormControlLabel } from "../../Styles/StyledCheckbox";
import { StyledSelection, StyledMenuItem } from "../../Styles/StyledSelection";
import Grid from '@material-ui/core/Grid';
import StyledTextField from '../../Styles/StyledTextField';
import Hidden from '@material-ui/core/Hidden';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

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
                disabled={this.props.disableOnLoad}
            />
        );
    }

    SelVariable = () => {
        return (
            <FormControl variant="outlined" size="small">
                <InputLabel>{this.props.selLabVar}</InputLabel>
                <StyledSelection
                    select={true}
                    onOpen={this.props.handleVarClick}
                    label={this.props.selLabVar}
                    value={this.props.selValVar}
                    onChange={this.props.selChVar}
                    disabled={this.props.disableOnLoad}
                >
                    {this.props.selMapVar.map((option) => (
                        <StyledMenuItem key={option.value} value={option.value}>
                            {option.label}
                        </StyledMenuItem>
                    ))}
                </StyledSelection>
            </FormControl>
        );
    }

    SelCm = () => {
        return (
            <FormControl variant="outlined" size="small">
                <InputLabel>{this.props.selLabCm}</InputLabel>
                <StyledSelection
                    style={{ marginRight: 20 }}
                    select={true}
                    variant="outlined"
                    size="small"
                    label={this.props.selLabCm}
                    value={this.props.selValCm}
                    onChange={this.props.selChCm}
                    disabled={this.props.disableDefault || this.props.disableOnLoad}
                    >
                    {this.props.selMapCm.map((option) => (
                        <StyledMenuItem key={option.value} value={option.value}>
                            {option.label}
                        </StyledMenuItem>
                    ))}
                </StyledSelection>
            </FormControl>
        );
    }
    
    SelAggDimension = () => {
        return (
            <FormControl variant="outlined" size="small">
                <InputLabel>{this.props.selLabAd}</InputLabel>
                <StyledSelection
                    variant="outlined"
                    size="small"
                    select={true}
                    label={this.props.selLabAd}
                    value={this.props.selValAd}
                    onChange={this.props.selChAd}
                    disabled={this.props.disableOnLoad}
                >
                    {this.props.selMapAd.map((option) => (
                        <StyledMenuItem key={option.value} value={option.value}>
                            {option.label}
                        </StyledMenuItem>
                    ))}
                </StyledSelection>
            </FormControl>

        );
    }

    SelAggFunction = () => {
        return (
            <FormControl variant="outlined" size="small">
                <InputLabel>{this.props.selLabAf}</InputLabel>
                <StyledSelection
                    select={true}
                    variant="outlined"
                    size="small"
                    label={this.props.selLabAf}
                    value={this.props.selValAf}
                    onChange={this.props.selChAf}
                    disabled={this.props.disableOnLoad}
                >
                    {this.props.selMapAf.map((option) => (
                        <StyledMenuItem key={option.value} value={option.value}>
                            {option.label}
                        </StyledMenuItem>
                    ))}
                </StyledSelection>
            </FormControl>
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
                disabled={this.props.disableDefault || this.props.disableOnLoad}
                onKeyDown={this.props.txSbFile}
            />
        );
    }

    TxFixColMin = () => {
        return (
            <TextField
                label={this.props.txLabFmi}
                style={{ width: "100%" }}
                variant="outlined"
                size="small"
                onChange={this.props.txChFmi}
                value={this.props.txValFmi}
                disabled={this.props.txActFm || this.props.disableOnLoad} />

        );
    }

    TxFixColMax = () => {
        return (
            <TextField
                label={this.props.txLabFma}
                style={{ width: "100%" }}
                variant="outlined"
                size="small"
                onChange={this.props.txChFma}
                value={this.props.txValFma}
                disabled={this.props.txActFm || this.props.disableOnLoad} />
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
                        disabled={this.props.cbActLxy || this.props.disableOnLoad}
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
                        disabled={this.props.cbActLxy || this.props.disableOnLoad}
                    />}
                label={this.props.cbLabLy}
            />
        );
    }

    applyBtn = () => {
        return (
            <Button
                variant="contained"
                onClick={this.props.handleApply}
                disabled={this.props.disableOnLoad}
            >
                Apply
            </Button>
        );
    }

    delPltBtn = () => {
        return (
            <Button
                variant="contained"
                onClick={this.props.handleDelete}
                disabled={this.props.disableOnLoad}
            >
                Delete
            </Button>
        );
    }

    render() {

        return (
            <div>
                <Grid container spacing={1}>
                    <Grid item xs={12} >
                        {this.TxFile()}
                    </Grid>

                    <Grid item md={12} xs={4} >
                        {this.SelVariable()}
                    </Grid>

                    <Grid item md={6} xs={4} >
                        {this.SelCm()}
                    </Grid>

                    <Grid item md={6} xs={4} >
                        {this.SelAggDimension()}
                    </Grid>

                    <Grid item md={6} xs={4} >
                        {this.SelAggFunction()}
                    </Grid>
                    <Hidden xlDown={this.props.disableDefault}>
                        <Grid item md={12} xs={4} >
                            {this.TxColorlvl()}
                        </Grid>
                    </Hidden>

                    <Hidden xlDown={this.props.txActFm}>
                        <Grid item md={6} >
                            {this.TxFixColMin()}
                        </Grid>

                        <Grid item md={6} >
                            {this.TxFixColMax()}
                        </Grid>
                    </Hidden>

                    <Hidden xlDown={this.props.cbActLxy}>
                        <Grid item xs={12}>
                            {this.CbLogX()}
                            {this.CbLogY()}
                        </Grid>
                    </Hidden>

                    <Grid item md={6} xs={4} >
                        {this.applyBtn()}
                    </Grid>

                    <Grid item md={6} xs={4} >
                        {this.delPltBtn()}
                    </Grid>

                </Grid>
            </div>
        );
    }
}

export default Parameter;
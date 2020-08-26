import React, { Component } from 'react';
import Plot from "./Plot/Plot";
import Navbar from "./Navbar/Navbar";
import Grid from '@material-ui/core/Grid';
import Sidebar from "./Sidebar/Sidebar";
import { StyledSlider, ValueLabelComponent } from './Styles/StyledSlider';
import Hidden from '@material-ui/core/Hidden';

class MultiPlot extends Component {
    SidebarProps = () => {
        if (this.props.activeSidebar) {
            return (
                <Sidebar
                    bk_session={this.props.bk_session}
                    txChFile={this.props.txChFile}
                    txSbFile={this.props.txSbFile}

                    selChVar={this.props.selChVar}

                    selChAd={this.props.selChAd}

                    selChAf={this.props.selChAf}
                    selMapAf={this.props.selMapAf}

                    txChCol={this.props.txChCol}

                    txChFmi={this.props.txChFmi}

                    txChFma={this.props.txChFma}

                    cbChLx={this.props.cbChLx}

                    cbChLy={this.props.cbChLy}

                    slChLev={this.props.slChLev}

                    onClick={this.props.onClick}

                    addPlot={this.props.addPlot}
                    deletePlot={this.props.deletePlot}
                />
            );
        }
    }

    NavbarProps = () => {
        return (
            <Navbar
                cbLabCl="Show Coastline"
                cbStCl={this.props.cbStCl}
                cbChCl={(event) => { this.props.cbChCl(event, this.props.bk_session) }}

                cbLabFc="Fix Coloring"
                cbStFc={this.props.cbStFc}
                cbChFc={(event) => { this.props.cbChFc(event, this.props.bk_session) }}

                cbLabSc="Symmetric Coloring"
                cbStSc={this.props.cbStSc}
                cbChSc={(event) => { this.props.cbChSc(event, this.props.bk_session) }}

                cbLabLc="Log z Coloring"
                cbStLc={this.props.cbStLc}
                cbChLc={(event) => { this.props.cbChLc(event, this.props.bk_session) }}

                selLabCm="Colormap"
                selValCm={this.props.selValCm}
                selChCm={(event) => { this.props.selChCm(event, this.props.bk_session) }}
                selMapCm={this.props.selMapCm}

                disableDefault={this.props.disableDefaultNavbar}

                showSidebar={this.props.showSidebar}
            />
        );
    }

    setPlots = (active) => {
        if (active) {
            return 9;
        } else {
            return 12;
        }
    }

    setSidebar = (active) => {
        if (active) {
            return 2;
        } else {
            return 0;
        }
    }

    SliderLev = (sess) => {
        return (
            <StyledSlider
                ValueLabelComponent={ValueLabelComponent}
                defaultValue={0}
                orientation="horizontal"
                aria-labelledby="vertical-slider"
                getAriaValueText={this.valuetext}
                step={1}
                min={sess.sliderStart}
                max={sess.sliderEnd}
                valueLabelDisplay="on"
                disabled={sess.diabled_Slider}
                onChange={(event, newValue) => { this.props.slChLev(event, newValue, [sess.pos]) }}
                display="none"
            />
        );
    }

    render() {

        const gridRightStyle = {
            background: "white",
            // height: 450,
            // padding: 0,
            margin: 10,
            borderRight: "solid #DADDE7 1px",
            borderLeft: "solid #DADDE7 1px",
            borderTop: "solid #DADDE7 1px",
            borderBottom: "solid #DADDE7 1px",
        };

        const containerStyle = {
            margin: 10,
        }

        return (
            <div className="App">
                {this.NavbarProps()}


                <div style={containerStyle}>
                    <Grid container>
                        {this.SidebarProps()}
                        <Grid item xs={this.setPlots(this.props.activeSidebar)}>
                            <Grid container justify="center">
                                <Grid item xs={11} >
                                    <Grid container alignItems="flex-start">
                                        <Grid item xs={12}>
                                            <Plot plotId={this.props.plotId}></Plot>
                                        </Grid>
                                        {/* <Grid item xs={9}>
                                            <Hidden xlDown={sess.diabled_Slider}>
                                                {this.SliderLev(sess)}
                                            </Hidden>
                                        </Grid> */}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </div>
        )
    }
}


export default MultiPlot;
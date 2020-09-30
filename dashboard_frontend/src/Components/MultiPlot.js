import React, { Component } from 'react';
import Plot from "./Plot/Plot";
import Navbar from "./Navbar/Navbar";
import Grid from '@material-ui/core/Grid';
import Sidebar from "./Sidebar/Sidebar";

class MultiPlot extends Component {
    SidebarProps = () => {
        if (this.props.activeSidebar) {
            return (
                <Sidebar
                    bk_session={this.props.bk_session}
                    txChFile={this.props.txChFile}
                    txSbFile={this.props.txSbFile}

                    selChCm={this.props.selChCm}

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

                    handleApply={this.props.handleApply}

                    disableOnLoad={this.props.disableOnLoad}
                />
            );
        }
    }

    NavbarProps = () => {
        return (
            <Navbar
                cbLabSyZoom="Synchonize Zoom"
                cbStSyZoom={this.props.cbStSyZoom}
                cbChSyZoom={this.props.cbChSyZoom}

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

                disableDefault={this.props.disableDefaultNavbar}
                disableOnLoad={this.props.disableOnLoad}

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

    render() {

        return (
            <div>
                {this.NavbarProps()}
                <div >
                    <Grid container>
                        {this.SidebarProps()}
                        <Grid item xs={this.setPlots(this.props.activeSidebar)}>
                            <Grid container justify="center">
                                <Grid item xs={12} >
                                    <Grid container alignItems="flex-start">
                                        <Plot plotId={this.props.plotId} activeSidebar={this.props.activeSidebar}></Plot>
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
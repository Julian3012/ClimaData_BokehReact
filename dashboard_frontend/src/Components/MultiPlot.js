import React, { Component } from 'react';
import Plot from "./Plot/Plot";
import Parameter2 from "./Parameter/Parameter2";
import Navbar from "./Navbar/Navbar";
import Grid from '@material-ui/core/Grid';

class MultiPlot extends Component {
    ParameterProps = (sess) => {
        return (
            <Parameter2
                txLabFile="Filepath"
                txValFile={sess.file}
                txChFile={(event) => { this.props.txChFile(event, [sess.pos]) }}
                txSbFile={(event) => { this.props.txSbFile(event, [sess.pos]) }}

                selLabVar="Variable"
                selValVar={sess.variable}
                selChVar={(event) => { this.props.selChVar(event, [sess.pos]) }}
                selMapVar={sess.variables}

                selLabAd="Dimension"
                selValAd={sess.aggregateDim}
                selChAd={(event) => { this.props.selChAd(event, [sess.pos]) }}
                selMapAd={sess.aggDimSelect}

                selLabAf="Function"
                selValAf={sess.aggregateFun}
                selChAf={(event) => { this.props.selChAf(event, [sess.pos]) }}
                selMapAf={this.props.selMapAf}

                txLabCol="Color Levels"
                txChCol={(event) => { this.props.txChCol(event, [sess.pos]) }}
                txValCol={sess.colorLevels}

                txLabFmi="Fix color min"
                txValFmi={sess.fixColMin}
                txChFmi={(event) => { this.props.txChFmi(event, [sess.pos]) }}

                txLabFma="Fix color max"
                txValFma={sess.fixColMax}
                txChFma={(event) => { this.props.txChFma(event, [sess.pos]) }}

                cbLabLx="logX"
                cbChLx={(event) => { this.props.cbChLx(event, [sess.pos]) }}
                cbStLx={sess.logx}

                cbLabLy="logY"
                cbChLy={(event) => { this.props.cbChLy(event, [sess.pos]) }}
                cbStLy={sess.logy}

                cbActLxy={sess.disabled_Logxy}
                txActFm={sess.disabled_FixCol}
                disableDefault={sess.disableDefault}

                start={sess.sliderStart}
                end={sess.sliderEnd}
                isActiveSlider={sess.diabled_Slider}
                slChLev={(event, newValue) => { this.props.slChLev(event, newValue, [sess.pos]) }}
            />
        );
    }

    NavbarProps = () => {
        return (
            <Navbar
                cbLabCl="Show Coastline"
                cbStCl={this.props.cbStCl}
                cbChCl={(event) => { this.props.cbChCl(event, [0,1]) }}

                cbLabFc="Fix Coloring"
                cbStFc={this.props.cbStFc}
                cbChFc={(event) => { this.props.cbChFc(event, [0,1]) }}

                cbLabSc="Symmetric Coloring"
                cbStSc={this.props.cbStSc}
                cbChSc={(event) => { this.props.cbChSc(event, [0,1]) }}

                cbLabLc="Log z Coloring"
                cbStLc={this.props.cbStLc}
                cbChLc={(event) => { this.props.cbChLc(event, [0,1]) }}

                selLabCm="Colormap"
                selValCm={this.props.selValCm}
                selChCm={(event) => { this.props.selChCm(event, [0,1]) }}
                selMapCm={this.props.selMapCm}

                disableDefault={this.props.disableDefaultNavbar}

                onClick={this.props.onClick}
            />
        );
    }


    render() {
        const gridLeftStyle = {
            background: "white",
            // height: 450,
            borderLeft: "solid #DADDE7 1px",
            borderTop: "solid #DADDE7 1px",
            borderBottom: "solid #DADDE7 1px",
        };

        const gridRightStyle = {
            background: "white",
            // height: 450,
            padding: 0,
            borderRight: "solid #DADDE7 1px",
            borderTop: "solid #DADDE7 1px",
            borderBottom: "solid #DADDE7 1px",
        };


        return (
            <div className="App">
                {this.NavbarProps()}
                {this.props.bk_session.map((sess) => {
                    return (
                        <Grid container spacing={3} style={{ margin: 20 }}>
                            <Grid item sm={4} style={gridLeftStyle}>
                                {this.ParameterProps(sess)}
                            </Grid>
                            <Grid item xs={6} style={gridRightStyle}>
                                <Plot plotId={sess.id}></Plot>
                            </Grid>
                        </Grid>
                    )
                })}
            </div>
        )
    }
}


export default MultiPlot;
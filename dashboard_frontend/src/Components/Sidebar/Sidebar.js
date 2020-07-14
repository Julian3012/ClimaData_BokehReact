import React, { Component } from 'react';
import Parameter2 from "../Parameter/Parameter2";
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class Sidebar extends Component {
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

                // start={sess.sliderStart}
                // end={sess.sliderEnd}
                // isActiveSlider={sess.diabled_Slider}
                // slChLev={(event, newValue) => { this.props.slChLev(event, newValue, [sess.pos]) }}

                // onClick={() => { this.props.onClick([sess.pos]) }}
            />
        );
    }

    render() {
        const gridLeftStyle = {
            background: "white",
            // height: 450,
            borderRight: "solid #DADDE7 1px",
            borderLeft: "solid #DADDE7 1px",
            borderTop: "solid #DADDE7 1px",
            borderBottom: "solid #DADDE7 1px",
        };


        return (
            <Grid item xs={2}>

                <Grid container>

                    {this.props.bk_session.map((sess) => {
                        return (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    Plot {sess.pos + 1}
                                        </AccordionSummary>
                                <AccordionDetails>
                                    {this.ParameterProps(sess)}
                                </AccordionDetails>
                            </Accordion>
                        )
                    })}
                </Grid>
            </Grid>
        )

    }
}

export default Sidebar;
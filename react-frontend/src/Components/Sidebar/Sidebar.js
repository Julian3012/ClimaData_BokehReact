import React, { Component } from 'react';
import Parameter from "./Parameter/Sidebar_Parameter";
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StyledButton from "../Styles/StyledButton";
import * as constants from "../../Components/constants"

class Sidebar extends Component {

    constructor(props) {
        super(props);
        console.info('[App.js] constructor');
    }

    ParameterProps = (sess) => {
        return (
            <Parameter
                txLabFile="Filepath"
                txValFile={sess.file}
                txChFile={(event) => { this.props.txChFile(event, [sess.pos]) }}
                txSbFile={(event) => { this.props.txSbFile(event, [sess.pos]) }}

                selLabVar="Variable"
                selValVar={sess.variable}
                selChVar={(event) => { this.props.selChVar(event, [sess.pos]) }}
                selMapVar={sess.variables}
                handleVarClick={(event) => { this.props.handleVarClick(event, sess.pos) }}

                selLabCm="Colormap"
                selValCm={sess.colorMap}
                selChCm={(event) => { this.props.selChCm(event, [sess.pos]) }}
                selMapCm={constants.cmSelect}

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

                handleApply={(event) => { this.props.handleApply(sess.pos) }}
                handleDelete={(event) => { this.props.handleDelete(sess.pos) }}

                cbActLxy={sess.disabled_Logxy}
                txActFm={sess.disabled_FixCol}
                disableDefault={sess.disableDefault}
                disableOnLoad={this.props.disableOnLoad}
            />
        );
    }

    render() {
        const gridSidebar = {
            marginTop: 70,
            maxHeight: "90vh",
            overflow: 'auto',
            position: "fixed",
            width: "100%",
            zIndex: 1,
        };
        return (
            <Grid item xs={2} style={gridSidebar}>
                <Grid container justify="center" style={{ marginBottom: 5 }}>
                    <StyledButton onClick={this.props.deletePlot} disabled={this.props.disableOnLoad}>
                        Delete Plots
                    </StyledButton>
                </Grid>

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

                <Grid container justify="center">
                    <StyledButton onClick={this.props.addPlot} disabled={this.props.disableOnLoad}>
                        Add Plot
                    </StyledButton>
                </Grid>
            </Grid>
        )

    }
}

export default Sidebar;
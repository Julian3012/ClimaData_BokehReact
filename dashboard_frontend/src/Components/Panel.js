import React, { Component } from 'react';
import Plot from "./Plot/Plot"
import Parameter from "./Parameter/Parameter"
import Grid from '@material-ui/core/Grid';

class Panel extends Component {

  ParameterProps = (sess) => {
    return (
      <Parameter
        txLabFile="Filepath"
        txValFile={sess.file}
        txChFile={(event) => {this.props.txChFile(event, sess.pos)}}
        txSbFile={(event) => {this.props.txSbFile(event, sess.pos)}}

        selLabVar="Variable"
        selValVar={sess.variable}
        selChVar={(event) => {this.props.selChVar(event, sess.pos)}}
        selMapVar={sess.variables}

        cbLabCl="Show Coastline"
        cbStCl={sess.showCoastline}
        cbChCl={(event) => {this.props.cbChCl(event, sess.pos)}}

        cbLabFc="Fix Coloring"
        cbStFc={sess.fixColoring}
        cbChFc={(event) => {this.props.cbChFc(event, sess.pos)}}

        cbLabSc="Symmetric Coloring"
        cbStSc={sess.symColoring}
        cbChSc={(event) => {this.props.cbChSc(event, sess.pos)}}

        cbLabLc="Log z Coloring"
        cbStLc={sess.logzColoring}
        cbChLc={(event) => {this.props.cbChLc(event, sess.pos)}}

        selLabCm="Colormap"
        selValCm={sess.colorMap}
        selChCm={(event) => {this.props.selChCm(event, sess.pos)}}
        selMapCm={this.props.selMapCm}

        selLabAd="Dimension"
        selValAd={sess.aggregateDim}
        selChAd={(event) => {this.props.selChAd(event, sess.pos)}}
        selMapAd={sess.aggDimSelect}

        selLabAf="Function"
        selValAf={sess.aggregateFun}
        selChAf={(event) => {this.props.selChAf(event, sess.pos)}}
        selMapAf={this.props.selMapAf}

        txLabCol="Color Levels"
        txChCol={(event) => {this.props.txChCol(event, sess.pos)}}
        txValCol={sess.colorLevels}

        txLabFmi="Fix color minimum"
        txValFmi={sess.fixColMin}
        txChFmi={(event) => {this.props.txChFmi(event, sess.pos)}}

        txLabFma="Fix color maximum"
        txValFma={sess.fixColMax}
        txChFma={(event) => {this.props.txChFma(event, sess.pos)}}

        cbLabLx="logX"
        cbChLx={(event) => {this.props.cbChLx(event, sess.pos)}}
        cbStLx={sess.logx}

        cbLabLy="logY"
        cbChLy={(event) => {this.props.cbChLy(event, sess.pos)}}
        cbStLy={sess.logy}

        txActFm={sess.disabled_FixCol}
        cbActLxy={sess.disabled_Logxy}
        disableDefault={sess.disabled_default}

        start={sess.sliderStart}
        end={sess.sliderEnd}
        isActiveSlider={sess.diabled_Slider}
        slChLev={(event, newValue) => {this.props.slChLev(event, newValue, sess.pos)}}
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

        {this.props.bk_session.map((sess) => {
          return (
            <Grid container spacing={3} style={{ margin: 20 }}>
              <Grid item sm={4} style={gridLeftStyle}>
                {this.ParameterProps(sess)}
              </Grid>
              <Grid item xs={6} style={gridRightStyle}>
                <Plot plotId={sess.id}></Plot>
              </Grid>
            </Grid>)
        })}
      </div>
    )
  }
}


export default Panel;
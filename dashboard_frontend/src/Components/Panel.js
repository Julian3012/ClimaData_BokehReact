import React, { Component } from 'react';
import Plot from "./Plot/Plot"
import Parameter from "./Parameter/Parameter"
import Grid from '@material-ui/core/Grid';

class Panel extends Component {
  
  ParameterProps = () => {
    return (
      <Parameter
        txLabFile="Filepath"
        txValFile={this.props.txValFile}
        txChFile={this.props.txChFile}
        txSbFile={this.props.txSbFile}

        selLabVar="Variable"
        selValVar={this.props.selValVar}
        selChVar={this.props.selChVar}
        selMapVar={this.props.selMapVar}

        cbLabCl="Show Coastline"
        cbStCl={this.props.cbStCl}
        cbChCl={this.props.cbChCl}

        cbLabFc="Fix Coloring"
        cbStFc={this.props.cbStFc}
        cbChFc={this.props.cbChFc}

        cbLabSc="Symmetric Coloring"
        cbStSc={this.props.cbStSc}
        cbChSc={this.props.cbChSc}

        cbLabLc="Log z Coloring"
        cbStLc={this.props.cbStLc}
        cbChLc={this.props.cbChLc}

        selLabCm="Colormap"
        selValCm={this.props.selValCm}
        selChCm={this.props.selChCm}
        selMapCm={this.props.selMapCm}

        selLabAd="Dimension"
        selValAd={this.props.selValAd}
        selChAd={this.props.selChAd}
        selMapAd={this.props.selMapAd}

        selLabAf="Function"
        selValAf={this.props.selValAf}
        selChAf={this.props.selChAf}
        selMapAf={this.props.selMapAf}

        txLabCol="Color Levels"
        txChCol={this.props.txChCol}
        txValCol={this.props.txValCol}

        txLabFmi="Fix color minimum"
        txValFmi={this.props.txValFmi}
        txChFmi={this.props.txChFmi}

        txLabFma="Fix color maximum"
        txValFma={this.props.txValFma}
        txChFma={this.props.txChFma}

        cbLabLx="logX"
        cbChLx={this.props.cbChLx}
        cbStLx={this.props.cbStLx}

        cbLabLy="logY"
        cbChLy={this.props.cbChLy}
        cbStLy={this.props.cbStLy}

        txActFm={this.props.txActFm}
        cbActLxy={this.props.cbActLxy}
        disableDefault={this.props.disableDefault}

        start={this.props.start}
        end={this.props.end}
        isActiveSlider={this.props.isActiveSlider}
        slChLev={this.props.slChLev}
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
        <Grid container spacing={3} style={{ margin: 20 }}>
          <Grid item sm={4} style={gridLeftStyle}>
            {this.ParameterProps()}
          </Grid>
          <Grid item xs={6} style={gridRightStyle}>
            <Plot id={5023}></Plot>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Panel;
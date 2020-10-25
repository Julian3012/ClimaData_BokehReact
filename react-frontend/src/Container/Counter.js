export class PlotRange {

    constructor(cnt, posPlot) {
        this.counter = cnt;
        const model = window.Bokeh.documents[0].get_model_by_id("1000");
        const divPlot = posPlot
        let numPlot = 0;
        if(model.attributes.children[divPlot].attributes.children[numPlot].attributes.hasOwnProperty("children")){
            this.plot_attributes = model.attributes.children[divPlot].attributes.children[numPlot].attributes.children[0]
          } else {
            this.plot_attributes = model.attributes.children[divPlot].attributes.children[numPlot]
          }

        this.newRange = {
            "model_y_end": 0,
            "model_y_start": 0,
            "model_x_end": 0,
            "model_x_start": 0,
        }

        try {
            this.oldRange = {
                "model_y_end": this.plot_attributes.y_range.end,
                "model_y_start": this.plot_attributes.y_range.start,
                "model_x_end": this.plot_attributes.x_range.end,
                "model_x_start": this.plot_attributes.x_range.start,
            }

            this.default_ranges = {
                "model_y_end": Math.round(this.plot_attributes.y_range.reset_end),
                "model_y_start": Math.round(this.plot_attributes.y_range.reset_start),
                "model_x_end": Math.round(this.plot_attributes.x_range.reset_end),
                "model_x_start": Math.round(this.plot_attributes.x_range.reset_start),
            }
        } catch (e) {
        
        }
    }

    compare(model) {
        this.newRange = {
            "model_y_end": this.plot_attributes.y_range.end,
            "model_y_start": this.plot_attributes.y_range.start,
            "model_x_end": this.plot_attributes.x_range.end,
            "model_x_start": this.plot_attributes.x_range.start,
        }

        if (JSON.stringify(this.oldRange) === JSON.stringify(this.newRange)) {
            return false;
        } else {
            return true;
        }
    }

    isDefault(model) {
        this.newRange = {
            "model_y_end": Math.round(this.plot_attributes.y_range.end),
            "model_y_start": Math.round(this.plot_attributes.y_range.start),
            "model_x_end": Math.round(this.plot_attributes.x_range.end),
            "model_x_start": Math.round(this.plot_attributes.x_range.start),
        }

        if (JSON.stringify(this.newRange) === JSON.stringify(this.default_ranges)) {
            return true;
        } else {
            return false;
        }
    }

    adjust() {
        this.oldRange = this.newRange;
    }

    add() {
        this.counter++;
    }

    getCnt() {
        return this.counter;
    }
}

export default PlotRange;
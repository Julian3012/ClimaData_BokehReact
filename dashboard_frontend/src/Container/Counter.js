export class PlotRange {
    constructor(cnt, model) {
        this.counter = cnt;

        this.newRange = {
            "model_y_end": 0,
            "model_y_start": 0,
            "model_x_end": 0,
            "model_x_start": 0,
        }

        try {
            this.oldRange = {
                "model_y_end": model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.end,
                "model_y_start": model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.start,
                "model_x_end": model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.end,
                "model_x_start": model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.start,
            }

            this.default_ranges = {
                "model_y_end": Math.round(model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.reset_end),
                "model_y_start": Math.round(model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.reset_start),
                "model_x_end": Math.round(model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.reset_end),
                "model_x_start": Math.round(model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.reset_start),
            }
        } catch (e) {
            console.log(e);
        }
    }

    compare(model) {
        this.newRange = {
            "model_y_end": model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.end,
            "model_y_start": model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.start,
            "model_x_end": model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.end,
            "model_x_start": model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.start,
        }

        if (JSON.stringify(this.oldRange) === JSON.stringify(this.newRange)) {
            return false;
        } else {
            return true;
        }
    }

    isDefault(model) {
        this.newRange = {
            "model_y_end": Math.round(model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.end),
            "model_y_start": Math.round(model.attributes.children[21].attributes.children[0].attributes.children[0].y_range.start),
            "model_x_end": Math.round(model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.end),
            "model_x_start": Math.round(model.attributes.children[21].attributes.children[0].attributes.children[0].x_range.start),
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
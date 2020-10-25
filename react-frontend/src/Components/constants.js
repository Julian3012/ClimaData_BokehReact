export const meshSelect = [
    {
        value: "DOM1",
        label: "DOM1",
    },
    {
        value: "DOM2",
        label: "DOM2",
    }
]

export const funcSelect = [
    {
        value: "None",
        label: "None",
    },
    {
        value: "mean",
        label: "mean",
    },
    {
        value: "sum",
        label: "sum",
    }
]


export const cmSelect = [
    {
        value: "Blues",
        label: "Blues",
    },
    {
        value: "Inferno",
        label: "Inferno",
    },
    {
        value: "Magma",
        label: "Magma",
    },
    {
        value: "Plasma",
        label: "Plasma",
    },
    {
        value: "Viridis",
        label: "Viridis",
    },
    {
        value: "BrBG",
        label: "BrBG",
    },
    {
        value: "PiYG",
        label: "PiYG",
    },
    {
        value: "PRGn",
        label: "PRGn",
    },
    {
        value: "PuOr",
        label: "PuOr",
    },
    {
        value: "RdBu",
        label: "RdBu",
    },
    {
        value: "RdGy",
        label: "RdGy",
    },
    {
        value: "RdYlBu",
        label: "RdYlBu",
    },
    {
        value: "RdYlGn",
        label: "RdYlGn",
    },
    {
        value: "Spectral",
        label: "Spectral",
    },
    {
        value: "BuGn",
        label: "BuGn",
    },
    {
        value: "BuPu",
        label: "BuPu",
    },
    {
        value: "GnBu",
        label: "GnBu",
    },
    {
        value: "Greens",
        label: "Greens",
    },
    {
        value: "Greys",
        label: "Greys",
    },
    {
        value: "Oranges",
        label: "Oranges",
    },
    {
        value: "OrRd",
        label: "OrRd",
    },
    {
        value: "PuBu",
        label: "PuBu",
    },
    {
        value: "PuBuGn",
        label: "PuBuGn",
    },
    {
        value: "PuRd",
        label: "PuRd",
    },
    {
        value: "Purples",
        label: "Purples",
    },
    {
        value: "RdPu",
        label: "RdPu",
    },
    {
        value: "Reds",
        label: "Reds",
    },
    {
        value: "YlGn",
        label: "YlGn",
    },
    {
        value: "YlGnBu",
        label: "YlGnBu",
    },
    {
        value: "YlOrBr",
        label: "YlOrBr",
    },
    {
        value: "YlOrRd",
        label: "YlOrRd",
    },

]

// model = window.Bokeh.documents[0].get_model_by_id("1000")
// model.attributes.children
// -> [e,e,e]
// model.attributes.children[0].attributes.children
// -> [e,e] => Figures

// model.attributes.children[PLOTNUM_PARAMS].attributes.children[0].attributes.children
// -> [e, e, e, e, e, e, e, e, e, e, e, e, e, e] => Parameter

// model.attributes.children[0].attributes.children[PLOTNUM].attributes.children[1].attributes.children[1]
// -> Slider

export const POSITIONS = {
    file: 0,
    variable: 1,
    showCoastline: 2,
    colorMap: 3,
    fixColoring: 4,
    symColoring: 5,
    logzColoring: 6,
    colorLevels: 7,
    fixColMin: 8,
    fixColMax: 9,
    logx: 10,
    logy: 11,
    aggregateDim: 12,
    aggregateFun: 13,
    deletePlot: 14,
    slider: 21,
    plot: 22
}

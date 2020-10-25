# Inner workings


## Call structure
- Changes on the sidebar will call update methods on 
  the `PlotObject` itself and the `PlotGenerator`. 
    - Calling `PlotGenerator` is being done because it is
    easy to update all the plots instead of a single on. 
- Changes on the navbar will only call the update methods
  on the `PlotGenerator`. This is fine, since these settings
  should be applied to all plots.
- Changes on `AggFunction` and `colorsteps` are not directly executed.
  Only by clicking on `Apply` they are setup. But `apply` does not
  execute a separate function. It again only triggers `PlotGenerator`.
#!/bin/bash

export BOKEH_PY_LOG_LEVEL="debug"
bokeh serve --show main_old.py --port 5007

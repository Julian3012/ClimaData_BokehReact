#!/bin/bash

export BOKEH_PY_LOG_LEVEL="debug"
bokeh serve --port 5007 --show main_local.py

#!/bin/bash

export BOKEH_PY_LOG_LEVEL="debug"
bokeh serve . --show --dev **/*
# bokeh serve --show main.py

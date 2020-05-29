#!/bin/bash

# export BOKEH_PY_LOG_LEVEL="debug"
bokeh serve --port=5010 --allow-websocket-origin localhost:5010 --allow-websocket-origin localhost:3000 --allow-websocket-origin 127.0.0.1:3000 --allow-websocket-origin localhost:5000 --allow-websocket-origin 127.0.0.1:5000 main_backend.py


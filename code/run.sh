#!/usr/bin/env bash
set -e

export BOKEH_PORT=5010
export REACT_PORT=3000

conda run -n ncview2 bokeh serve \
            --port=$BOKEH_PORT \
            --allow-websocket-origin localhost:$BOKEH_PORT \
            --allow-websocket-origin localhost:$REACT_PORT \
            --allow-websocket-origin 127.0.0.1:$REACT_PORT \
            main_backend.py &

cd dashboard_frontend

conda run -n ncview2 npm start
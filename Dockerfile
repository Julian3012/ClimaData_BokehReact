FROM continuumio/miniconda3:4.8.2

ENV LANG="C.UTF-8" LC_ALL="C.UTF-8" PATH="/home/python/.poetry/bin:/home/python/.local/bin:$PATH" PIP_NO_CACHE_DIR="false"

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv curl htop \
    ca-certificates wait-for-it libpq-dev python3-dev \
    build-essential gettext-base && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/python/code
WORKDIR /home/python/code
COPY code/env_files/spec.txt .

RUN conda create --name ncview2 --file=spec.txt
COPY code/ /home/python/code

WORKDIR /home/python/code

ENV PATH /opt/conda/bin:$PATH

CMD ["conda", "run", "-n", "ncview2", "bokeh", "serve", "--port=5010", "--allow-websocket-origin", "localhost:5010", "--allow-websocket-origin", "react:3000", "--allow-websocket-origin", "localhost:3000", "--allow-websocket-origin", "127.0.0.1:3000", "main_backend.py"]

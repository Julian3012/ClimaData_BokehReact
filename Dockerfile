FROM continuumio/miniconda3:4.8.2

ENV LANG="C.UTF-8" LC_ALL="C.UTF-8" PATH="/home/python/.poetry/bin:/home/python/.local/bin:$PATH" PIP_NO_CACHE_DIR="false"

RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    python3 python3-pip python3-venv curl htop \
    ca-certificates wait-for-it libpq-dev python3-dev \
    build-essential gettext-base && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/python/code
COPY code/ /home/python/code

RUN conda create --name ncview2 --file=env_files/spec-tg.txt
# RUN conda install -p /opt/conda/envs/ncview2 -c conda-forge nodejs

WORKDIR /home/python/code/dashboard_frontend
RUN npm install
RUN npm start &

WORKDIR /home/python/code
# RUN conda run -n ncview2 /bin/bash run_bokeh.sh

CMD ["conda", "run", "-n", "ncview2", "/bin/bash", "run_react.sh"]
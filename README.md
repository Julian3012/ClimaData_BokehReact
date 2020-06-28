# praktClimaAnalyse

## install plot environment
The environment with the **old** Versions:
```
conda create --name ncview2 --file=env_files/spec-tg.txt
```
On OSX probably also install:
```
conda install python=3.7
```
After that update numpy and bokeh:
```
pip install --upgrade --force-reinstall numpy
pip install bokeh==1.0.4
```

**Info on new Bokeh version**: Until the [issue](https://github.com/holoviz/holoviews/issues/4455) in holoviews is not solved we will use the old versions.

## run Bokeh server
```
conda activate ncview2
bash run_local.sh
```

## run React app

```
cd dashboard_frontend
npm install
npm start
```

After that the react app opens on localhost:3000
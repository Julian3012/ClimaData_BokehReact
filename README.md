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
After that update numpy:
```
pip install --upgrade --force-reinstall numpy
```

**Info on new Bokeh version**: Until the [issue](https://github.com/holoviz/holoviews/issues/4455) in holoviews is not solved we will use the old versions.

## run Bokeh server
```
conda activate ncview2
bash run_bokeh.sh
```

## run React app

Make sure you installed npm before executing the command.

```
bash run_react.sh
```

After that the react app opens on localhost:3000.
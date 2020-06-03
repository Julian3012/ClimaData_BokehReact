# praktClimaAnalyse

## install
The environment with the **old** Versions:
```
conda create --name ncview2 --file=env_files/spec-tg.txt
```
On OSX probably also install:
```
conda install python=3.7
pip install --upgrade --force-reinstall numpy
pip install bokeh==1.0.4
```

The environment with the **new** Versions:
```
conda create env -f env_files/environment_newVersions.yml
```
**Warning**: Implementing the new versions is still in progress

## run
```
conda activate ncview2
bash run_local.sh
```

For the new versions comment line 176 and uncomment line 173 in main_backend.py before running the command above
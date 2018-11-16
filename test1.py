#!/usr/bin/env python
# Read data from an opendap server
import netCDF4
# specify an url, the JARKUS dataset in this case
dataset = netCDF4.Dataset("/home/max/Downloads/OS_CCE1_01_D_AQUADOPP.nc")

# lookup a variable
print(dataset.variables.keys())
print(dataset.variables['TEMP'])
print(type(dataset.variables['TEMP']))
print(dataset.variables['TEMP'].dimensions)

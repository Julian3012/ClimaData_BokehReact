#!/usr/bin/env python
# Read data from an opendap server
import netCDF4
# specify an url, the JARKUS dataset in this case
url = 'http://dtvirt5.deltares.nl:8080/thredds/dodsC/opendap/rijkswaterstaat/jarkus/profiles/transect.nc'
# create a dataset object
dataset = netCDF4.Dataset(url)

# lookup a variable
print(dataset.variables)

print(dataset)

print(len(dataset.variables))
print()

axis_map = {

}

for k,v in dataset.variables.items():
    print(k)
    axis_map[k]=k

print(axis_map)

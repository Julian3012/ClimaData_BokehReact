#!/usr/bin/env python
# Read data from an opendap server
import netCDF4
# specify an url, the JARKUS dataset in this case
url = 'http://dtvirt5.deltares.nl:8080/thredds/dodsC/opendap/rijkswaterstaat/jarkus/profiles/transect.nc'
# create a dataset object
dataset = netCDF4.Dataset(url)
 
# lookup a variable
print(dataset.variables.keys())


lonvariable = dataset.variables['lon']
latvariable = dataset.variables['lat']
altvariable = dataset.variables['altitude']
# print the first 10 values
print("printing")
for i in range(0,10):
	print(lonvariable[i],latvariable[i])

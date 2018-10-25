from django.contrib import admin

# Register your models here.
from helpers.director.data_format.json_format import json_decoder
from helpers.func.geo import poly2dict, Polygon

json_decoder.update({
    Polygon: poly2dict
})
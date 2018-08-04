from .base import *
from .logging import *

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'NAME': 'zhujiajiao',
        'USER': 'root',
        'PASSWORD': 'root533',
        'HOST': '127.0.0.1', 
        'PORT': '5432', 
    },
}

DATA_PROXY ={
    'http': 'socks5://localhost:10899',
} 


XUNCHA_HOST = "http://localhost:8001"

#SANGO_BRIDGE='http://7.207.150.71:8000'
SANGO_BRIDGE='http://12.110.185.17:8499'
#SANGO_BRIDGE='http://10.235.80.249:8000'

DEV_STATUS='dev'

GDAL_LIBRARY_PATH = r'C:\Program Files\GDAL\gdal202'
#GDAL_LIBRARY_PATH = r'C:\Program Files (x86)\GDAL\gdal202'
#GDAL_LIBRARY_PATH =r'D:\tools\release-1900-x64-gdal-2-2-3-mapserver-7-0-7\bin\gdal202'
#GDAL_DRIVER_PATH=r'D:\tools\release-1900-x64-gdal-2-2-3-mapserver-7-0-7\bin\gdal'
#GDAL_LIBRARY_PATH = 'D:\tools\release-1900-x64-gdal-2-2-3-mapserver-7-0-7\bin\gdal'
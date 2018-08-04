# encoding:utf-8
from __future__ import unicode_literals
from django.core.management.base import BaseCommand
from django.conf import settings
from case_cmp.spider.ducha import DuchaCaseSpider
from case_cmp.models import DuchaCase
import json,pickle
from case_cmp.models import JianduCase,DuchaCase
from helpers.director.db_tools import sim_dict,model_to_name


if getattr(settings,'DEV_STATUS',None)=='dev':
    import wingdbstub

class Command(BaseCommand):
    """
    检查监督员的位置，判断其是否出界
    """
    def add_arguments(self, parser):
        parser.add_argument('path', nargs='?',)
        
    def handle(self, *args, **options):
        path = options.get('path')
        
        model_list=[JianduCase,DuchaCase,]
        dc={}
        for model in model_list:
            name=model_to_name(model)
            dc[name] = dictfy_model(model)
        with open(path,'w') as f:
            pickle.dump(dc, f)
        

def dictfy_model(model):
    ls = []
    for row in model.objects.all():
        row_dc = sim_dict(row)
        row_dc.pop('id')
        ls.append(row_dc)    
    return ls
        
#def pro_point(dc):
    #for k,v in dc.items():
        #if isinstance(v,str):
            #pass


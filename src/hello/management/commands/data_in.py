# encoding:utf-8
from __future__ import unicode_literals
from django.core.management.base import BaseCommand
from django.conf import settings
from case_cmp.spider.ducha import DuchaCaseSpider
from case_cmp.models import DuchaCase
import json,pickle
from case_cmp.models import JianduCase,DuchaCase
from helpers.director.db_tools import sim_dict,model_to_name,name_to_model


if getattr(settings,'DEV_STATUS',None)=='dev':
    import wingdbstub

class Command(BaseCommand):
    """
    检查监督员的位置，判断其是否出界
    """
    def add_arguments(self, parser):
        parser.add_argument('path', nargs='+',)
        
    def handle(self, *args, **options):
        path = options.get('path')
        
        with open(path) as f:
            dc = pickle.load(f)
            for k,v in dc.items():
                model = name_to_model(k)
                undictfy_model(model,v)

        
def undictfy_model(model,ls):
    for row in ls:
        model.objects.create(**row)

            
            
            


"""zhaoxiang URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url,include
from django.contrib import admin

# from hello import views as hello_view

from django.views.generic import RedirectView 

from hello.engin_menu import PcMenu,ProgramerMenu
#from helpers.director import login_url 
from helpers.director import views as director_views
#from helpers.face import urls as face_urls
from helpers.authuser import urls as authuser_urls
from shanghai_grid.inspector.views import inspector_case
from helpers.authuser.engin_view import AuthEngine

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    #url(r'^accounts/',include(login_url)),
    #url(r'^accounts/',include(authuser_urls)),
    url(r'^accounts/([\w\.]+)/?$',AuthEngine.as_view(),name=AuthEngine.url_name),
    
    url(r'^pc/([\w\.]+)/?$',PcMenu.as_view(),name=PcMenu.url_name),
    
    url(r'^pg/([\w\.]+)/?$',ProgramerMenu.as_view(),name=ProgramerMenu.url_name),
    url(r'^pg/',RedirectView.as_view(url='/pg/kv')),
    
    #url(r'^_ajax/(?P<app>\w+)?/?$',director_views.ajax_views,name='ajax_url'),
    #url(r'^_ajax/?$',director_views.ajax_views), 
    #url(r'^_face/', include(face_urls)),
    #url(r'^_download/(?P<app>\w+)?/?$',director_views.donwload_views,name='download_url'),    
    
    url(r'^d/',include('helpers.director.urls'),name='director'),
    
    url(r'^$',RedirectView.as_view(url='/pc/inspector.inspector')),
    
    url('^inspector_case/(?P<code>\w+)/?$',inspector_case)
]


from django.conf import settings
from django.conf.urls.static import static

if settings.DEBUG:
    urlpatterns = urlpatterns + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
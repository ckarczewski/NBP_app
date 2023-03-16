from django.urls import path
from . import views 

urlpatterns = [
    path('measures', views.measures, name='measures'),
    path('currency_list', views.currency_list, name='currency_list'),
    path('session', views.session_scheduling, name='session_scheduling'),
    path('currency_comparison', views.currency_comparison, name='currency_comparison'),
]

from django.urls import path
from .views import *

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('category/<int:category_id>', get_category, name='category'),
    path('home_tree', get_home_tree, name='tree'),
    path('catget', get_category_data, name='category_data'),
    path('info/<int:column_id>/<int:parameter_id>', get_info, name='info'),
    path('mnfs/<int:mnf_id>', get_mnfs, name='mnfs'),
    path('docs/<str:tu_doc>', get_doc, name='info')
]

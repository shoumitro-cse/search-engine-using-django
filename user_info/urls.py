from django.conf.urls import url
from django.urls import path
from django.views.generic import RedirectView

from .views import SearchResultsView, homePage, keywordSearch

# from .views import HomePageView, SearchResultsView, homePage

urlpatterns = [
    path('search/', SearchResultsView.as_view(), name='search_results'),
    # path('', HomePageView.as_view(), name='home'),
    # url(r'^favicon\.ico$', RedirectView.as_view(url='/static/images/favicon.ico'))
    path('', homePage, name='home'),
    path('keyword/', keywordSearch, name='keyword'),
]

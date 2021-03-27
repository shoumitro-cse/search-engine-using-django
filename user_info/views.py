import datetime
from django.utils import timezone
import json

from django.db.models import Q, Count
from django.views.generic import TemplateView, ListView
from django.shortcuts import render, redirect

from .models import Users


# class HomePageView(TemplateView):
#     template_name = 'home.html'

def homePage(request):

    # user_list = Users.objects.values_list('id', 'name') # get tuple
    user_list = Users.objects.values('id', 'name') #get dict

    keyword_list = Users.objects.values('keywords').annotate(Count('keywords')).order_by('-keywords__count')
    # print(Users.objects.values('keywords').annotate(Count('keywords')).order_by('keywords').query)

    return render(request, 'home.html', {'user_list': user_list, 'keyword_list': keyword_list})


def keywordSearch(request):
    user_id_str = request.GET.get("id")
    keyword_str = request.GET.get("keyword")
    d_str = request.GET.get("d")
    s_str = request.GET.get("s")


    # for select date
    start_date = ""
    end_date = ""
    s_dict = []
    if s_str:
        s_dict = json.loads(s_str)
        for d in s_dict:
            if d == "start":
                start_date = s_dict[d]
            if d == "end":
                end_date = s_dict[d]

    s_user = []
    if s_str:
       s_user =Users.objects.filter(Q(start_date__gte=start_date) & Q(end_date__lte=end_date))
    select_user_set = set(s_user)

    # Between two date
    # Users.objects.filter(Q(start_date__gte='2021-03-10') & Q(end_date__lte='2021-03-25'))
    # print(Users.objects.filter(Q(start_date__gte='2021-03-10') & Q(end_date__lte='2021-03-25')).query)


    # for time range
    yesterday_bool = False
    last_week_bool = False
    last_month_bool = False
    d_dict = []
    if d_str:
        d_dict = json.loads(d_str)
        for d in d_dict:
            if d == 'y':
              yesterday_bool = d_dict[d]

            if d == 'w':
              last_week_bool = d_dict[d]

            if d == 'm':
              last_month_bool = d_dict[d]

    # print(d_dict)


    #Find now, yesterday, last_week and last month
    now = timezone.now().date()
    yesterday = now - datetime.timedelta(days=1)
    last_week = now - datetime.timedelta(days=7)
    last_month = now.replace(day=1) - datetime.timedelta(days=1)


    yesterday_user = []
    if yesterday_bool:
        yesterday_user = Users.objects.filter(Q(end_date__lte=yesterday))

    last_week_user = []
    if last_week_bool:
        last_week_user = Users.objects.filter(Q(end_date__lte=last_week))

    last_month_user=[]
    if last_month_bool:
        last_month_user = Users.objects.filter(Q(end_date__lte=last_month))

    time_range_user = set(list(yesterday_user)+list(last_week_user)+list(last_month_user));


    # for all user list
    user_id_list = []
    if user_id_str:
        user_id_list = json.loads(user_id_str)
    user_list = Users.objects.filter(id__in=user_id_list)
    # print(Users.objects.filter(id__in=[1, 2, 3]).query)


    # for all keyword list
    keyword_list=[]
    if keyword_str:
        keyword_list = json.loads(keyword_str)
    keywords_user_list = Users.objects.filter(keywords__in=keyword_list)

    # Here, join two list
    final_user_list = set(list(keywords_user_list)+list(user_list));

    # Here join those 3 list
    final_user_list = set(list(final_user_list)+list(time_range_user) + list(select_user_set))

    return render(request, 'search_results.html', {"object_list":final_user_list})




class SearchResultsView(ListView):
    model = Users
    template_name = 'search_results.html'
    
    def get_queryset(self): 
        query = self.request.GET.get('q')
        object_list = Users.objects.filter( Q(name__icontains=query) | Q(keywords__icontains=query))
        return object_list







# exercise

    #Bad
    # now = datetime.datetime.now()
    # yesterday = now - datetime.timedelta(hours=24)
    # last_week = now - datetime.timedelta(days=7)

    #Bad
    # last_week = now - datetime.timedelta(hours=24 * 7)
    # last_month = now - datetime.timedelta(hours=24 * 30)

    #Last month
    # import datetime
    # today = datetime.date.today()
    # first = today.replace(day=1)
    # lastMonth = first - datetime.timedelta(days=1)
    # print(lastMonth.strftime("%Y%m"))

    # last month shortcut
    # prev_month_date = datetime.date.today().replace(day=1) - datetime.timedelta(days=1)

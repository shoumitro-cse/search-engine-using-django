from django.contrib import admin

from .models import Users

class UsersAdmin(admin.ModelAdmin):
    list_display = ("name", "keywords", "start_date", 'end_date')
    empty_value_display = 'No Value'
    search_fields = ("name", )
    list_per_page = 10
    # list_display_links = None

    list_filter = ("name", "keywords", "start_date", "end_date")
    # list_filter = (
    #    ('name', admin.AllValuesFieldListFilter),
    # )

admin.site.register(Users, UsersAdmin)
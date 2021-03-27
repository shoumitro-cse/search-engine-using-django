from django.db import models


class Users(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    keywords = models.CharField(max_length=255)
    start_date = models.DateField()
    end_date = models.DateField()

    class Meta:
        verbose_name = "user information"
        verbose_name_plural = "user informations"
        db_table = "user_tb"
        ordering = ("id",)
        # ordering = ("id", "name")


    def __str__(self):
        return self.name
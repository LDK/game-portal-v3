from django.db import models

class Title(models.Model):
	name = models.CharField(max_length=200)
	description = models.TextField(blank=True, null=True)
	release_date = models.DateField(blank=True, null=True)
	developer = models.CharField(max_length=200, blank=True, null=True)
	publisher = models.CharField(max_length=200, blank=True, null=True)
	cover_image = models.ImageField(upload_to='title_covers/', blank=True, null=True)

	def __str__(self):
			return self.name

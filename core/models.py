# import mptt
# from django.core.files.base import ContentFile
# from django.db import models
# from mptt.models import MPTTModel, TreeForeignKey, TreeManyToManyField, TreeOneToOneField
# from multiselectfield import MultiSelectField
#
#
# # Create your models here.
#
#
# class Category(MPTTModel):
#     name = models.CharField(max_length=150, verbose_name='Название категории')
#     parent = TreeForeignKey(
#         'self',
#         null=True,
#         blank=True,
#         related_name='children',
#         verbose_name='Родительский класс',
#         on_delete=models.CASCADE
#     )
#     parameters = models.ManyToManyField('Parameters', blank=True, verbose_name='Выборочные параметры')
#     num_parameters = models.ManyToManyField('NumParameters', blank=True, verbose_name='Числовые параметры')
#
#     class Meta:
#         db_table = 'category'
#         verbose_name = 'Категория'
#         verbose_name_plural = 'Категории'
#         ordering = ('tree_id', 'level')
#
#     class MPTTMeta:
#         order_insertion_py = ['name']
#
#     def __str__(self):
#         return self.name
#
#
# mptt.register(Category, order_insertion_py=['name'])
#
#
# class Parameters(models.Model):
#     name = models.CharField(max_length=150, verbose_name="Название параметра")
#     values = models.ManyToManyField('ParameterValues', blank=True, verbose_name="Возможные значения параметров")
#
#     class Meta:
#         db_table = 'parameters'
#         verbose_name = 'Выборочной параметр'
#         verbose_name_plural = 'Выборочные параметры'
#
#     def __str__(self):
#         return self.name
#
#     def front_name(self):
#         return 's'+str(self.pk)
#
#
# class ParameterValues(models.Model):
#     name = models.CharField(max_length=150, verbose_name="Значение параметра")
#
#     class Meta:
#         db_table = 'parameter_values'
#         verbose_name = 'Значение выоборочного параметра'
#         verbose_name_plural = 'Значения выборочных параметров'
#
#     def __str__(self):
#         return self.name
#
#
# class NumParameters(models.Model):
#     name = models.CharField(max_length=150, verbose_name="Название параметра")
#     units = models.ManyToManyField('NumParameterUnits', blank=True, verbose_name="Возможные единицы измерения параметра")
#
#     class Meta:
#         db_table = 'num_parameters'
#         verbose_name = 'Числовой параметр'
#         verbose_name_plural = 'Числовые параметры'
#
#     def __str__(self):
#         return self.name
#
#     def front_name(self):
#         return 'r'+str(self.pk)
#
#
# class NumParameterUnits(models.Model):
#     name = models.CharField(max_length=150, verbose_name="Название единицы измерения параметра")
#     multiplier = models.FloatField(verbose_name="Множитель единицы измерения параметра")
#
#     class Meta:
#         db_table = 'num_parameter_values'
#         verbose_name = 'Единица измерения'
#         verbose_name_plural = 'Единицы измерения'
#
#     def __str__(self):
#         return self.name
#
#
# class ComplexParameters(models.Model):
#     name = models.CharField(max_length=150, verbose_name="Название сложного параметра")
#     # char_fields = models.ManyToManyField('CharFields', blank=True, verbose_name='Текстовые поля')
#     # num_fields = models.ManyToManyField('NumFields', blank=True, verbose_name='Числовые поля')
#     # file_fields = models.FileField()
#
#     class Meta:
#         db_table = 'complex_parameters'
#         verbose_name = 'Сложный параметр'
#         verbose_name_plural = 'Сложные параметры'
#
#     def __str__(self):
#         return self.name
#
# #
# # class CharFields(models.Model):
# #     name = models.CharField(max_length=150, verbose_name="Название поля")
# #
# #     class Meta:
# #         db_table = 'char_fields'
# #         verbose_name = 'Текстовое поле'
# #         verbose_name_plural = 'Текстовые поля'
# #
# #     def __str__(self):
# #         return self.name
# #
# #
# # class CharFieldValues(models.Model):
# #     value =
# #
#
#
# class Element(models.Model):
#     name = models.CharField(max_length=60, verbose_name='Название')
#     category = TreeForeignKey('Category', blank=True, null=True, related_name='cat', on_delete=models.CASCADE, verbose_name='Категория')
#
#     class Meta:
#         db_table = 'element'
#         verbose_name = 'Элемент'
#         verbose_name_plural = 'Элементы'
#
#     def __str__(self):
#         return self.name
#
#
# class ElementValue(models.Model):
#     element = models.ForeignKey('Element', on_delete=models.CASCADE, verbose_name='Элемент')
#     param = models.ForeignKey('Parameters', on_delete=models.CASCADE, verbose_name='Наименование выборочного параметра', null=True, blank=True)
#     param_value = models.ForeignKey('ParameterValues', on_delete=models.CASCADE, verbose_name='Номер выборочного параметра', null=True, blank=True)
#     num_param = models.ForeignKey('NumParameters', on_delete=models.CASCADE, verbose_name='Наименование числового параметра', null=True, blank=True)
#     num_param_value = models.FloatField(verbose_name='Значение числового параметра', null=True, blank=True)
#     # com_name = models.ForeignKey('ComplexParameters', on_delete=models.CASCADE, verbose_name='Наименование сложного параметра', null=True, blank=True))
#     # com_value = models.ForeignKey()
#
#     class Meta:
#         db_table = 'element_value'
#         verbose_name = 'Значение элемента'
#         verbose_name_plural = 'Значения элементов'
#
#     def __str__(self):
#         return str(self.element.name)
#
#
# class FullElements(models.Model):
#     element_name = models.CharField(max_length=60)
#     element_manufacturer = models.CharField(max_length=60)
#     element_power = models.IntegerField()
#
#     class Meta:
#         db_table = 'full_elements'

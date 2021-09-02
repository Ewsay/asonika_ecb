import os
import requests
import json
from random import randint, random
from urllib.parse import unquote

from django.db.models import Q
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.generic import TemplateView, ListView
from django.views.decorators.csrf import csrf_exempt
from .models import *

from decimal import Decimal
# Create your views here.

class HomePageView(TemplateView):

    def get(self, request, *args, **kwargs):
        template_name = 'core/home_for_video.html'
        return render(
            request,
            template_name
        )


def get_home_tree(request):
    r = requests.get('http://localhost:5000/api/ekb/categories', data=request.GET, verify=False)
    data = r.json()
    return JsonResponse(data, safe=False, json_dumps_params={'ensure_ascii': False})


from django.urls import resolve


# обработчик для моего запроса элементов категории из js
def get_category_data(request):
    arr = request.META["HTTP_REFERER"].split("?")
    if len(arr) == 2:
        query_str = unquote(request.META["HTTP_REFERER"].split("?")[1], encoding='utf-8')
    else:
        query_str = ''

    print('query_str: ', query_str)
    # print(request.META["HTTP_REFERER"].split("?")[1].replace("%3A", ":").replace("%2C", " "))
    # print(unquote(request.META["HTTP_REFERER"].split("?")[1], encoding='utf-8'))
    cat_id = int(request.META['HTTP_REFERER'].split('?')[0].split('/')[-1])

    headers = {'Content-Type': 'application/json'}
    ## без headers при выборе (например) в 14 категории любых двух производителей
    ## (например http://127.0.0.1:8000/category/14?validMnf=42&validMnf=19)
    ## первый производитель становился неактивным, хотя в API всё отображалось правильно
    ## После вызова requests.get в переменной 'r' был объект, у которого параметр
    ## 'en' был равен 'false' для первого производителя, хотя при прямом запросе
    ## в API все верно отображалось

    if query_str == '':
        r = requests.get(f'http://localhost:5000/api/ekb/Filter?categoryId={cat_id}', data=request.GET, verify=False)
        data = r.json()
        return JsonResponse(json.loads(get_elements_from_json(data)), safe=False,
                            json_dumps_params={'ensure_ascii': False})
    else:
        r = requests.get(f'http://localhost:5000/api/ekb/Filter?categoryId={cat_id}&{query_str}', data=request.GET, verify=False, headers=headers)
        data = r.json()

        r2 = requests.get(f'http://localhost:5000/api/ekb/Filter?categoryId={cat_id}', data=request.GET, verify=False)
        data2 = r2.json()

        return JsonResponse(
            [json.loads(get_elements_from_json(data))[0], get_parameters_from_json(data)["html"]],
            safe=False,
            json_dumps_params={'ensure_ascii': False}
        )



def get_category(request, category_id):
    os.chdir(os.path.dirname(__file__))
    os.chdir('../static')

    # category = Category.objects.get(id=category_id)
    # category_name = category.name
    # bread_crumbs = category.get_ancestors(include_self=True)
    # branch_categories = category.get_descendants(include_self=True)
    # elements = Element.objects.filter(category_id__in=branch_categories)
    # category_parameters = sorted(list(set(get_categories_parameters(bread_crumbs))))
    # html_parameters = get_html_parameters(bread_crumbs)
    # full_elements = get_full_elements(elements, category_parameters, bread_crumbs)

    # file_path = f'Мои {category_name}.txt'
    # with open(file_path, 'w') as f:
    #     f.write(str(full_elements))
    #
    # create_js(category_parameters, html_parameters, category_name, FILENAME=f'Мои {category_name}.txt')
    # # create_js(category_parameters, html_parameters, category_name, FILENAME=f'{category_name}.txt')
    # # create_data(category_parameters, html_parameters, category_name, N=10000)
    # return HttpResponse(create_html(category_parameters, html_parameters, category_name))

    # тренировка get
    r = requests.get(f'http://localhost:5000/api/ekb/Filter?categoryId={category_id}', data=request.GET, verify=False)
    data = r.json()
    # get_category_data(request, category_id)
    # with open("JSON_example", 'r', encoding="utf-8") as rf:
    #     data = rf.read()
    # data = json.loads(data)
    cat_tree = requests.get(f'http://localhost:5000/api/ekb/categories', data=request.GET, verify=False).json()

    breadcrumbs = []

    def bread_rec(categ, cat_id):
        if categ['Id'] == cat_id:
            breadcrumbs.append([categ['Name'], categ['Id']])
            return breadcrumbs
        else:
            if not categ['Children']:
                return None
            else:
                breadcrumbs.append([categ['Name'], categ['Id']])
                for child in categ['Children']:
                    res = bread_rec(child, cat_id)
                    if res is not None:
                        return res
                breadcrumbs.pop()
                return None

    for cat in cat_tree:
        breadcrumbs = bread_rec(cat, category_id)
        if breadcrumbs:
            break
        else:
            breadcrumbs = []

    # Закомментил это, потому что в случае с категорией 679 не получается
    # в текстовый файл записать символ "½"
    # with open("JSON_data.txt", 'w') as f:
    #     f.write(str(get_parameters_from_json(data)["codes"]) + "\n")
    #     f.write(str(get_parameters_from_json(data)["sizes"]) + "\n")
    #     f.write(str(get_parameters_from_json(data)["fullnames"]) + "\n")
    #     f.write(str(get_parameters_from_json(data)["html"]) + "\n")
    #     f.write(str(get_elements_from_json(data)))


    return HttpResponse(create_html(
        get_parameters_from_json(data)["codes"],
        get_parameters_from_json(data)["html"],
        get_parameters_from_json(data)["sizes"],
        get_parameters_from_json(data)["fullnames"],
        breadcrumbs
    ))


def get_parameters_from_json(data):
    cat_params = ["actual", "mopstatus", "validTu", "validMnf", "popularity"]
    sizes = ['150']
    sizes = sizes + ["150" for _ in range(4)]
    fullnames = ['Перспективность', 'Статус элемента', 'Техническое условие', 'Производитель', 'Применяемость', 'Наличие на складе',
                 'Сроки поставки', 'Стоимость поставки']
    html_params = {
        "actual": {
            "Short": "Перспективность",
            "Name": "Перспективность",
            "Selective": "true",
            "Values":  [['Да', 'true', str(data["ekbfiltrstatus"]["enactyes"]).lower()],
                        ['Нет', 'false', str(data["ekbfiltrstatus"]["enactno"]).lower()]]
        },
        "mopstatus": {
            "Short": "Статус",
            "Name": "Статус элемента",
            "Selective": "true",
            "Values": [['Включен в МОП', '0', str(data["ekbfiltrstatus"]["enok"]).lower()],
                       ['Не производится', '1', str(data["ekbfiltrstatus"]["ennotproduced"]).lower()],
                       ['Производится в СНГ', '2', str(data["ekbfiltrstatus"]["ennotdomestic"]).lower()],
                       ['Исключён из МОП ', '3', str(data["ekbfiltrstatus"]["enexcommunicate"]).lower()]]
        },
        "validTu": {
            "Short": "ТУ",
            "Name": "Техническое условие",
            "Selective": "true",
            "Values": [[tu["item"]["Name"], str(tu["item"]["Id"]), str(tu["en"]).lower()] for tu in data["tus"]]
        },
        "validMnf": {
            "Short": "Производитель",
            "Name": "Производитель",
            "Selective": "true",
            "Values": [[mnf["item"]["Name"], str(mnf["item"]["Id"]), str(mnf["en"]).lower()] for mnf in data["mnfs"]]
        },
        "popularity": {
            "Short": "Применяемость",
            "Name": "Применяемость в изделиях",
            "Selective": "false",
            "Min": data["ekbfiltruse"]["min"],
            "Max": data["ekbfiltruse"]["max"],
            "Enabled": str(data["ekbfiltruse"]["available"]).lower()
        }
    }

    for column in data["columns"]:
        if "Selective" in column["item"]["$type"]:
            param_code = "i" + str(column["item"]["Id"])
            cat_params.append(param_code)
            sizes.append("150")
            fullnames.append(column["item"]["Name"])
            html_params[param_code] = {
                "Short": column["item"]["Short"],
                "Name": column["item"]["Name"],
                "Selective": "true",
                "Values": [[val["item"]["Name"], str(val["item"]["Id"]),
                            str(val["en"]).lower()] for val in column["item"]["Values"]]
            }
        else:
            param_code = "r" + str(column["item"]["Id"])
            for ekb in data["ekbs"]:
                for column_id in ekb["ParVals"].keys():
                    if str(column["item"]["Id"]) == column_id:
                        for possible_val in ekb["ParVals"][column_id]:
                            if "r_val" in possible_val["$type"]:
                                param_code = "o" + str(column["item"]["Id"])
            cat_params.append(param_code)
            sizes.append("110")
            fullnames.append(column["item"]["Name"] + f", [{get_default_unit(column)}]")
            short_name = column["item"]["Short"] + f" [{get_default_unit(column)}]"
            full_name = column["item"]["Name"] + f" [{get_default_unit(column)}]"
            html_params[param_code] = {
                "Short": short_name,
                "Name": full_name,
                "Selective": "false",
                "Min": column["item"]["MinVal"],
                "Max": column["item"]["MaxVal"],
                "Enabled": str(column["en"]).lower(),
                "Units": column["item"]["Units"],
                "DefaultMultiplier": column["item"]["DefaultMultiplier"]
            }

            # преобразовываем значения ture и false в строковые
            for units in html_params[param_code]["Units"]:
                if "MinIsIncluded" in units:
                    if units["MinIsIncluded"] == True:
                        units["MinIsIncluded"] = "true"
                    elif units["MinIsIncluded"] == False:
                        units["MinIsIncluded"] = "false"
                if "MaxIsIncluded" in units:
                    if units["MaxIsIncluded"] == True:
                        units["MaxIsIncluded"] = "true"
                    elif units["MaxIsIncluded"] == False:
                        units["MaxIsIncluded"] = "false"

            # for unit in column["item"]["Units"]:
            #     html_params[param_code]["Units"][unit["Name"]] = unit["Multiplier"]

    html_params.update(piecesInStock={
        "Short": "Наличие",
        "Name": "Наличие на складе",
        "Selective": "false",
        "Min": data["ekbfiltrpriceanddelivery"]["priceinstock_min"],
        "Max": data["ekbfiltrpriceanddelivery"]["priceinstock_max"],
        "Enabled": str(data["ekbfiltrpriceanddelivery"]["priceinstock_available"]).lower()
    }, deliveryTime={
        "Short": "Сроки поставки",
        "Name": "Сроки поставки",
        "Selective": "false",
        "Min": data["ekbfiltrpriceanddelivery"]["deliverytime_min"],
        "Max": data["ekbfiltrpriceanddelivery"]["deliverytime_max"],
        "Enabled": str(data["ekbfiltrpriceanddelivery"]["delivery_available"]).lower()
    }, deliveryPrice={
        "Short": "Стоимость поставки",
        "Name": "Стоимость поставки",
        "Selective": "false",
        "Min": data["ekbfiltrpriceanddelivery"]["deliveryprice_min"],
        "Max": data["ekbfiltrpriceanddelivery"]["deliveryprice_max"],
        "Enabled": str(data["ekbfiltrpriceanddelivery"]["delivery_available"]).lower()
    })
    #print('\nTHIS ARE HTML PARAMETERS FOR DATA:\n', data)
    #print('\nHTML_PARAMETERS:\n', html_params)
    # Тоже должны добавить Наличие на складе и поставку в конец
    cat_params += ["piecesInStock", "deliveryTime",
                  "deliveryPrice"]
    sizes += ['180']
    # print('HTML PARAMS:\n', html_params)
    return {
        "codes": cat_params,
        "fullnames": fullnames,
        "sizes": sizes,
        "html": html_params
    }


def get_default_unit(column):
    for unit in column["item"]["Units"]:
        if unit["Multiplier"] == column["item"]["DefaultMultiplier"]:
            return unit["Name"]
    return ""


def get_elements_from_json(data):
    elems = []
    for ekb in data["ekbs"]:
        elem = []

        elem.append([[str(ekb["Status"]["Actual"]), ekb["Status"]["MopStatus"]]])

        elem.append([[ekb["Name"]]])

        tu_id_list = ekb["TuIdList"]
        tu_arr = []  # отдельный массив для сборки всех ТУ конкретного элемента
        for tu_id in tu_id_list:
            if tu_id in [tu["item"]["Id"] for tu in data["tus"]]:
                for tu in data["tus"]:
                    if tu["item"]["Id"] == tu_id:
                        tu_arr.append([tu["item"]["Name"], tu["item"]["DocLink"]])
            else:
                tu_arr.append(["-", ''])
        elem.append(tu_arr)
        mnf_id = ekb["MnfId"]

        if mnf_id in [mnf["item"]["Id"] for mnf in data["mnfs"]]:
            for mnf in data["mnfs"]:
                if mnf["item"]["Id"] == mnf_id:
                    elem.append([[mnf["item"]["Name"]]])
        else:
            elem.append([["-"]])
        if ekb["Popularity"]["UsedInProducts"] != 0:
            elem.append([["В " + str(ekb["Popularity"]["UsedInProducts"]) + "изделии(-ях)"]])
        else:
            elem.append([["Не применяется"]])
        for column in data["columns"]:
            elem_column = []
            column_id = str(column["item"]["Id"])
            if column_id in ekb["ParVals"].keys():
                for possible_val in ekb["ParVals"][column_id]:
                    if "item_val" in possible_val["$type"]:
                        val_id = possible_val["Val"]["Id"]
                        for val in column["item"]["Values"]:
                            if val["item"]["Id"] == val_id:
                                elem_column.append([val["item"]["Name"]])
                    elif "r_val" in possible_val["$type"]:
                        #print('\n\npossible_val["MinVal"]: ', possible_val["MinVal"])
                        #print('possible_val["MaxVal"]: ', possible_val["MaxVal"])
                        min_val = in_right_unit(possible_val["MinVal"], column["item"])
                        max_val = in_right_unit(possible_val["MaxVal"], column["item"])
                        #print('\n\nmin_val: ', min_val)
                        #print('max_val: ', max_val)
                        elem_column.append([f"{min_val} — {max_val}"])
                    elif "o_val" in possible_val["$type"]:
                        val = in_right_unit(possible_val["Val"], column["item"])
                        elem_column.append([f"{val}"])
            else:
                elem_column.append(["-"])
            elem.append(elem_column)

        # Этот столбец перенесли в самый конец
        availability = []
        if ekb["Availability"]["PiecesInStock"] == 0:
            availability.append(["Склад: нет в наличии"])
        else:
            availability.append([f"Склад: {ekb['Availability']['PiecesInStock']} шт."])
        if ekb["Availability"]["DeliveryTime"] is None:
            availability.append(["-"])
        else:
            availability.append([f"Сроки поставки: {ekb['Availability']['DeliveryTime']} дня(дней)"])
        if ekb["Availability"]["DeliveryPrice"] is None:
            availability.append(["-"])
        else:
            availability.append([f"Стоимость поставки: {ekb['Availability']['DeliveryPrice']} руб."])
        elem.append(availability)


        elems.append(elem)
    res = [elems, get_parameters_from_json(data)["html"]]
    return str(res).replace("'", "\"")
    # return elems


def in_right_unit(num, column):
    # num = ((float(num)) ** 2) ** (1 / 2)  # ?
    num = -1 * ((float(num)) ** 2) ** (1 / 2) if float(num) < 0 else ((float(num)) ** 2) ** (1 / 2)
    # перепеписал первую закоменченную строку с учетом знака

    num = Decimal(str(num)) / Decimal('1.0')  # из -60.0 делает -60
    for unit in column["Units"]:
        min_val = unit["MinValue"] if unit["MinIsIncluded"] else unit["MinValue"] + 1e-10
        max_val = unit["MaxValue"] if (unit["MaxIsIncluded"] or unit["MaxValue"] == 'Infinity') else unit[
                                                                                                         "MaxValue"] - 1e-10
        max_val = 1e+15 if max_val == "Infinity" else max_val
        if min_val <= num <= max_val:
            # num = num / unit["Multiplier"]
            num = '{:f}'.format(Decimal(str(num)) / Decimal(str(unit["Multiplier"])))
            if unit["Multiplier"] != column["DefaultMultiplier"]:
                return f"{num} {unit['Name']}".strip(" ")
            return f"{num}"
    return f"{num}"


# def get_categories_parameters(categories):
#     """сумма всех параметров данных категорий"""
#     element_attrs = []
#     for cat in categories:
#         element_attrs += [par.front_name() for par in cat.parameters.all()]
#         element_attrs += [par.front_name() for par in cat.num_parameters.all()]
#     return element_attrs
#
#
# def get_html_parameters(categories):
#     html_parameters = {}
#     for cat in categories:
#         for par in cat.parameters.all():
#             html_parameters[par.front_name()] = {par.name: [i.name for i in par.values.all()]}
#         for par in cat.num_parameters.all():
#             html_parameters[par.front_name()] = {par.name: get_units(par)}
#     return html_parameters
#
#
# def get_units(parameter):
#     units = {}
#     for unit in parameter.units.all():
#         units[unit.name] = unit.multiplier
#     return units
#
#
# def get_full_elements(elements, category_parameters, bread_crumbs):
#     full_elements = []
#     for elem in elements:
#         category = elem.category
#         full_element = [
#             '"name"' + f':"{elem.name.encode("utf-8").decode("cp1251")}"'
#         ]
#
#         parameters = category.parameters.all()
#         num_parameters = category.num_parameters.all()
#         for i in bread_crumbs:
#             parameters = parameters.union(i.parameters.all())
#             num_parameters = num_parameters.union(i.num_parameters.all())
#
#         for i in parameters:
#             element_value = ElementValue.objects.filter(element=elem, param=i)
#             if len(element_value) != 0 and i.front_name() in category_parameters:
#                 full_element.append(
#                     f'"{i.front_name()}"' + f':"{element_value[0].param_value.name.encode("utf-8").decode("cp1251")}"')
#         for i in num_parameters:
#             element_value = ElementValue.objects.filter(element=elem, num_param=i)
#             if len(element_value) != 0 and i.front_name() in category_parameters:
#                 full_element.append(f'"{i.front_name()}"' + f':"{str(element_value[0].num_param_value)}"')
#         full_element = '{' + ', '.join(full_element) + '}'
#         full_elements.append(full_element)
#     return '[' + ', '.join(full_elements) + ']'


def create_html(parameters, html_parameters, columns_width, fullnames, breadcrumbs):
    short_names = []
    full_names = []
    # print(html_parameters)
    for vals in html_parameters.values():
        if vals.get("Short") is not None:
            short_names.append(vals["Short"])
        else:
            short_names.append(vals["Name"])
        full_names.append(vals["Name"])
    # print('\ncat_params:', parameters)
    # parameters = list(html_parameters.keys())
    # print('\nparameters:', parameters)
    # print('\n\nHTML_PARAMETERS:\n', html_parameters)
    html_text = ''
    html_text += f'''
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="../../static/js/jquery-3.5.1.min.js"></script>
        <script src="../../static/js/ajax.js"></script>
        <script src="../../static/js/script.js"></script>
        <title>Проект АСОНИКА-К ЭКБ | {breadcrumbs[-1][0]}</title>
        <link rel="stylesheet" href="../../static/css/styles.css">
      </head>

      <body>
        <header>
          <div id="up_header">
            <div class="center_wrap">
              <div id="logo">
                <a href="http://asonika-k.ru/">
                  <img src="/static/templates/asktemplate/images/logo.png" alt="">
                </a>
              </div>
            </div>  <!---->
          </div>

          <div id="down_header">
              <div class="center_wrap">
                <div id="navigator">

                  <ul itemscope="" itemtype="https://schema.org/BreadcrumbList" class="breadcrumb">
                      <li class="active">
                      <span class="divider icon-location"></span>
                      </li>

                      <li itemprop="itemListElement" itemscope="" itemtype="https://schema.org/ListItem" class="active">
                        <a itemprop="item" href="/" class="pathway">
                          <span itemprop="name">Перечень ЭКБ</span></a>
                          <span class="divider"><img src="/static/templates/asktemplate/images/arrow.png" alt=""></span>
                        <meta itemprop="position" content="1">
                      </li>
    '''

    for i in range(len(breadcrumbs)):
        if i != len(breadcrumbs) - 1:
            html_text += f'''<li itemprop="itemListElement" itemscope="" itemtype="https://schema.org/ListItem" class="active">
                        <a itemprop="item" href="/category/{breadcrumbs[i][1]}" class="pathway">
                          <span itemprop="name">{breadcrumbs[i][0]}</span></a>
                          <span class="divider"><img src="/static/templates/asktemplate/images/arrow.png" alt=""></span>
                        <meta itemprop="position" content="{i+2}">
                      </li>'''
        else:
            html_text += f'''
                              <li itemprop="itemListElement" itemscope="" itemtype="https://schema.org/ListItem" class="active">
                                <span itemprop="name">
                                  {breadcrumbs[i][0]}</span>
                                <meta itemprop="position" content="1">
                              </li>
                            '''

    html_text += '''
                  </ul>
                </div>
            </div>
          </div>
        </header>



        <div class="back_to_top">
          <img draggable="false" src="/static/images/red.svg" alt="" width="26">
          <a>Наверх</a>
        </div>


        <div id="warn_inp">
          Это значение должно быть больше, чем значение в верхнем поле
        </div>


        <div id="show_box">
          <div id="arr_show">
          </div>
          <button id="show_button">Применить</button>
          <div id="show_box_close">
          </div>
        </div>




        <div class=main_content>
          <div id="inf_and_search">
            <div id="reset_box">
              <button id="reset_button" type="submit">Сбросить все фильтры</button>
            </div>

            <div id=number_of_displayed_elements></div>

            <div id="search_tab">
                <form id="search_form">
                  <input name="sq" id="element_search_bar" type="text" placeholder="Поиск по названию">
                  <span></span>
                  <button id="element_search" type="submit" title="Начать поиск элементов">Найти</button>

                </form>
            </div>
          </div>


          <div>
            <div class="filters_and_elements">

              <div id="filters">
              <form id="filterform" method="get">
    '''

    for i in range(len(parameters)):
        html_text += '\n\n\t<div class="filter filter_opened'
        html_text += f'">\n\t\t<div class="dropdown_header" title="{full_names[i]}">'
        html_text += short_names[i] + '</div>\n'
        html_text += '\t\t<div id="filter_' + parameters[i] + '" class="filter_select">\n'
        if parameters[i][:1] == "r" or parameters[i][:1] == "o" or parameters[i] in ['piecesInStock', 'deliveryTime',
                                                                                     'deliveryPrice', 'popularity']:
            unit = list(html_parameters[parameters[i]].keys())[0].split(', ')[-1]
            html_text += ''
            if html_parameters[parameters[i]]["Enabled"] == "false":
                html_text += f'\t\t<div>\n\t\t\t<div class="from">\n\t\t\t\t \
                <input id="{parameters[i]}_min" name="{parameters[i]}_min" class="min num_inp" \
                type="text" maxlength="10" disabled><label class="range_label">от</label> \
                \n\t\t\t</div>\n\n\t\t\t <div class="to">\n\t\t\t\t \
                <input id="{parameters[i]}_max" name="{parameters[i]}_max" class="max num_inp" \
                type="text" maxlength="10" disabled><label class="range_label">до</label>\n\t\t\t \
                </div>\n\t\t</div>'

                if parameters[i][:1] == "o":
                    html_text += f'<label class="filt_label"><input type="checkbox" class="incl_inp"'
                    html_text += 'id="{parameters[i]}" value="1" disabled>'
                    html_text += '<span>Значение параметра должно содержать введенный интервал</span></label>'
            else:
                html_text += f'\t\t<div>\n\t\t\t<div class="from">\n\t\t\t\t \
                                <input id="{parameters[i]}_min" name="{parameters[i]}_min" class="min num_inp" \
                                type="text" maxlength="10" placeholder="{in_right_unit(html_parameters[parameters[i]]["Min"], html_parameters[parameters[i]])}"><label class="range_label">от</label> \
                                \n\t\t\t</div>\n\n\t\t\t <div class="to">\n\t\t\t\t \
                                <input id="{parameters[i]}_max" name="{parameters[i]}_max" class="max num_inp" \
                                type="text" maxlength="10" placeholder="{in_right_unit(html_parameters[parameters[i]]["Max"], html_parameters[parameters[i]])}"><label class="range_label">до</label>\n\t\t\t</div>\n\t\t</div>'
                if parameters[i][:1] == "o":
                    html_text += f'<label class="filt_label"><input type="checkbox" class="incl_inp"'
                    html_text += 'id="{parameters[i]}" value="1">'
                    html_text += '<span>Значение параметра должно содержать введенный интервал</span></label>'
                html_text += '''\n\t\t\t<button type="button">Сбросить</button>
        \n\t\t\t<div class="warn_box">
        \t\t\t\tЭто значение должно быть больше, чем значение в верхнем поле\n\t\t\t</div>'''
        else:
            if short_names[i] == 'Перспективность':
                html_text += '\t\t\t<ul>\n'
                for par_vals in html_parameters[parameters[i]]["Values"]:
                    html_text += '\t\t\t<li><label class="filt_label"><input type="radio"'
                    html_text += f' class="inp_label" name={parameters[i]} value="{par_vals[1]}"'
                    if par_vals[2] == 'false':
                        html_text += 'disabled'
                    html_text += '><span>'
                    html_text += par_vals[0] + '</span></label></li>\n'
                html_text += '\t\t\t<li><label class="filt_label"><input type="radio"'
                html_text += f' class="inp_label" name="actual" value="none" checked><span>'
                html_text += 'Не важно</span></label></li>\n'
                html_text += '\t\t\t</ul>'
            else:
                html_text += '\t\t\t<ul>\n'
                for par_vals in html_parameters[parameters[i]]["Values"]:
                    html_text += '\t\t\t<li><label class="filt_label"><input type="checkbox"'
                    html_text += f' class="inp_label" name={parameters[i]} value="{par_vals[1]}"'
                    if par_vals[2] == 'false':
                        html_text += 'disabled'
                    html_text += '><span>'
                    html_text += par_vals[0] + '</span></label></li>\n'
                html_text += '\t\t\t</ul>'
        html_text += '\n\t\t</div>\n\t</div>'

    # colgroup = '<colgroup>'
    #
    # for i in columns_width:
    #     if i != '':
    #         colgroup += f'<col width="{float(i)}">'
    #
    # colgroup += '</colgroup>'

    html_text += f'''
                    </form>
                    <div id="stat_show_box">
                  <button form="filterform" id="stat_show_button">Применить</button>
                </div>
              </div> <!-- End of filters div -->  



              <div id="div_table">
                <div id="sticky_div">
                  <table id="sticky_table">
                    <thead>
                    <tr>

    '''

    ignored_cols = ['Статус', 'Сроки поставки', 'Стоимость поставки', 'Перспективность']

    tbody = ''
    tbody += f'\n\t\t\t<th width="{columns_width[0]}" title="Название"><span>Название</span></th>'
    for i in range(len(parameters)):
        col_shortname = html_parameters[parameters[i]]["Short"]
        if col_shortname == 'Наличие':
            col_shortname = 'Наличие, сроки и стоимость поставки'
            tbody += f'\n\t\t\t<th width="{columns_width[i]}" title="Наличие на складе,\nсроки и стоимость поставки">'
            tbody += '<span>' + col_shortname + '</span></th>'
            continue
        elif col_shortname in ignored_cols:
            continue
        tbody += f'\n\t\t\t<th width="{columns_width[i]}" title="{html_parameters[parameters[i]]["Name"]}">'
        tbody += '<span>' + col_shortname + '</span></th>'
    html_text += tbody

    html_text += f'''
                    </tr>
                    </thead>
                  </table>
                </div>
                <table id="table_elements">

                  <thead>
                  <tr>
    '''

    html_text += tbody

    html_text += '''
                  </tr>
                  </thead>
                  <tbody id="table_body">
                  </tbody>
                </table>
                <div id="load_items">Загрузить элементы</div>
              </div>

            </div> <!-- End of filters_and_elements div -->  

          </div>
        </div> <!-- End of main_content duv -->

      </body>
    </html>
    '''

    # with open('core/home.html', 'w+', encoding='utf-8') as fin:
    #     fin.write(html_text)
    return html_text
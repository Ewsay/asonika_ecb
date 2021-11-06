"use strict";

var cachedData;

var currentPage = 0;

const char_width = {
	'0': 8.16576, " ": 0, " ": 4.07609, '1': 8.16576, '2': 8.16576, '3': 8.16576, '4': 8.16576, '5': 8.16576, '6': 8.16576, '7': 8.16576, '8': 8.16576, '9': 8.16576, "!": 4.07609, '"': 5.21739, '#': 8.16576, '$': 8.16576, '%': 13.0435, '&': 9.78261, "'": 2.8125, '(': 4.8913, ')': 4.8913, '*': 5.70652, '+': 8.57337, ',': 4.07609, '-': 4.8913, '.': 4.07609, '/': 4.07609, ':': 4.07609, ';': 4.07609, '<': 8.57337, '=': 8.57337, '>': 8.57337, '?': 8.16576, '@': 14.8913, 'A': 9.78261, 'B': 9.78261, 'C': 10.5978, 'D': 10.5978, 'E': 9.78261, 'F': 8.96739, 'G': 11.413, 'H': 10.5978, 'I': 4.07609, 'J': 7.33696, 'K': 9.78261, 'L': 8.16576, 'M': 12.2147, 'N': 10.5978, 'O': 11.413, 'P': 9.78261, 'Q': 11.413, 'R': 10.5978, 'S': 9.78261, 'T': 8.96739, 'U': 10.5978, 'V': 9.78261, 'W': 13.8451, 'X': 9.78261, 'Y': 9.78261, 'Z': 8.96739, '[': 4.07609, "\\": 4.07609, ']': 4.07609, '^': 6.88859, '`': 4.8913, 'a': 8.16576, 'b': 8.16576, 'c': 7.33696, 'd': 8.16576, 'e': 8.16576, 'f': 4.07609, 'g': 8.16576, 'h': 8.16576, 'i': 3.26087, 'j': 3.26087, 'k': 7.33696, 'l': 3.26087, 'm': 12.2147, 'n': 8.16576, 'o': 8.16576, 'p': 8.16576, 'q': 8.16576, 'r': 4.8913, 's': 7.33696, 't': 4.07609, 'u': 8.16576, 'v': 7.33696, 'w': 10.5978, 'x': 7.33696, 'y': 7.33696, 'z': 7.33696, '{': 4.90489, '|': 3.81793, '}': 4.90489, '~': 8.57337, '': 7.82609, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '': 11.0054, '¡': 4.8913, '¢': 8.16576, '£': 8.16576, '¤': 8.16576, '¥': 8.16576, '¦': 3.81793, '§': 8.16576, '¨': 4.8913, '©': 10.8152, 'ª': 5.43478, '«': 8.16576, '¬': 8.57337, '®': 10.8152, '¯': 8.09783, '°': 5.86957, '±': 8.05707, '²': 4.8913, '³': 4.8913, '´': 4.8913, 'µ': 8.45109, '¶': 7.88043, '·': 4.8913, '¸': 4.8913, '¹': 4.8913, 'º': 5.36685, '»': 8.16576, '¼': 12.2283, '½': 12.2283, '¾': 12.2283, 'А': 9.78261, 'Б': 9.63315, 'В': 9.78261, 'Г': 7.94837, 'Д': 9.93207, 'Е': 9.78261, 'Ж': 13.5462, 'З': 8.8587, 'И': 10.5435, 'Й': 10.5435, 'К': 8.5462, 'Л': 9.63315, 'М': 12.2147, 'Н': 10.5978, 'О': 11.413, 'П': 10.5435, 'Р': 9.78261, 'С': 10.5978, 'Т': 8.96739, 'У': 9.32065, 'Ф': 11.1549, 'Х': 9.78261, 'Ц': 10.856, 'Ч': 9.78261, 'Ш': 13.4375, 'Щ': 13.75, 'Ъ': 11.6168, 'Ы': 12.9891, 'Ь': 9.63315, 'Э': 10.5435, 'Ю': 14.8234, 'Я': 10.5978, 'а': 8.16576, 'б': 8.41033, 'в': 7.79891, 'г': 5.35326, 'д': 8.55978, 'е': 8.16576, 'ж': 9.80978, 'з': 6.72554, 'и': 8.19293, 'й': 8.19293, 'к': 6.42663, 'л': 8.55978, 'м': 10.0815, 'н': 8.09783, 'о': 8.16576, 'п': 7.94837, 'р': 8.16576, 'с': 7.33696, 'т': 6.72554, 'у': 7.33696, 'ф': 12.0652, 'х': 7.33696, 'ц': 8.41033, 'ч': 7.64946, 'ш': 11.7663, 'щ': 12.0652, 'ъ': 9.1712, 'ы': 10.5435, 'ь': 7.64946, 'э': 7.48641, 'ю': 11.0054, 'я': 7.94837, '_': 8.16576
}


var countClicked = 0;
var countFiltered = 0;
var searchClicked = false;
var checked = [];

// каждый раз при загрузке категории ее определяем
// потому что нужен доступ к ней из многих функции
var html_parameters;



// создает анимацию загрузки во время применения фильтров
const filterPreloader = function() {
	let load_preloader = $('<div></div>');
	load_preloader.addClass('load_preloader');
	load_preloader.insertBefore($('.main_content'));
}

const retrievePageFromURL = function(){
	let str = window.location.href;
	let lastInd = str.lastIndexOf('#');
	if (lastInd != -1){
		let pathStr = str.substring(lastInd);
		let pageNumb = parseInt(pathStr.substring(pathStr.indexOf('-') + 1));
		return pageNumb;
	}
	else{
		return 1;
	}
}

// создает и возвращает строку URL с выбранными фильтрами
const composeURL = function() {
	let getText = '';	
	let filters = $(".filter_select");

	for (let i = 0; i < filters.length; i++) {
		let checkedBoxes = filters[i].querySelectorAll('.inp_label:checked');
		if (checkedBoxes != undefined && checkedBoxes.length != 0) {
			if (checkedBoxes[0].getAttribute("type") == "radio") {
				if (checkedBoxes[0].value != "none") {
					getText += filters[i].id.split('_')[1] + '=';
					getText += checkedBoxes[0].value;

					if (i != filters.length - 1) {
						getText += '&';
					}
				}

				continue;
			}
			
			let code = filters[i].id.split('_')[1];
			// console.log(code);
			if (code.substring(0, 1) === "i") {
				code = 'filter=' + code + ':';
				getText += code;
				//console.log(code);
				for (var j = 0; j < checkedBoxes.length; j++) {
					// console.log(checkedBoxes[j]);
					getText += checkedBoxes[j].value;
					//console.log(getText);
					//console.log('checkboxed[j].value: ', checkedBoxes[j].value)
					if (j != checkedBoxes.length - 1) {
						getText += ',';
					}
				}
				// if (i != filters.length - 1) {
					
				// }
			}
			else {
				code = code + '=';

				getText += code;
				for (let j = 0; j < checkedBoxes.length; j++) {
					getText += checkedBoxes[j].value;
					if (j != checkedBoxes.length - 1) {
						getText += '&' + code;
					}
				}
				// if (i != filters.length - 1) {
				// 	getText += '&';
				// }
			}

			getText += '&';
		}
	}
	

	for (let i = 0; i < filters.length; i++) {
		let inputBoxes = filters[i].querySelectorAll('.num_inp');

		if (inputBoxes.length != 0) {
			let code = inputBoxes[0].id.split('_')[0];
			let processed_min = inputBoxes[0].value.trim().replace(/\s+/g, ' ').replace(',', '.');
			let processed_max = inputBoxes[1].value.trim().replace(/\s+/g, ' ').replace(',', '.');

			let min_unit_index = processed_min.search(/[a-zA-Zа-яА-Я]/);
			let max_unit_index = processed_max.search(/[a-zA-Zа-яА-Я]/);

			let float_min, float_max, unit_min, unit_max;

			if (min_unit_index === -1) {
				float_min = parseFloat(processed_min);
			}
			else {
				float_min = parseFloat(processed_min.slice(0, min_unit_index));
				// если будет несколько слов, разделенных пробелом, то split возьмет первое слово
				unit_min = processed_min.slice(min_unit_index).split(' ')[0];
			}


			if (max_unit_index === -1) {
				float_max = parseFloat(processed_max);
			}
			else {
				float_max = parseFloat(processed_max.slice(0, max_unit_index));
				// если будет несколько слов, разделенных пробелом, то split возьмет первое слово
				unit_max = processed_max.slice(max_unit_index).split(' ')[0];
			}

			if (code.substring(0, 1) === "o" || code.substring(0, 1) === "r") {
				if (isNaN(float_min) === true && isNaN(float_max) === true) {
					inputBoxes[0].value = '';
					inputBoxes[1].value = '';
					continue;
				}
				// console.log(html_parameters);
				// console.log(code);

				if (html_parameters[code] === undefined) {
					if (code.slice(0, 1) === 'r') {
						// иногда коды r[id] конвертируются в o[id] и наоборот
						// лучше посмотреть сообщение по проекту в вк за 20 августа
						code = code.replace('r', 'o');
					}
					else if (code.slice(0, 1) === 'o') {
						code = code.replace('o', 'r');
					}
					else {
						console.log('\nReally weird thing happened');
						continue;
					}
				} 
				let par_name = html_parameters[code]["Short"];
				let default_unit = par_name.substring(par_name.indexOf('[') + 1, par_name.indexOf(']'));
				let cur_units = html_parameters[code]["Units"];

				// console.log(par_name);
				// console.log(cur_units);

				let unit_for_min = false;
				for (let unit of cur_units) {
					if (unit["Name"] == unit_min) {
						inputBoxes[0].value = float_min + ' ' + unit_min;
						float_min = float_min * unit["Multiplier"];
						unit_for_min = true;
					}
				}
	
				if (unit_for_min !== true) {
					let pair = composeInputField(float_min, unit_min, html_parameters[code]["DefaultMultiplier"])
					// console.log('\npair: ', pair)
					inputBoxes[0].value = pair[0];
					float_min = pair[1];
				}


				let unit_for_max = false;
				for (let unit of cur_units) {
					if (unit["Name"] == unit_max) {
						inputBoxes[1].value = float_max + ' ' + unit_max;
						float_max = float_max * unit["Multiplier"];
						unit_for_max = true;
					}
				}

				if (unit_for_max !== true) {
					let pair = composeInputField(float_max, unit_max, html_parameters[code]["DefaultMultiplier"])
					inputBoxes[1].value = pair[0];
					float_max = pair[1];
				}


				if (isNaN(float_min) == true) { inputBoxes[0].value = ''; }
				if (isNaN(float_max) == true) { inputBoxes[1].value = ''; }


				if (code.substring(0, 1) === "o" && filters[i].querySelector('.incl_inp').checked == false) {
					code = code.replace('o', 'r');
				}

				code = 'filter=' +  code;
				getText += code + ':';

				if (!isNaN(float_min)) {
					getText += parseFloat(parseFloat(float_min).toFixed(12)) + '~';
					if (!isNaN(float_max)) {
						getText += parseFloat(parseFloat(float_max).toFixed(12));
					}
				}
				else {
					getText += '~' + parseFloat(parseFloat(float_max).toFixed(12));
				}
				if (i != filters.length - 1) {
					getText += '&';
				}
			}
			else {
				if (isNaN(float_min) == true && isNaN(float_max) == true) {
					inputBoxes[0].value = '';
					inputBoxes[1].value = '';
					continue;
				}


				if (isNaN(float_min) == true) { inputBoxes[0].value = ''; }
				if (isNaN(float_max) == true) { inputBoxes[1].value = ''; }
				

				if (!isNaN(float_min)) {
					getText += `Min${code}=${float_min}`;
					if (!isNaN(float_max)) {
						getText += `&Max${code}=${float_max}`;
					}
				}
				else {
					getText += `Max${code}=${float_max}`;
				}

				if (i != filters.length - 1) {
					getText += '&';
				}
			}

			// console.log(code.slice(0, -1));
		}
	}


	if (getText.slice(-1) == '&') {
		getText = getText.slice(0, -1);
	}

	let input_field = document.querySelector('#element_search_bar');
	if (document.querySelector('.search_lupe').getAttribute('data-search') == '1') {
		let val = input_field.value;
		if (getText == '') {
			getText += 'name=' + val;
		}
		else {
			getText += '&name=' + val;
		}
	}

	return getText;
}



const resetFilterValues = function() {
    filterPreloader();
    let checked_boxes = $("input:checkbox:checked");
    let input_boxes = $("input[type=text]");
    let warnboxes = $('.warn_box');
    let warninps = $('.warn_inp');
    let search_input = $('#element_search_bar');

    searchClicked = false; // redundant

    document.getElementById("table_body").innerHTML = "";

    $('#element_search_bar')[0].value = "";
    document.getElementById("element_search_bar").disabled = false;

    $('#show_box').css('display', 'none');

    for (let i = 0; i < checked_boxes.length; i++) {
        checked_boxes[i].checked = false;
        checked_boxes[i].closest('label').classList.remove('filt_label_checked');
    }

    for (let i = 0; i < input_boxes.length; i++) {
        input_boxes[i].value = "";
    }

    for (let i = 0; i < warnboxes.length; i++) {
        warnboxes.eq(i).stop(true, true).hide();
    }

    for (let i = 0; i < warninps.length; i++) {
        warninps.eq(i).removeClass('warn_inp');
    }

    search_input.prop('disabled', false);
    document.querySelector('.search_lupe').setAttribute('data-search', '0');
}


// берет значения диапазонных парамтеров из URL и переносит
// их с нужными единицами измерения в соответствующие input поля
const convertURLRangeValue = function(value, parameter_info) {
	// добавляет единицу измерения, если она не стоит по умолчанию
	function appendUnit(value, current_unit, current_multiplier, default_multiplier) {
		if (current_multiplier == default_multiplier) {
			return parseFloat((value / default_multiplier).toFixed(12));
		}

		value = value / current_multiplier;
		return `${value} ${current_unit}`;
	}

	if (parameter_info == undefined) {
		return value;
	}

	let default_multiplier = parameter_info["DefaultMultiplier"];

	for (let unit of parameter_info["Units"]) {
		let check = false;
		let min_val = unit["MinValue"];
		let max_val = unit["MaxValue"];

		if (unit["MinIsIncluded"] === 'true') {
			if (unit["MaxIsIncluded"] === 'true') {
				if (min_val <= value && value <= max_val) {
					check = true;
				}
			}
			else {
				if (min_val <= value && value < max_val) {
					check = true;
				}
			}
		}
		else {
			if (unit["MaxIsIncluded"] === 'true') {
				if (min_val < value && value <= max_val) {
					check = true;
				}
			}
			else {
				if (min_val < value && value < max_val) {
					check = true;
				}
			}
		}

		if (check !== false) {
			return appendUnit(value, unit["Name"], unit["Multiplier"], default_multiplier);
		}
	}
}


// ставит disabled для тех полей ввода, которые неактуальны,
// иначе убирает disabled
const changeValuesState = function(html_parameters) {
	for (let [code, desc] of Object.entries(html_parameters)) {
		// console.log('\n\nfilter_' + code);
		let filterbox = $('#filter_' + code);
		let selectiveCheck = desc['Selective'];

		// проверка на выборочный параметр
		if (selectiveCheck === 'true') {
			// извлекаем массив со всеми возможными значениями
			// текущего параметра и их актуальностью
			let values = desc['Values'];
			let inputs = Array.from(filterbox.find('.inp_label'));

			for (let i = 0; i < inputs.length; i++) {
				// в питоне иногда меняется порядок при
				// извлечении значений из словаря в массив
				// (например в 217 категории, если обновлять
				// страницу, то видно как производители меняются
				// местами), поэтому приходится сравнивать значения
				// только в таком случае можем быть уверены

				for (let j = 0; j < values.length; j++) {
					// для параметра "Перспективность" третье
					// значение 'Не важно' всегда должно оставаться
					if ((code === 'actual') && (i === 2)) {
						break;
					}

					let curr_input = inputs[i];

					// проверка на соответствия значения и чекбокса
					if (values[j].slice(-2, -1)[0] === curr_input.value) {
						//console.log('\nValues[j]: ', values[j]);
						if (values[j].slice(-1)[0] === 'true') {
							curr_input.disabled = false;
						}
						else {
							// те чекбоксы, которые выбраны, оставляем доступными
							// чтобы можно было их снять
							if (curr_input.checked !== true) {
								curr_input.disabled = true;
								// console.log("curr_input.prop('checked') == true) for: ", curr_input);
							}
						}
					}
				}
			}
		}
		else {
			// берем все диапазонные input текущего фильтрбокса
			let range_inputs = Array.from(filterbox.find('.num_inp'));

			if (desc['Enabled'] === 'true') {
				for (let i = 0; i < range_inputs.length; i++) {
					range_inputs[i].disabled = false;

					// если параметр сложный, то в этом условии
					// также включаем возможность выбора чекбокса
					// (для включение введенного интервала в фильтрации)
					if (code.substring(0, 1) === 'o') {
						filterbox.find('.incl_inp').disabled = false;
					}
				}
			}
			else {
				for (let i = 0; i < range_inputs.length; i++) {
					range_inputs[i].disabled = true;

					if (code.substring(0, 1) === 'o') {
						filterbox.find('.incl_inp').disabled = true;
					}
				}
			}
		}
	}
}


const composeInputField = function(float_value, current_unit, default_unit) {
	let pair = [];
	// console.log('float_value: ', float_value)
	// console.log('default_unit: ', default_unit)

	let unit_chars = {
		'p': 1E-12,
		'n': 1E-9,
		'μ': 1E-6,
		'm': 1E-3,
		'c': 1E-2,
		'k': 1E+3,
		'M': 1E+6,
		'G': 1E+9,
		'T': 1E+12,
	}
	// console.log('new addition');
	if (unit_chars[current_unit] !== undefined) {
		pair.push(float_value + ' ' + current_unit);
		pair.push(float_value * unit_chars[current_unit]);
	}
	else {
		pair.push(float_value);
		pair.push(float_value * default_unit);
	}

	return pair;
}


String.prototype.width = function() {
	let words = this.split(/[ -]/);
	let max;

	for (let i = 0; i < words.length; i++) {
		let sum = 0;
		for (let ch of words[i]) {
		    sum += char_width[ch];
		}

		if (i == 0 || sum > max) {
			max = sum;
		}
	}

	return max;
}


const displayElements = function (data) {
//	console.log('START display')
	let time = performance.now();
//	console.log('Data length: ' + data.length);
	let col_widths = [];

	//console.log('col_widths: ', col_widths);
	//console.log('data:', data)
	document.getElementById("table_body").innerHTML = '';
	let message = '';
	var a_tag = '<a class="opener" target="_blank" rer="noopener noreferrer"href="/';
	for (let displayedElements = 0; displayedElements < data.length; displayedElements++) {
		message += '<tr>';
		for (var j = 1; j < data[displayedElements].length; j++) { // проходим по всем параметрам элемента кроме статуса
			message += '<td>';

			if (col_widths[j-1] === undefined) {
				col_widths.push(data[displayedElements][j][0][0].width());
			}

			if (j == 1) { // в случае если параметр = имя, то проверяем статус и присваиваем нужный класс и тайтл
				let status_pars = data[displayedElements][0][0];
				let class_text = '';
				let title_text = '';
				// console.log(data[displayedElements][0][0])
				if (status_pars[0] == 'True') {
					class_text += '';
					title_text += 'Перспективный\n';
				}
				else {
					class_text += 'unprom';
					title_text += 'Неперспективный\n';
				}

				switch (status_pars[1]) {
					case 0:
						title_text += 'Включён в МОП';
						break;
					case 1:
						class_text += ' removed';
						title_text += 'Снят с производства';
						break;
					case 2:
						class_text += ' sng';
						title_text += 'Производится в СНГ';
						break;
					case 3:
						class_text += ' excluded';
						title_text += 'Исключён из МОП';
						break;
					default:
						break;
				}

				if (class_text != '') {
					message += `<span class="${class_text}" title="${title_text}">`;
				}
				else {
					message += `<span title="${title_text}">`;
				}
				// message += ' class="irrelevant" title="Неперспективный\n">'
			}


			for (var k = 0; k < data[displayedElements][j].length; k++) {
				// console.log(data[displayedElements][j][k][0])

				//console.log('col_widths[j-1].length:', col_widths[j-1].length, '   data[displayedElements][j][k][0]):', data[displayedElements][j][k][0])
				if (col_widths[j-1] < data[displayedElements][j][k][0].width()) {
					col_widths[j-1] = data[displayedElements][j][k][0].width();
				}

				var link = data[displayedElements][j][k][1];
				var cur_val = data[displayedElements][j][k][0];
				if (link != undefined && link != '') {
					message += `${a_tag + link}">` + cur_val + '</a>';
				}
				else {
					message += cur_val;
				}

				if (k != data[displayedElements][j].length - 1 && data[displayedElements][j][k] != "" && data[displayedElements][j][k] != '-') {
					message +=  ';<br>';
				}
			}

			if (j == 1) {
				message += '</span>'
			}

			message += '</td>';
		}

		message += '</tr>';
	}

	let ths = $('#sticky_table th');
	for (let i = 0; i < ths.length; i++) {
		if (ths[i].width < col_widths[i] + 22) {
			// если ширина столбца догруженных данных меньше,
			// чем текущая, то ее не меняем
			ths[i].width = col_widths[i] + 22;
		}
	}

	ths = $('#table_elements th');
	for (let i = 0; i < ths.length; i++) {
		if (ths[i].width < col_widths[i] + 22) {
			// если ширина столбца догруженных данных меньше,
			// чем текущая, то ее не меняем
			ths[i].width = col_widths[i] + 22;
		}
	}
	$('.preloader').remove();
	$('.load_preloader').remove();
	$('.main_content').css('display', 'block');

	document.getElementById("table_body").innerHTML = message;
	if (cachedData.length > 0) {
		document.getElementById("number_of_displayed_elements").innerHTML = 'Найдено элементов: ' + cachedData.length;
	}
	else {
		document.getElementById("number_of_displayed_elements").innerHTML = 'Не найдено элементов, удовлетворяющих указанному запросу';
	}
//	time = performance.now() - time;
//	console.log('FINISH:', time);
}

let updatePaginator = function($, numb) {
	// Consider adding an ID to your table
	// incase a second table ever enters the picture.

	var numItems = numb;
	var perPage = 20;
	console.log("Called paginator");
	// Now setup the pagination using the `.pagination-page` div.
	$(".compact-theme").pagination({
		prevText: '🡠',
		nextText: '🡢',
		items: numItems,
		itemsOnPage: perPage,
		currentPage: retrievePageFromURL(),
		cssStyle: "compact-theme",
		hrefTextPrefix: '',
		// This is the actual page changing functionality.
		onPageClick: function(pageNumber) {
			var showFrom = perPage * (pageNumber - 1);
			var showTo = showFrom + perPage;
			console.log(cachedData.slice(showFrom, showTo)[0]);

			// We'll first hide everything...
			displayElements(cachedData.slice(showFrom, showTo));
		}
	});
};


const URLValuesToInput = function() {
    let url_search = window.location.search;
//    console.log('url_search: ', url_search)
//    console.log('decode:     ', decodeURIComponent(url_search))
    if (url_search != '') {
        fetch('/catget' + url_search)
        .then(res => res.json())
        .then(data => {
            cachedData = data[0];
            updatePaginator($, cachedData.length);
            displayElements(data[0].slice(0,20));

            html_parameters = data[1];
            changeValuesState(html_parameters);

            // разделяем каждый фильтр в адресной строке
            let query_values = decodeURIComponent(window.location.search.substring(1)).split('&');

            // console.log('\nQUERY DESTRUCTURING:\n')
            // console.log(query_values);

            let actualIncluded = false;
            if (query_values.length === 0) {
                console.log('\n\nНе думал, что этот вывод может произойти\n')
            }
            else {
            // Нужно будет отдельно обработать значение для search из URL
                for (let i = 0; i < query_values.length; i++) {
                    // console.log(query_values[i]);
                    // console.log(query_values[i].split('='));
                    let code_and_vals = query_values[i].split('=');

                    if (code_and_vals[0] === 'filter') {
                        code_and_vals = code_and_vals[1].split(':');
                        let code = code_and_vals[0];
                        let value = code_and_vals[1];

                        if (code_and_vals[0].substring(0, 1) === 'i') {
                            let values = code_and_vals[1].split(',');
                            // console.log('Code: ', code, '\tValues: ', values);
                            // console.log(values);

                            let inputs = $('#filter_' + code).find('.inp_label');

                            for (let j = 0; j < inputs.length; j++) {
                                // console.log('\nVALUES: ', values);
                                if (values.length === 0) {
                                    break;
                                }

                                for (let k = 0; k < values.length; k++) {
                                    if (inputs[j].value === values[k]) {
                                        inputs[j].checked = true;
                                        values.splice(k, 1);
                                        break;
                                    }
                                }
                            }
                        }
                        else {
                            let values = code_and_vals[1].split('~');
                            // console.log('Code: ', code, '\tValues: ', values);
                            // console.log(values);
                            // console.log('here' + code);
                            // console.log(document.getElementById('filter_' + code));
                            // console.log('warning\n:', $('#filter_' + code))

                            let first_letter = code.substring(0, 1);
                            let inputs = $('#filter_' + code).find('.num_inp');
                            let inclusion_input = $('#filter_' + code).find('incl_inp');

                            if (first_letter === 'r') {
                                // иногда коды r[id] конвертируются в o[id] и наоборот
                                // лучше посмотреть сообщение по проекту в вк за 20 августа
                                inputs = inputs.length ? inputs : $('#filter_' + code.replace('r', 'o')).find('.num_inp');

                                if (inclusion_input.length !== 0) {
                                    inclusion_input.checked = false;
                                }
                            }
                            else if (first_letter === 'o') {
                                inputs = inputs.length ? inputs : $('#filter_' + code.replace('o', 'r')).find('.num_inp');

                                if (inclusion_input.length !== 0) {
                                    inclusion_input.checked = true;
                                    inclusion_input.disabled = false;
                                }
                            }

                            if (inputs.length === 0) {
                                break;
                            }

                            // если запрос для текущего параметра
                            // корретный, то убирает disabled с полей ввода

                            if (values[0] != "") {
                                // следующая строка лишняя, в url пробелы заменяются на %20
                                let proccesed_min = values[0].trim().replace(/\s+/g, ' ').replace(',', '.').split(' ');

                                if (isNaN(parseFloat(proccesed_min[0]))) {
                                    inputs[0].value = '';
                                }
                                else {
                                    inputs[0].value = convertURLRangeValue(values[0], html_parameters[code]);
                                    inputs[0].disabled = false;
                                }
                            }
                            else {
                                inputs[0].value = '';
                            }


                            if (values[1] != "") {
                                // следующая строка лишняя, в url пробелы заменяются на %20
                                let proccesed_max = values[1].trim().replace(/\s+/g, ' ').replace(',', '.').split(' ');

                                if (isNaN(parseFloat(proccesed_max[0]))) {
                                    inputs[1].value = '';
                                }
                                else {
                                    inputs[1].value = convertURLRangeValue(values[1], html_parameters[code]);;
                                    inputs[1].disabled = false;
                                }
                            }
                            else {
                                inputs[1].value = '';
                            }
                        }
                    }
                    else {
                        // console.log('THIS IS THE MOMENT: ', code_and_vals)
                        let code = code_and_vals[0];
                        let value = code_and_vals[1];

                        if (code.toLowerCase() == 'actual') {
                            actualIncluded = true;
                        }

                        let substr = code.toLowerCase().substring(0, 3);

                        if (substr === 'min' || substr === 'max') {
                            code = code.substring(3);

                            let range_input = $(code + '_' + substr);

                            if (range_input.length !== 0) {
                                range_input.value = value;
                                range_input.disabled = false;
                            }
                        }
                        else {
                            let inputs = $('#filter_' + code).find('.inp_label');

                            for (let j = 0; j < inputs.length; j++) {
                                if (inputs[j].value === value) {
                                    // console.log('HERE I AM')
                                    inputs[j].checked = true;
                                    inputs[j].disabled = false;
                                    break;
                                }
                            }

                            // console.log('Code: ', code, '\tValue: ', value);

                            if (code.toLowerCase() == 'name') {
                                let input_field = document.querySelector('#element_search_bar');
                                input_field.value = value;
                                input_field.disabled = true;
                                document.querySelector('.search_lupe').setAttribute('data-search', '1');
                            }
                        }
                    }
                }

                if (actualIncluded == false) {
                    $("input:radio")[2].checked = true;
                }
                document.documentElement.scrollTop = 0;
            }
        });
    } else {
        $("input:radio")[2].checked = true;
        fetch('/catget')
        .then(res => res.json())
        .then(data => {
            cachedData = data[0];
            updatePaginator($, cachedData.length);
            displayElements(data[0].slice(0,20));


            html_parameters = data[1];
            changeValuesState(html_parameters);
            document.documentElement.scrollTop = 0;
        });
    }
}


$(function () {
	console.log('starting state:', window.history.state);
	
	let preloader = $('<div></div>');
	preloader.addClass('preloader');
	preloader.insertBefore($('.main_content'));

	URLValuesToInput();


	// $(window).on('hashchange', function (event) {
	// 	event.preventDefault();
	// 	console.log('HASHCHANGE this is the last url:', window.history.state);
	// });

    $(window).on('popstate', function () {
		resetFilterValues();
        URLValuesToInput();
    });


	$('.back_to_top').on('click', function () {
		$('#sticky_div').css('top', 0);
		$('html, body').animate({scrollTop:0}, 'fast');
	});


	$(window).on('scroll', function () {
		var scroll = $(window).scrollTop();
		var btt = $('.back_to_top');
		btt.stop(true, true);

		if (scroll > 0) { btt.show(); }

		if ($('html, body').is(':animated')) {
			if (scroll == 0) { btt.fadeOut(400); }
			return;
		}
        let table = $('#table_elements');
        let head = $('#sticky_table').height();
        if (scroll > 0) {
        	if (scroll >= table.height() + table.offset().top - head) {
        		$('#sticky_div').css('top', table.height() - head);
        	}
        	else {
        		if (scroll >= 178) {
	                $('#sticky_div').css('top', scroll - 178);
	            }
	            else {
	                $('#sticky_div').css('top', 0);
	            }
        	}
        }
        else {
            $('#sticky_div').css('top', 0);
            $('.back_to_top').fadeOut(400);
        }
	});


	$('#stat_show_button').on('click', function (e) {
		filterPreloader();
		e.preventDefault();

		let getText = composeURL();

		$('#show_box').css('display', 'none');

		if (getText == '') {
			window.history.pushState({ prevUrl: window.location.href }, null, window.location.pathname);
		}
		else {
			window.history.pushState({ prevUrl: window.location.href }, null, window.location.pathname + '?' + encodeURIComponent(getText).replaceAll('%26', '&').replaceAll('%3D', '='));
		}

		document.getElementById("table_body").innerHTML = "";
		// console.log('encode: ', '?' + encodeURIComponent(getText).replaceAll('%26', '&'));

		let url_search = window.location.search;
		if (url_search != '') {
			fetch('/catget' + url_search)
			.then(res => res.json())
			.then(data => {
				cachedData = data[0];
				updatePaginator($, cachedData.length);
				displayElements(data[0].slice(0,20));

				html_parameters = data[1];
				changeValuesState(html_parameters);
			});
		} else {
			fetch('/catget')
			.then(res => res.json())
			.then(data => {
				cachedData = data[0];
				updatePaginator($, cachedData.length);
				displayElements(data[0].slice(0,20));

				html_parameters = data[1];
				changeValuesState(html_parameters);
			});
		}
	});


	$('#show_button').on('click', function () {
		$('#stat_show_button').trigger('click');
	});


	$('#element_search_bar').on('keydown', function() {
		if (event.key == '%') {
			return false;
		}
		if (event.key === "Enter") {
			$('.search_lupe').trigger('click');
		}
	});


	$('.search_lupe').on('click', function () {
		let url_search = '';
		let elem = this;
		let input_field = document.querySelector('#element_search_bar');
		if (elem.getAttribute('data-search') == '1') {
			elem.setAttribute('data-search', '0');

			let val = input_field.value;
			input_field.value = '';
			input_field.disabled = false;

			url_search = window.location.search.slice(1);

			if (url_search.lastIndexOf('&name=') !== -1) {
				let ind = url_search.lastIndexOf('&name=');
				url_search = url_search.slice(0, ind);
				window.history.pushState({ prevUrl: window.location.href }, null, window.location.pathname + '?' + encodeURIComponent(url_search).replaceAll('%26', '&').replaceAll('%3D', '='));
			} else {
				let ind = url_search.lastIndexOf('name=');
				url_search = url_search.slice(0, ind);
				window.history.pushState({ prevUrl: window.location.href }, null, window.location.pathname);
			}


		}
		else {
			let val = input_field.value;
			val = val.trim();
			if (val !== '') {
				input_field.value = val;
				elem.setAttribute('data-search', '1');
				input_field.disabled = true;

				url_search = window.location.search.slice(1);

				if (url_search !== '') {
					url_search += '&name=' + val;
					window.history.pushState({ prevUrl: window.location.href }, null, window.location.pathname + '?' + encodeURIComponent(url_search).replaceAll('%26', '&').replaceAll('%3D', '='));
				}
				else {
					url_search += 'name=' + val;
					window.history.pushState({ prevUrl: window.location.href }, null, window.location.pathname + '?' + encodeURIComponent(url_search).replaceAll('%26', '&').replaceAll('%3D', '='));
				}
			}
		}
		filterPreloader();
		if (url_search !== '') { url_search = '?' + url_search; }

		fetch('/catget' + url_search)
		.then(res => res.json())
		.then(data => {
			cachedData = data[0];
			updatePaginator($, cachedData.length);
			displayElements(data[0].slice(0,20));

			html_parameters = data[1];
			changeValuesState(html_parameters);
		});
	});


	$('.inp_label[type=radio]').on('change', function () {
		let elem = $(this);
		if (elem.get(0).value == 'none') {
			countClicked--;
		}
		else {
			countClicked++;
		}
		let position;
		let filt_no = elem.closest('div').attr('id').slice(7);
		$('#show_box').css('display', 'block');
		$('#show_box').css('top', elem.offset().top - 15);
	});


	$('.inp_label[type=checkbox]').on('change', function () {
		let elem = $(this);
		let position;
		let filt_no = elem.closest('div').attr('id').slice(7);
		$('#show_box').css('display', 'block');
		$('#show_box').css('top', elem.offset().top - 15);
		if (elem.is(':checked')) {
			countClicked++;
			elem.parent().addClass('filt_label_checked');
		}
		else {
			countClicked--;
			elem.parent().removeClass('filt_label_checked');
		}
	});


	$('#reset_button').on('click', function () {
		resetFilterValues();

		// ставим в url адрес без query string
		window.history.pushState({ prevUrl: window.location.href }, null, window.location.pathname);

		// в этом случае всегда делаем get запрос с пустым query string
		fetch('/catget')
		.then(res => res.json())
		.then(data => {
			cachedData = data[0];
			updatePaginator($, cachedData.length);
			displayElements(data[0].slice(0,20));

			html_parameters = data[1];
			changeValuesState(html_parameters);
		});
	});


	$('.filter_select > button').on('click', function () {
		var elem = $(this);
		var filt_select = elem.closest('.filter_select');
		var filt_no = filt_select.attr('id').slice(7);
		var inpmax = filt_select.find('.max')

		filt_select.find('.min')[0].value = "";
		inpmax[0].value = "";
		inpmax.removeClass('warn_inp');

		$('#show_box').css('display', 'block');
		$('#show_box').css('top', $(this).offset().top - 5);
		elem.next().hide();
	});


	$('.num_inp').on('keypress', function(event) {
		if (['%', '~', ':', '&', '='].includes(event.key)) {
			return false;
		}
	});


	$('.num_inp').on('input', function () {
		var elem = $(this)

		if (elem.hasClass('min')) {
			elem.parent().next().find('.max').removeClass('warn_inp');
		}
		else {
			elem.removeClass('warn_inp');
		}

		elem.closest('.filter_select').find('.warn_box').hide();
		$('#show_box').css('top', $(this).offset().top - 8);
		$('#show_box').css('display', 'block');
	});


	$('.num_inp').on('paste', function (event) {
        event.preventDefault();
        let pasted_text = event.originalEvent.clipboardData.getData('text');
        this.value = pasted_text.replace(/[%~:&=]*/g, '')
	});


	$('.incl_inp').on('click', function () {
		var elem = $(this);
		$('#show_box').css('top', elem.offset().top - 4);
		$('#show_box').css('display', 'block');
	});


	$('#show_box_close').on('click', function () {
		$('#show_box').css('display', 'none');
	});


	$('.dropdown_header').on('click', function () {
		var elem = $(this);
		var filter = elem.parent();
		var warnboxes = $('.warn_box');

		$('#show_box').css('top', elem.offset().top - 4);
		$('#show_box').css('display', 'block');

		if (filter.hasClass('filter_opened')) {
			filter.removeClass('filter_opened');
		}
		else {
			filter.addClass('filter_opened');
		}

		for (var i = 0; i < warnboxes.length; i++) {
			let warnbox = warnboxes.eq(i);
			warnbox.css('top', warnbox.parent().find('.max').offset().top - 5); 
		}
	});
});
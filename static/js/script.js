"use strict";


var displayedElements = 0;
var countClicked = 0;
var countFiltered = 0;
var searchClicked = false;
var checked = [];

// каждый раз при загрузке категории ее определяем
// потому что нужен доступ к ней из многих функции
var html_parameters;


// берет значения диапазонных парамтеров из URL и переносит
// их с нужными единицами измерения в соответствующие input поля
const URLValueToInput = function(value, parameter_info) {
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



const displayElements = function (data) {
	// console.log('data:', data)
	var message = document.getElementById("table_body").innerHTML;
	var limit = 200 + displayedElements;
	var a_tag = '<a class="opener" target="_blank" rer="noopener noreferrer"href="/';
	for (displayedElements; displayedElements < Math.min(data.length, limit); displayedElements++) {
		message += '<tr>';
		for (var j = 1; j < data[displayedElements].length; j++) { // проходим по всем параметрам элемента кроме статуса
			message += '<td>';

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
				// console.log('class_text: ', class_text)
				// console.log('title_text: ', title_text)
				
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
				
				var link = data[displayedElements][j][k][1];
				var cur_val = data[displayedElements][j][k][0];
				if (link != undefined && link != '') {

					// console.log(`${a_tag + link}"`)
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
	document.getElementById("table_body").innerHTML = message;
	if (data.length) {
		document.getElementById("number_of_displayed_elements").innerHTML = 'Найдено элементов: ' + data.length;
	}
	else {
		document.getElementById("number_of_displayed_elements").innerHTML = 'Не найдено элементов, удовлетворяющих указанному запросу';
	}
	if (displayedElements == data.length) {
		$('#load_items').css('display', 'none');
	}
	else {
		$('#load_items').css('display', 'block');
	}
	// displayedElements = Math.min(data.length, 50);
}






$(function () {
	$("#load_items").css({'width': ($("#table_elements").width() + 'px')});
	console.log('window location:', window.location)
	let url_search = window.location.search;
	console.log('url_search: ', url_search)
	console.log('decode:     ', decodeURIComponent(url_search))
	if (url_search != '') {
		console.log('This is url_search: ', url_search)
		console.log('/catget' + url_search)
		fetch('/catget' + url_search)
		.then(res => res.json())
		.then(data => {
			displayElements(data[0]); 
			html_parameters = data[1];
			$("#load_items").css({
	        	'width': ($("#table_elements").width() + 'px')
			});

			// разделяем каждый фильтр в адресной строке
			let query_values = decodeURIComponent(window.location.search.substring(1)).split('&');

			console.log('\nQUERY DESTRUCTURING:\n')
			console.log(query_values);

			if (query_values.length === 0) {
				console.log('\n\nНе думал, что этот вывод может произойти\n')
			}
			else {
				for (let i = 0; i < query_values.length; i++) {
					console.log(query_values[i]);
					console.log(query_values[i].split('='));
					let code_and_vals = query_values[i].split('=');
					
					if (code_and_vals[0] === 'filter') {
						code_and_vals = code_and_vals[1].split(':');
						let code = code_and_vals[0];
						let value = code_and_vals[1];

						if (code_and_vals[0].substring(0, 1) === 'i') {
							let values = code_and_vals[1].split(',');
							console.log('Code: ', code, '\tValues: ', values);
							console.log(values);

							let inputs = $('#filter_' + code).find('.inp_label');

							for (let j = 0; j < inputs.length; j++) {
								console.log('\nVALUES: ', values);
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
									inputs[0].value = URLValueToInput(values[0], html_parameters[code]);
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
									inputs[1].value = URLValueToInput(values[1], html_parameters[code]);;
									inputs[1].disabled = false;
								}
							}
							else {
								inputs[1].value = '';
							}
						}
					}
					else {
						let code = code_and_vals[0];
						let value = code_and_vals[1];
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
									console.log('HERE I AM')
									inputs[j].checked = true;
									inputs[j].disabled = false;
									break;
								}
							}

							console.log('Code: ', code, '\tValue: ', value);
							/*for (let j = 0; j < code_and_vals.length; j++) {
							console.log(code_and_vals[j][1])
							}*/
						}
					}
				}
			}

			// в этом случае не нужно вызывать changeValuesState(html_parameters),
			// так как при переходе на страницу создается новый html,
			// в котором все значения в фильтрах отображаются правильно
			

			// console.log('this is the data:\n', data[0])
			// console.log('these are the html_parameters:\n', html_parameters)
		});
	} else {
		 // var time = performance.now();
		 // console.log('START')
		fetch('/catget')
		.then(res => res.json())
		.then(data => {
			// console.log('START display')
			// var time1 = performance.now();

			displayElements(data[0]);

			// var time2 = performance.now() - time1;
			// console.log('FINISH display: ', time2);


			html_parameters = data[1];
			$("#load_items").css({
	        	'width': ($("#table_elements").width() + 'px')
			});
			// в этом случае не нужно вызывать changeValuesState(html_parameters),
			// так как при переходе на страницу создается новый html,
			// в котором все значения в фильтрах отображаются правильно


			// console.log('this is the data:\n', data[0])
			// console.log('these are the html_parameters:\n', html_parameters)

			 // time = performance.now() - time;
			 // console.log('FINISH:', time);
		});
	}




    $(window).resize(function() {
		$("#load_items").css({
        	'width': ($("#table_elements").width() + 'px')
		});
	});
	
	
	document.getElementById("table_body").innerHTML = "";
	$('.back_to_top').on('click', function () {
		$('#sticky_div').css('top', 0);
		$('html, body').animate({scrollTop:0}, 'fast');
	})


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
        		if (scroll >= 158) {
	                $('#sticky_div').css('top', scroll - 158);
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



	$('#load_items').on('click', function() {
		fetch('/catget')
		.then(res => res.json())
		.then(data => {
			displayElements(data[0]); 
			html_parameters = data[1];
		})
	});



	$('#stat_show_button').on('click', function (e) {
		e.preventDefault();
		displayedElements = 0;
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
					
					console.log('html_parameters: ', html_parameters);
					console.log('code: ', code);
					console.log(html_parameters[code])

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
					console.log('par_name', par_name)
					let cur_units = html_parameters[code]["Units"];

					// console.log(par_name);
					// console.log(cur_units);

					console.log('unit_min: ', unit_min)

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
						console.log('\npair: ', pair)
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
		console.log('getText: ', getText);


		$('#show_box').css('display', 'none');

		if (getText == '') {
			window.history.pushState(null, null, window.location.pathname);
		}
		else {
			window.history.pushState(null, null, window.location.pathname + '?' + encodeURIComponent(getText).replaceAll('%26', '&').replaceAll('%3D', '='));
		}

		document.getElementById("table_body").innerHTML = "";
		console.log('encode: ', '?' + encodeURIComponent(getText).replaceAll('%26', '&'));

		let url_search = window.location.search;
		console.log('url:    ', url_search);
		if (url_search != '') {
			console.log('here: ', url_search);
			fetch('/catget' + url_search)
			.then(res => res.json())
			.then(data => {
				displayElements(data[0]); 
				html_parameters = data[1];
				console.log('\nhtml_parameters:\n', html_parameters)
				changeValuesState(html_parameters);
			});
		} else {
			console.log('here:');
			fetch('/catget')
			.then(res => res.json())
			.then(data => {
				displayElements(data[0]);
				html_parameters = data[1];
				console.log('\nhtml_parameters:\n', html_parameters)
				changeValuesState(html_parameters);
			});
		}
	});



	$('#show_button').on('click', function () {
		$('#stat_show_button').trigger('click');
	});


	$('.inp_label[type=radio]').on('change', function () {
		// console.log('click')
		let elem = $(this);
		if (elem.get(0).value == 'none') {
			countClicked--;
		}
		else {
			countClicked++;
		}
		// console.log("countClicked: ", countClicked)
		let position;
		let filt_no = elem.closest('div').attr('id').slice(7);
		$('#show_box').css('display', 'block');
		$('#show_box').css('top', elem.offset().top - 15);
	});


	$('.inp_label[type=checkbox]').on('change', function () {
		// console.log('click')
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
		// console.log("countClicked: ", countClicked)
	});



	$('#search_form span').on('click', function(event) {
		if (searchClicked == true) {			
			document.getElementById("table_body").innerHTML = "";
			displayedElements = 0;
			displayFiltered(filtered);
		}
		searchClicked = false;
		$('#element_search_bar')[0].value = "";
		document.getElementById("element_search_bar").disabled = false;
	});



	$('#search_form').on('submit', function(event) {
		event.preventDefault();
		$('#element_search').trigger('click');
	});


	$('#element_search').on('click', function () {	
		displayedElements = 0;
		

		$('#element_search_bar')[0].value = $('#element_search_bar')[0].value.toLowerCase().trim();
		var search_value = $('#element_search_bar')[0].value.toLowerCase().trim();
		if (search_value) {
			document.getElementById("element_search_bar").disabled = true;

		}
		// if (search_value) {
		// 	searchClicked = true;
		// 	document.getElementById("element_search_bar").disabled = true;
		// 	document.getElementById("table_body").innerHTML = "";		
			
		// 	for (var i = 0; i < filtered.length; i++) {
		// 		var comparing = filtered[i].name.toString().toLowerCase();
			
		// 		if (!comparing.includes(search_value)) {
		// 			continue;
		// 		}
		// 		else {
		// 			countSearched++;
		// 			searched.push(filtered[i]);
		// 		}
		// 	}
		// 	displayFiltered(searched);
			
		// }
	});







	$('#reset_button').on('click', function () {

		var checked_boxes = $("input:checkbox:checked");
		var input_boxes = $("input[type=text]");
		var warnboxes = $('.warn_box');
		var warninps = $('.warn_inp');
		
		searchClicked = false;
		displayedElements = 0;
		//  =  [[], [], [], [], [NaN, NaN], [NaN, NaN], [NaN, NaN], [NaN, NaN], [NaN, NaN], [], [], [NaN, NaN], [NaN, NaN], [NaN, NaN]];
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

		// ставим в url адрес без query string
		window.history.pushState(null, null, window.location.pathname);		
		
		// в этом случае всегда делаем get запрос с пустым query string
		fetch('/catget')
		.then(res => res.json())
		.then(data => {
			displayElements(data[0]);
			html_parameters = data[1];
			changeValuesState(html_parameters);
		});


		$("input:radio")[2].checked = true;
		console.log();
	});




	$('.filter_select > button').on('click', function () {
		var elem = $(this);
		var filt_select = elem.closest('.filter_select');
		var filt_no = filt_select.attr('id').slice(7);
		var inpmax = filt_select.find('.max')

		// selected[filt_no] = [NaN, NaN];
		filt_select.find('.min')[0].value = "";
		inpmax[0].value = "";
		inpmax.removeClass('warn_inp');

		$('#show_box').css('display', 'block');
		$('#show_box').css('top', $(this).offset().top - 5);
		//elem.next().css('display', 'none');
		elem.next().hide();	
	});


	$('.num_inp').on('keypress', function(event) {
		if (event.key == '%') {
			return false;
		}
		// event.preventDefault();
		// console.log(event.keyCode)
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
		//var prev_val = $(this)[0].value;
		// var pasted_text = event.originalEvent.clipboardData.getData('text');
		// pasted_text = pasted_text.replace(",", ".").replace("%", '');
		// return pasted_text
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
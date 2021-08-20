"use strict";


var displayedElements = 0;
var countClicked = 0;
var countFiltered = 0;
var searchClicked = false;
var checked = []
var units;


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
						console.log('\nValues[j]: ', values[j]);
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


const composeInputField = function(input_value, float_value, multiplier, default_unit) {
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
	if (unit_chars[multiplier] !== undefined) {
		pair.push(input_value + ' ' + multiplier);
		pair.push(float_value * unit_chars[multiplier]);
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
			units = data[1];
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
								inputs = inputs.length ? inputs : $('#filter_' + code.replace('r', 'o')).find('.num_inp');

								if (inclusion_input.length !== 0) {
									inclusion_input.checked = false;
								}
							}
							else if (first_letter === 'o') {
								inputs = inputs.length ? inputs : $('#filter_' + code.replace('o', 'r')).find('.num_inp');

								if (inclusion_input.length !== 0) {
									inclusion_input.checked = true;
								}
							}

							if (inputs.length === 0) {
								break;
							}

							inputs[0].value = values[0];
							inputs[1].value = values[1];
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
							}
						}
						else {
							let inputs = $('#filter_' + code).find('.inp_label');

							for (let j = 0; j < inputs.length; j++) {
								if (inputs[j].value === value) {
									inputs[j].checked = true;
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

			// в этом случае не нужно вызывать changeValuesState(units),
			// так как при переходе на страницу создается новый html,
			// в котором все значения в фильтрах отображаются правильно
			

			// console.log('this is the data:\n', data[0])
			// console.log('these are the units:\n', units)
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


			units = data[1];
			$("#load_items").css({
	        	'width': ($("#table_elements").width() + 'px')
			});
			// в этом случае не нужно вызывать changeValuesState(units),
			// так как при переходе на страницу создается новый html,
			// в котором все значения в фильтрах отображаются правильно


			// console.log('this is the data:\n', data[0])
			console.log('these are the units:\n', units)

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
			units = data[1];
		})
	});



	$('#stat_show_button').on('click', function (e) {
		e.preventDefault();
		displayedElements = 0;
		var getText = '';
		
		var filters = $(".filter_select");


		for (var i = 0; i < filters.length; i++) {
			var checkedBoxes = filters[i].querySelectorAll('.inp_label:checked');
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
					for (var j = 0; j < checkedBoxes.length; j++) {
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
		

		for (var i = 0; i < filters.length; i++) {
			var inputBoxes = filters[i].querySelectorAll('.num_inp');
			if (inputBoxes.length != 0) {
				let code = inputBoxes[0].id.split('_')[0];
				let min = inputBoxes[0].value.trim().replace(/\s+/g, ' ').replace(',', '.').split(' ');
				let max = inputBoxes[1].value.trim().replace(/\s+/g, ' ').replace(',', '.').split(' ');

				var float_min = parseFloat(min[0]);
				var float_max = parseFloat(max[0]);

				if (code.substring(0, 1) === "o" || code.substring(0, 1) === "r") {	
					if (isNaN(float_min) == true && isNaN(float_max) == true) {
						inputBoxes[0].value = '';
						inputBoxes[1].value = '';
						continue;
					}
					// console.log(units);
					// console.log(code);
					
					console.log('units: ', units);
					console.log('code: ', code);
					console.log(units[code])

					if (units[code] === undefined) {
						if (code.slice(0, 1) === 'r') {
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
					var par_name = units[code]["Short"];
					var default_unit = par_name.substring(par_name.indexOf('[') + 1, par_name.indexOf(']'));
					console.log('par_name', par_name)
					var cur_units = units[code]["Units"];

					// console.log(par_name);
					// console.log(cur_units);

					console.log('min[1]: ', min[1])
					if (cur_units[min[1]] != undefined) {
						inputBoxes[0].value = min[0] + ' ' + min[1];
						float_min = float_min * cur_units[min[1]];
					}
					else {
						let pair = composeInputField(min[0], float_min, min[1], cur_units[default_unit])
						inputBoxes[0].value = pair[0];
						float_min = pair[1];
						// switch (multiplier) {
						// 	case 'p':
						// 		pair.push(' p');
						// 		pair.push(float_min * 1E-12)
						// 		inputBoxes[0].value = min[0] + ' p';
						// 		float_min = float_min * 1E-12;
						// 		break;
						// 	case 'n':
						// 		inputBoxes[0].value = min[0] + ' n';
						// 		float_min = float_min * 1E-9;
						// 		break;
						// 	case 'μ':
						// 		inputBoxes[0].value = min[0] + ' μ';
						// 		float_min = float_min * 1E-6;
						// 		break;
						// 	case 'm':
						// 		inputBoxes[0].value = min[0] + ' m';
						// 		float_min = float_min * 1E-3;
						// 		break;
						// 	case 'c':
						// 		inputBoxes[0].value = min[0] + ' c';
						// 		float_min = float_min * 1E-2;
						// 		break;
						// 	case 'k':
						// 		inputBoxes[0].value = min[0] + ' k';
						// 		float_min = float_min * 1E+3;
						// 		break;
						// 	case 'M':
						// 		inputBoxes[0].value = min[0] + ' M';
						// 		float_min = float_min * 1E+6;
						// 		break;
						// 	case 'G':
						// 		inputBoxes[0].value = min[0] + ' G';
						// 		float_min = float_min * 1E+9;
						// 		break;
						// 	case 'T':
						// 		inputBoxes[0].value = min[0] + ' p';
						// 		float_min = float_min * 1E+12;
						// 		break;
						// 	default:
						// 		inputBoxes[0].value = float_min;
						// 		float_min = float_min * cur_units[default_unit];
						// 		break;
						// }

						// inputBoxes[0].value = float_min;
						// float_min = float_min * cur_units[default_unit];
					}


					if (cur_units[max[1]] != undefined) {
						inputBoxes[1].value = max[0] + ' ' + max[1];
						float_max = float_max * cur_units[max[1]];
					}
					else {
						let pair = composeInputField(max[0], float_max, max[1], cur_units[default_unit])
						inputBoxes[1].value = pair[0];
						float_max = pair[1];
						console.log(pair);
					}


					if (isNaN(float_min) == true) { inputBoxes[0].value = ''; }
					if (isNaN(float_max) == true) { inputBoxes[1].value = ''; }


					if (code.substring(0, 1) === "o" && filters[i].querySelector('.incl_inp').checked == false) {
						code = code.replace('o', 'r');
					}

					code = 'filter=' +  code;
					getText += code + ':';

					if (!isNaN(float_min)) {
						getText += parseFloat(parseFloat(float_min).toFixed(19)) + '~';
						if (!isNaN(float_max)) {
							getText += parseFloat(parseFloat(float_max).toFixed(19));
						}
					}
					else {
						getText += '~' + parseFloat(parseFloat(float_max).toFixed(19));
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
		console.log('encode: ', '?' + encodeURIComponent(getText).replaceAll('%26', '&'))

		let url_search = window.location.search;
		console.log('url:    ', url_search);
		if (url_search != '') {

			console.log('here: ', url_search);
			fetch('/catget' + url_search)
			.then(res => res.json())
			.then(data => {
				displayElements(data[0]); 
				units = data[1];
				console.log('these are the units:\n', units)
				changeValuesState(units);
			});
		} else {
			console.log('here:');
			fetch('/catget')
			.then(res => res.json())
			.then(data => {
				displayElements(data[0]);
				units = data[1];
				console.log('these are the units:\n', units)
				changeValuesState(units);
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
			units = data[1];
			changeValuesState(units);
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
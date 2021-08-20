"use strict";


var message = '';


function printCategories(data) {
	var arrayType = $.isArray(data);
	var objectType = $.isPlainObject(data);

	if (objectType == true) {
		if (data.Children != undefined) {
			if (data.Children.length != 0) {
				message += '<ul class="children closed">';
				for (var i = 0; i < data.Children.length; i++) {
					if (data.Children[i].Children != undefined) {
						if (data.Children[i].Children.length != 0) {
							// console.log(data.Сhildren[i].Сhildren)
							message += `<li><span class="opener">+</span><a href='/category/${data.Children[i].Id}'>${data.Children[i].Name}</a>`;
						}
						else {
							message += `<li><a href='/category/${data.Children[i].Id}'>${data.Children[i].Name}</a>`;
						}	
					}
					
					
			        printCategories(data.Children[i]);
			        message += '</li>';
			    }
			    message += '</ul>';
			}
		}
	} else if (arrayType == true) {
		for (var i = 0; i < data.length; i++) {
			message += `<li><a href='/category/${data[i].Id}'>${data[i].Name}</a>`
	        printCategories(data[i]);
	        message += '</li>';
	    }
	}
}


$(function () {
	fetch('/home_tree')
	.then(res => res.json())
	.then(data => {
		printCategories(data);
		$('#category-ul').html(message);
			var categories = $('#category-ul > li');
			for (var i = 0; i < categories.length; i++) {
				categories[i].lastChild.classList.remove('closed');
			}
	});



	$('#category-ul').on('click', '.opener', function() {
		let elem = $(this);
		var cur_html = elem.html();
		if (cur_html == '+') {
			elem.html('-')
			elem.next().next().removeClass('closed');
		}
		else {
			elem.html('+')
			elem.next().next().addClass('closed');
		}
	});
});
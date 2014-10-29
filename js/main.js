'use strict';

/*	This file serves as the kickoff point for browserify
 */

// Backbone
require('Backbone');

// Drop in replacement for usage of localstorage
Backbone.LocalStorage = require('backbone.localstorage');

//********* Global modules *************

// Bootstrap
require('../bower_components/bootstrap-sass-official/assets/javascripts/bootstrap');

// Bootstrap-table
require('../bower_components/bootstrap-table/src/bootstrap-table');

// Notification engine
require('../bower_components/bootstrap.growl/dist/bootstrap-growl.min');

// Client-side template engine
require('../bower_components/mustache/mustache');

/**********
* Helper functions
**********/
function activateEdit () {
	$('.btn-edit').removeClass('disabled');
}
function deactivateEdit () {
	$('.btn-edit').addClass('disabled');
}
function activateRemove () {
	$('.btn-remove').removeClass('disabled');
}
function deactivateRemove () {
	$('.btn-remove').addClass('disabled');
}

var bsOptions = {
				search: true,
				showColumns: true,
				showToggle: true,
				striped: true,
				showHeader: true,
				cardView: false,
				clickToSelect: true, // Checkbox/Radio functionality
				columns: [	{field: 'state', radio: true},
							{field: 'id', title: 'Id'},
							{field: 'name', title: 'Name'},
							{field: 'email', title: 'Email'},
							{field: 'phone', title: 'Phone'}]
			};
var DeletePopup = require('./deletePopupView');
var FormPopup = require('./formPopupView');
var Employee = require('./employeeModel');
var Employees = require('./employeeCollection');

/**********
* Employees collection
**********/
var employees = new Employees();

employees.on('add', function (model, collection, typeObj) {
	$bsTable.bootstrapTable('append', model.toJSON());
});

/**********
* Definition of the table
**********/
var $bsTable = $('table.employees').bootstrapTable('destroy')
					.bootstrapTable(bsOptions)
					.on('check.bs.table', function (row, data) {
						// Activate the edit/remove buttons
						activateEdit();
						activateRemove();
					})
					.on('uncheck.bs.table', function (row) {
						deactivateEdit();
						deactivateRemove();
					});

// Initially hide the Id column
$bsTable.bootstrapTable('hideColumn', 'id');


/**********
* Button click events
**********/
$('.btn-add').on('click', function () {
	var form = new FormPopup({
		model: new Employee()
	});

	form.on('save', function (newEmp) {
		employees.add(newEmp);
	});
});

$('.btn-edit').on('click', function () {
	// Get what was selected
	var selection = $bsTable.bootstrapTable('getSelections')[0];

	// Launch popup with this data
	var form = new FormPopup({
		model: employees.get(selection.id)
	});

	// On save update the table
	form.on('save', function (newEmp) {
		employees.add(newEmp);

		$bsTable.bootstrapTable('updateRow', {
			index: $('table tr.selected').data('index'),
			row: newEmp
		})
	});
});

$('.btn-remove').on('click', function () {
	var deletePop = new DeletePopup();

	deletePop.on('confirmDeletion', function () {
		var selects = $bsTable.bootstrapTable('getSelections'),
            ids = $.map(selects, function (row) {
                return row.id;
            });

        $bsTable.bootstrapTable('remove', {
            field: 'id',
            values: ids
        });

		$.growl({message: 'Employee removed.'},
		{
			allow_dismiss: true,
			mouse_over: "pause",
			type: 'info'
		});


		deactivateEdit();
		deactivateRemove();
	});
});
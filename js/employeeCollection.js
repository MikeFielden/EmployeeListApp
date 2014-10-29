'use strict';

var employees = Backbone.Collection.extend({
	model: require('./employeeModel'),
	localStorage: new Backbone.LocalStorage("Employees"),
	sync: function () {
		// debugger;
	}
});

module.exports = employees;
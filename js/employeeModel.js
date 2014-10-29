'use strict';

var employee = Backbone.Model.extend({
	localStorage: new Backbone.LocalStorage("Employee"),

	defaults: {
		name: '',
		email: '',
		phone: ''
	},

	initialize: function () {
		this.set('id',this.cid);
	},

	validate: function () {
		var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if (this.get('name').length === 0) {
			return {
	    		input: '#txtName',
	    		message: 'Name is not valid'
	    	};
		}

	    if (!regex.test(this.get('email'))) {
	    	return {
	    		input: '#txtEmail',
	    		message: 'Email is not valid'
	    	};
	    }
	}
});

module.exports = employee;
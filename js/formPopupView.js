'use strict';

var getTemplate = function () {
		return [
		'<div class="modal-dialog">',
			'<div class="modal-content">',
				'<div class="modal-header">',
					'<button class="close" data-dismiss="modal">×</button>',
					'<h3>{{headerText}}</h3>',
				'</div>',
				'<div class="modal-body">',
					'<div>{{{bodyText}}}</div>',
				'</div>',
				'<div class="modal-footer">',
					'<a href="#" data-dismiss="modal" class="btn btn-default">Cancel</a>',
					'<a href="#" class="btn btn-success pull-right">',
						'<i class="fa fa-save"></i>',
						'Save</a>',
				'</div>',
			'</div>',
		'</div>'
		].join('');
	},
	getForm = function (model) {

		var form = [
			'<form class="clearfix" role="form">',

				'<div class="form-group clearfix">',
				  '<label class="control-label col-lg-3 required" for="txtName">Name</label>',
				  '<input id="txtName" name="name" type="text" placeholder="Johnny Appleseed" class="input-lg col-lg-8" value="{{name}}" required autofocus />',
				'</div>',

				'<div class="form-group clearfix">',
				  '<label class="control-label col-lg-3 required" for="txtEmail">Email</label>',
				  '<input id="txtEmail" name="email" type="text" placeholder="j.appleseed@apple.com" class="input-lg col-lg-8" value="{{email}}" required />',
				'</div>',

				'<div class="form-group clearfix">',
				  '<label class="control-label col-lg-3" for="txtPhone">Phone</label>',
				  '<input id="txtPhone" name="phone" type="text" placeholder="xxx-xx-xxxx" class="input-lg col-lg-8" value="{{phone}}"/>',
				'</div>',
			'</form>'
		].join('');


		return Mustache.to_html(form, model);
	};

var formView = Backbone.View.extend({
	tagName: "div",
	className: "modal fade",

	events: {
		'click .btn-success': 'save'
	},

	initialize: function () {
		this.options = {
			headerText: 'Add employee record',
			bodyText: getForm(this.model.toJSON())
		};

		if (!this.model) {
			throw new Error('Please provide a model to this view');
		}

		this.render();
	},

	render: function () {
		this.$el.append(Mustache.to_html(getTemplate(), this.options));

		this.$el.modal('show');

		return this;
	},

	save: function (evt) {

		this.model.set({
			name: this.$el.find('#txtName').val().trim(),
			email: this.$el.find('#txtEmail').val().trim(),
			phone: this.$el.find('#txtPhone').val().trim()
		});

		if (!this.model.isValid()) {

			// Show user message
			$.growl({
				message: this.model.validationError.message
			},
			{
				type: 'danger'
			});

			// Highlight the offender
			this.$el.find(this.model.validationError.input)
					.addClass('animated bounce')
					.parents('.form-group')
					.addClass('has-error');

			return;
		}


		this.trigger('save', this.model.toJSON());
		this.$el.modal('hide');
	}
});

module.exports = formView;
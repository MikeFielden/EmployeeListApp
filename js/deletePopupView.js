'use strict';

function getTemplate () {
	return [
	'<div class="modal-dialog">',
		'<div class="modal-content">',
			'<div class="modal-header">',
				'<button class="close" data-dismiss="modal">×</button>',
				'<h3>{{headerText}}</h3>',
			'</div>',
			'<div class="modal-body">',
				'<div>{{bodyText}}</div>',
			'</div>',
			'<div class="modal-footer">',
				'<a href="#" data-dismiss="modal" class="btn pull-left btn-no-delete">No.</a>',
				'<a href="#" class="btn btn-danger pull-right">{{deleteButtonText}}</a>',
			'</div>',
		'</div>',
	'</div>'
	].join('');
}

var confirmDeletePopup = Backbone.View.extend({
	tagName: "div",
	className: "modal fade",

	events: {
		'click .btn-danger': 'confirmDelete'
	},

	initialize: function () {
		this.options = {
			headerText: 'Remove employee',
			bodyText: 'Are you sure you want to remove this employee?',
			deleteButtonText: 'Yes remove them.'
		};

		this.$el.on('show', function () {
			this.trigger('show');
		}.bind(this))
		.on('hide', function () {
			this.trigger('hide');
		}.bind(this))
		.on('hidden', function () {
			this.trigger('hidden');
			this.remove();
		}.bind(this))
		.on('shown', function () {
			this.trigger('shown');
		}.bind(this));

		this.render();
	},

	render: function () {
		this.$el.append(Mustache.to_html(getTemplate(), this.options));

		this.$el.modal('show');

		return this;
	},

	confirmDelete: function (evt) {
		evt.preventDefault();

		this.trigger('confirmDeletion');

		this.$el.modal('hide');
	},

	show: function () {
		this.$el.modal('show');
	},

	hide: function () {
		this.$el.modal('hide');
	}

});

module.exports = confirmDeletePopup;
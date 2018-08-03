;
(function($) {
	var write = {
		init: function(obj, args) {
			if (args.updata) {
				var modal = '<div class="modal fade" id="' + args.id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
					'<div class="modal-dialog" role="document" style="width:' + args.width + ';">' +
					'<div class="modal-content">' +
					'<div class="modal-header">' +
					'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
					'<h4 class="modal-title" id="myModalLabel">' + args.title + '</h4>' +
					'</div>' +
					'<div class="modal-body">' +
					args.body +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>';
				$('body').append(modal);
				 
			} else {
				var modal = '<div class="modal fade" id="' + args.id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">' +
					'<div class="modal-dialog" role="document" style="width:' + args.width + ';">' +
					'<div class="modal-content">' +
					'<div class="modal-header">' +
					'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
					'<h4 class="modal-title" id="myModalLabel">' + args.title + '</h4>' +
					'</div>' +
					'<div class="modal-body">' +
					args.body +
					'</div>' +
					'<div class="modal-footer">' +
					'<button type="button" class="btn btn-default" data-dismiss="modal">' + args.footerDefault + '</button>' +
					'<button id="' + args.btnPrimaryId + '" type="button" class="btn btn-primary" data-dismiss="modal">' + args.footerPrimary + '</button>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'</div>';
				$('body').append(modal);
			};
		}
	};
	$.fn.art = function(options) {
		var args = $.extend({}, {
			id: 'mymodal',
			title: 'Modal title',
			body: '...',
			footerDefault: 'Close',
			footerPrimary: 'Save changes',
			width: '',
			updata: false,
			formContent: '',
			btnPrimaryId: 'hehe',
			ajaxType: 'get',
			ajaxUrl: 'json/data.json'
		}, options);
		write.init(this, args);
		return this;
	};
})(jQuery);
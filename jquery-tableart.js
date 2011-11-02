/**
 * TableArt
 * 
 * テーブルアートを生成するjQuery Plugin。
 * 
 * MITライセンスに準拠する。 - http://www.opensource.org/licenses/mit-license.php
 * 
 * @author dai1741
 * @version 0.0
 * @see http://
 */

(function($) {
	jQuery.fn.tableArt = function(img) {
		var width, height;
		// var origWidth = img.width, origHeight = img.height;
		// img.removeAttribute("width");
		// img.removeAttribute("height");
		width = img.naturalWidth;
		height = img.naturalHeight;
		// img.width = origWidth;
		// img.height = origHeight;

		if (width * height >= 80000) {
			if (!confirm('Image is way too big! Are you ok to create a huge table art?')) {
				return this;
			}
		}

		return this.each(function() {
			var self = $(this);
			var canvas = $(
					'<canvas width="' + width + '" height="' + height
							+ '"></canvas>').appendTo(self);
			var context = canvas[0].getContext('2d');
			context.drawImage(img, 0, 0);

			var table = $(
					'<table width="' + width + '" height="' + height
							+ '"></table>', {
						className : 'tableArt'
					}).css({
				tableLayout : 'fixed',
				borderCollapse : 'collapse',
				borderSpacing : 0,
				width : width,
				height : height
			});
			var imageData = context.getImageData(0, 0, width, height);
			var tdCreateStr = '<td width="1" height="1"></td>';
			var tdCssProperties = {
				width : 1,
				height : 1,
				margin : 0,
				padding : 0
			};
			for ( var y = 0; y < width; y++) {
				var tr = $('<tr/>').appendTo(table);
				for ( var x = 0; x < width; x++) {
					var td = $(tdCreateStr).css(tdCssProperties).css('backgroundColor', '#000000').appendTo(tr);
				}
			}
			table.appendTo(self);
		});
	};
}(jQuery));
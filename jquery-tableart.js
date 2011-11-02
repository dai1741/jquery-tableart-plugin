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
	jQuery.fn.tableArt = function(img, imageTooBigHandler) {
		var width, height;
		// var origWidth = img.width, origHeight = img.height;
		// img.removeAttribute("width");
		// img.removeAttribute("height");
		width = img.width;
		height = img.height;
		// img.width = origWidth;
		// img.height = origHeight;

		if (width * height >= 80000) {
			if (!imageTooBigHandler.call(this, width * height)) {
				return this;
			}
		} else if (width * height <= 0)
			return this;

		return this
				.each(function() {
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
					var pixelArray = context.getImageData(0, 0, width, height).data;
					canvas.hide();

					var tableStr = '<table width="'
							+ width
							+ '" height="'
							+ height
							+ '" style="table-layout: fixed; border-collapse: collapse; '
							+ 'border-spacing: 0px; width: 85px; height: 70px;"><tbody>';

					for ( var y = 0; y < width; y++) {
						tableStr += '<tr>';
						for ( var x = 0; x < width; x++) {
							var i = (y * width + x) * 4;
							tableStr += '<td width="1" height="1" style="width: 1px; height: 1px; '
									+ 'margin: 0px; padding: 0px; '
									+ 'background-color: rgb('
									+ pixelArray[i]
									+ ','
									+ pixelArray[i + 1]
									+ ', '
									+ pixelArray[i + 2] + ');"></td>';
						}
						tableStr += '</tr>';
					}
					tableStr += '</tbody></table>';

					self.html(tableStr);
				});
	};
}(jQuery));
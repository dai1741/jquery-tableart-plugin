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
	var defaultParams = {
		imageTooBigHandler : function(self, size) {
			return confirm('Image is way too big! Are you ok to create a huge table art?');
		},
		allowedImageVolume : 80000,
		hasSrc : true,
		srcCols : 80,
		srcRows : 30,
	};
	var extendedParams;
	jQuery.fn.tableArt = function(img, params) {
		extendedParams = $.extend(defaultParams, params);

		var width = img.width;
		var height = img.height;

		if (width * height >= extendedParams.allowedImageVolume) {
			if (typeof extendedParams.imageTooBigHandler == 'function'
					&& !extendedParams.imageTooBigHandler.call(this, width
							* height)) {
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
					var pixelArray = context.getImageData(0, 0, width, height).data;
					canvas.hide();

					var tableStr = '<table width="'
							+ width
							+ '" height="'
							+ height
							+ '" cellpadding="0" style="table-layout: fixed; '
							+ 'border-collapse: collapse; border-spacing: 0px;"><tbody>\n';

					for ( var y = 0; y < height; y++) {
						tableStr += '<tr>\n';
						for ( var x = 0; x < width; x++) {
							var i = (y * width + x) * 4;
							tableStr += '<td width="1" height="1" style="background-color: rgba('
									+ pixelArray[i]
									+ ','
									+ pixelArray[i + 1]
									+ ','
									+ pixelArray[i + 2]
									+ ','
									+ pixelArray[i + 3] + ');"></td>\n';
						}
						tableStr += '</tr>\n';
					}
					tableStr += '</tbody></table>';

					$('<div class="tableart-artholder"></div>').html(tableStr)
							.appendTo(self);

					if (extendedParams.hasSrc) {
						$(
								'<textarea class="tableart-src" cols="'
										+ extendedParams.srcCols + '" rows="'
										+ extendedParams.srcRows
										+ '"></textarea>').val(tableStr)
								.appendTo(self);
					}
				});
	};
}(jQuery));
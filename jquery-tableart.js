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
		complete : function(table, src) {
		},
		imagebig : function(size) {
			return confirm('Image is way too big! Are you ok to create a huge table art?');
		},
		error : function(errorMessage, errorCode) {
		},
		draw : true,
		allowedImageVolume : 80000,
	};
	var extendedParams;
	jQuery.fn.tableArt = function(img, params) {
		extendedParams = $.extend(defaultParams, params);

		if (!img.src || !img.width || !img.height) {
			if (img.jquery && img.length > 0) {
				return arguments.callee.call(this, img[0], params);
			} else {
				extendedParams.error("Invalid param", 1);
				return this;
			}
		}

		var width = img.width;
		var height = img.height;

		if (width * height >= extendedParams.allowedImageVolume) {
			if ($.isFunction(extendedParams.imagebig)
					&& !extendedParams.imagebig.call(this, width * height)) {
				return this;
			}
		} else if (width * height <= 0) {
			extendedParams.error("Invalid resolution", 1);
			return this;
		}

		return this
				.each(function() {
					var self = $(this);
					var canvas = $('<canvas width="' + width + '" height="'
							+ height + '"></canvas>');
					var context = canvas[0].getContext('2d');
					context.drawImage(img, 0, 0);
					try {
						if (!context.getImageData) {
							extendedParams.error(
									"context.getImageData() is not available",
									2);
							return;
						}
						var imageData = context.getImageData(0, 0, width,
								height);
						var pixelArray = imageData.data;
					} catch (e) {
						extendedParams
								.error(
										"context.getImageData() has encountered security exception",
										3);
						return;
					}

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

					if (extendedParams.draw) {
						var tableHolder = $(
								'<div class="tableart-artholder"></div>').html(
								tableStr).appendTo(self);
					}

					setTimeout(function() {
						if ($.isFunction(extendedParams.complete)) {
							extendedParams.complete.call(self[0],
									extendedParams.draw ? tableHolder
											.find('table')[0] : null, tableStr)
						}
					}, 1);
				});
	};
}(jQuery));
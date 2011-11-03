/**
 * TableArt
 * 
 * テーブルアートを生成するjQuery Plugin。
 * 
 * MITライセンスに準拠する。
 *  - http://www.opensource.org/licenses/mit-license.php
 * 
 * @author dai1741
 * @version 0.0
 * @see http://
 */

(function($) {
	/** パラメータの初期値。 */
	var defaultParams = {
		/**
		 * テーブルアートの生成が成功したときに実行されるコールバック関数。
		 * 
		 * @param table 生成されたテーブルアートのtable要素を示すDOMオブジェクト
		 * @param src このテーブルアートを生成するためのhtmlソース
		 */
		complete : function(table, src) {
		},
		
		/**
		 * 画像が大きすぎるときに実行されるコールバック関数。
		 * 
		 * @param size ピクセル単位の画像の面積
		 * @return テーブルアートの生成を続けるかどうかを決める真偽値。trueなら処理を続行し、falseなら終了する。
		 * 			falseを返したときにparams.complete()は実行されない。
		 */
		imagebig : function(size) {
			return confirm('Image is way too big! Are you ok to create a huge table art?');
		},
		
		/**
		 * テーブルアートの生成に失敗したときに実行されるコールバック関数。
		 * 
		 * @param errorMessage エラー内容を示す文章
		 * @param errorCode エラー内容を示す整数値。
		 * 			1: 入力の画像が不正
		 * 			2: context.getImageData()が使用不可
		 * 			3: キャンバスのピクセルデータを取得する権限がない
		 */
		error : function(errorMessage, errorCode) {
		},
		
		/** テーブルアートを描画するかどうか */
		draw : true,
		
		/** 
		 * テーブルアートをquietに生成できる最大の画像面積。
		 * この数値以上の場合params.imagebig()を実行する。 
		 */
		allowedImageVolume : 80000,
	};
	
	/**
	 * テーブルアートを生成し、この要素の末尾に追加する。
	 * 
	 * @param img 画像。Imageオブジェクトか、img要素のDOMオブジェクトか、
	 * 			img要素のDOMオブジェクトを1つ持つjQueryオブジェクト
	 * @param params 拡張用のパラメータ
	 * @return このjQueryオブジェクト
	 */
	jQuery.fn.tableArt = function(img, params) {
		var extendedParams = $.extend(defaultParams, params);

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
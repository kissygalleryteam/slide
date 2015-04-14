modulex.add(function (require, exports, module) {
	module.exports = {
		// 检测浏览器是否支持pagevisivility并读取document的hidden值，不同浏览器可能需要前缀，如webkitHidden
		getHiddenProp: function () {
			// 如果支持'hidden'就直接返回
			if ('hidden' in document)
				return 'hidden';
			// 否则检查前缀，看是否有支持属性
			var prefixes = [
				'webkit',
				'moz',
				'ms',
				'o'
			];
			for (var i = 0; i < prefixes.length; i++) {
				if (prefixes[i] + 'Hidden' in document)
					return prefixes[i] + 'Hidden';
			}
			// 没有检测到返回null，表示不支持pagevisivility
			return null;
		},
		// 当前页面是否隐藏
		isHidden: function () {
			var prop = this.getHiddenProp();
			if (!prop)
				return false;
			return document[prop];
		},
		isUndefined: function(val){
			return val === undefined;
		},
		isNull: function(val){
			return val === null;
		}
	};
});
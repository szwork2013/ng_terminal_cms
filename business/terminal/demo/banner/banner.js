/**
 * Created by Ivan on 2015/10/14.
 */
angular.module('cms').controller('TerminalDemoBannerCtrl', function ($scope, $timeout, Constant) {
	var flashvars = {
		/**
		 * [data 广告数据]
		 * @type {Array}
		 */
		data: [{
			totalTime: 4,
			url: 'http://127.0.0.1:8088/terminal_static/business/terminal/demo/banner/test1.png',
			type: 'img',
			desc: ''
		}, {
			totalTime: 4,
			url: 'http://127.0.0.1:8088/terminal_static/business/terminal/demo/banner/test2.png',
			type: 'img',
			desc: ''
		}],
		/**
		 * [mode 播放方式]
		 * {
      "auto": "自动播放",
      "unauto": "手动播放",
      "default": "默认(自动+手动)"
    }
		 * @type {String}
		 */
		mode: 'default',
		/**
		 * [effect 轮播效果]
		 * {
      "scrollLeft": "水平滚动",
      "fadeOut": "淡入淡出"
    }
		 * @type {String}
		 */
		effect: 'scrollLeft',
		/**
		 * [loop 循环方式]
		 * {
      "loop": "左右来回循环",
      "unloop": "单项点击无限循环"
    }
		 * @type {String}
		 */
		loop: 'unloop',
		name: 'banner3'
	}, bbb = {
		/**
		 * [data 广告数据]
		 * @type {Array}
		 */
		data: [{
			totalTime: 15,
			url: 'http://localhost/test.mp4',
			type: 'video',
			desc: ''
		}, {
			totalTime: 4,
			url: 'http://127.0.0.1:8088/terminal_static/business/terminal/demo/banner/test1.png',
			type: 'img',
			desc: ''
		}, {
			totalTime: 4,
			url: 'http://127.0.0.1:8088/terminal_static/business/terminal/demo/banner/test2.png',
			type: 'img',
			desc: ''
		}, {
			totalTime: 15,
			url: 'http://localhost/test.mp4',
			type: 'video',
			desc: ''
		}],
		"mode": "default",
		effect: 'scrollLeft',
		loop: 'unloop',
		name: 'banner9'
	};
	// flashvars="ads=' + encodeURI(JSON.stringify(flashvars)) + '"
/*	var obj = $('#player1').attr('flashvars', 'ads=' + encodeURI(JSON.stringify(flashvars))),
		objParent = obj.parent();
	$('#player1').remove();
	objParent.append(obj);

	flashvars.name = 'banner9';
	var obj2 = $('#player12').attr('flashvars', 'ads=' + encodeURI(JSON.stringify(flashvars))),
		obj2Parent = obj2.parent();
	$('#player12').remove();
	obj2Parent.append(obj2);*/

	$scope.aaa = flashvars;

	//bbb = {
	//	"data": [{
	//		totalTime: 15,
	//		url: 'http://localhost/test.mp4',
	//		type: 'video',
	//		desc: ''
	//	}, {
	//		"totalTime": 4,
	//		"url": "http://127.0.0.1:8088/terminal_static/business/terminal/demo/banner/test1.png",
	//		"type": "img",
	//		"desc": ""
	//	}, {
	//		"totalTime": 4,
	//		"url": "http://127.0.0.1:8088/terminal_static/business/terminal/demo/banner/test2.png",
	//		"type": "img",
	//		"desc": ""
	//	}],
	//	"mode": "default",
	//	"effect": "scrollLeft",
	//	"loop": "unloop",
	//	"name": "banner1"
	//};

	$scope.bbb = bbb;
	window.onBanner = function(name, event, data) {
		console.log([name, event, data]);
	};
	//console.log($scope.flashvars);
});
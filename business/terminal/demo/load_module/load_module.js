/**
 * Created by Ivan on 2015/9/21.
 */
angular.module('cms')
    .controller('TerminalDemoLoadModuleCtrl', function ($scope, $rootScope, Constant) {

        $scope.name = 'test1';

        $scope.setValue = function (key, val) {
            $scope[key] = val;
        };

        $scope.module = {
            test1: {
                "name": "test1",
                "controller": "PluginTest1Ctrl"
            },
            ad1: {
                "name": "ad1",
                "type": "ad",
                "config": {
                    "num": [1, 2, 3, 4],
                    "mode": {
                        "auto": "自动播放",
                        "unauto": "手动播放",
                        "default": "默认(自动+手动)"
                    },
                    "effect": {
                        "scrollLeft": "水平滚动",
                        "fadeOut": "淡入淡出"
                    },
                    "interval": [4, 5, 6, 7, 8, 9, 10],
                    "loop": {
                        "loop": "左右来回循环",
                        "unloop": "单项点击无限循环"
                    }
                },
                "data": {
                    "setting": {
                        "mode": "auto",
                        "effect": "scrollLeft",
                        "interval": "4",
                        "loop": "loop"
                    },
                    "data": [{
                        "type": "video",
                        "adress": "htttp://fasfa.com/d/logo.jpg",
                        "logo": "htttp://fasfa.com/d/logo.jpg",
                        "bgimage": "htttp://fasfa.com/d/bgimage.jpg",
                        "item": "1,3,5",
                        "link": "htttp://fasfa.com"
                    }, {
                        "type": "image",
                        "adress": "htttp://fasfa.com/d/logo.jpg",
                        "logo": "htttp://fasfa.com/d/logo.jpg",
                        "bgimage": "htttp://fasfa.com/d/bgimage.jpg",
                        "item": "1,3,5",
                        "link": "htttp://fasfa.com"
                    }]
                },
                "controller": "PluginAd1Ctrl"
            },
            info1: {
                "name": "info1",
                "type": "info",
                "display_type": "基本信息",
                "config": {
                    "show": ["1", "2", "3", "4"],
                    "city": ["上海", "北京"],
                    "pic": {
                        "width": 40,
                        "height": 40
                    },
                    "baseInfo": {
                        "weather": "天气",
                        "temperature": "温度"
                    }
                },
                "controller":"PluginAd2Ctrl"
            }

        };
        
    })

/*    .controller('PluginTest1', function($scope, SettingService) {
        console.log('plugin-test1');
        $scope.test = "plugin-test1";

        $scope.$on('onInit', function(e, data) {
            //debugger;
            SettingService.getModuleInfo(data).then(function(json) {
                console.log(json);
            });
        });

        //$scope.$on('init', function(mass) {
        //    console.log(['init', mass]);
        //});
    })

    .controller('PluginAd1', ['$scope', function ($scope) {
        console.log('plugin-ad1');
        $scope.test = "plugin-ad1";
    }])

    .controller('PluginAd2', ['$scope', function ($scope) {
        console.log('plugin-ad2');

        $scope.test = "plugin-ad2";
    }])*/;
/**
 * @file 模块主控制器，商家系统＝》互动屏管理
 * @author zhaoran
 * @date 2015-09-15
 */

angular.module('cms').controller('TerminalCtrl', function ($scope, $rootScope, Constant) {

    $rootScope.sidebarMenu = [
        {
            "title": "内容管理",
            "key": "content",
            "children": [
                {
                    "title": "模版列表",
                    "key": "list"
                },
                {
                    "title": "优惠配置",
                    "key": "coupon"
                }
            ]
        },
        {
            "title": "广告管理",
            "key": "ad"
        },
        {
            "title": "数据维护",
            "key": "data"
        }
    ];


    $rootScope.baseKey = 'cms.terminal';

});
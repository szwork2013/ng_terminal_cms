/**
 * @file 路由模块
 * @author zhaoran
 * @date 2015-06-03
 */


require('business/terminal/router');
require('business/modules/router');
// require('business/activity/router');
// require('business/cms/router');
// require('business/member/router');





angular.module('cms').config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider
        .when('/cms', '/cms/terminal')
        .otherwise('/cms');


    //$locationProvider.html5Mode(true);

    $stateProvider
        .state('cms', {
            abstarct: true,
            url: '/cms',
            template: '<div ui-view pos="cms"></div>',
            controller: 'CmsCtrl',
            resolve: {
                userinfoJson: function(userinfoService){
                    //return userinfoService.get();
                }
            }
        });


});

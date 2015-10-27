/**
 * @file 程序入口
 * @author zhaoran
 * @date 2015-06-03
 */

// 声明angular依赖
angular.module('cmsDirective', 
    [
        'ui.router'
    ]);

angular.module('cmsService', []);

angular.module('plugin', ['infinite-scroll']);

angular.module('cms', 
    [
        'cmsDirective',
        'cmsService',
        'ui.bootstrap', 
        'ui.router',
        'ngTouch',
        'ngCookies', 
        'ngSanitize',
        'ngAnimate',
        'ngFileUpload',
        'daterangepicker',
        'ngLocale',
        'plugin'
    ]);
 
require('services/constant');
require('services/userinfo');
require('services/cms_interceptor');
require('services/filters');
// 引用全局指令模块，会自动引用同目录下同名css文件
require('directives/sidebar');
require('directives/crumb');
require('directives/mytab');
require('directives/stepmark');
require('directives/max_length');

require('directives/dialog');
require('directives/login');


// 引用路由模块
require('main/router');

angular.module('cms').config(function ($provide) {

    $provide.decorator('$q', function ($delegate) {
        var defer = $delegate.defer;
        $delegate.defer = function () {
            var deferred = defer();

            deferred.promise.success = function (fn) {

                deferred.promise.then(function(response) {
                    fn(response);
                });
                return deferred.promise;
            };

            deferred.promise.error = function (fn) {
                deferred.promise.then(null, function(response) {
                    fn(response);
                });
                return deferred.promise;
            };

            return deferred;
        };

        return $delegate;
    });

});
 

angular.module('cms').config(function($httpProvider){
    $httpProvider.interceptors.push('cmsInterceptor');
});

// 主控制器
angular.module('cms').controller('MainCtrl', function($scope){
    // $scope.username = '沉默的羔羊';
    // $scope.roleName = "神秘人士";
})
.controller('CmsCtrl', function($rootScope, $scope, Constant, userinfoJson, logoutService, userinfoService){
    //var result = userinfoJson.result;

    //$rootScope.userinfo = result;
    //Constant.userinfo = result;

    $rootScope.back = function(){
        window.history.back();
    }

    $rootScope.getArray = function(length){
        return new Array(length);
    };

    $rootScope.logout = function(){
        // $rootScope.userinfo = null;
        // Constant.userinfo = null;   
        logoutService.post()
            .success(function(){
                $rootScope.userinfo = null;
                Constant.userinfo = null;

                //userinfoService.get()
                //    .success(function(json){
                //        $rootScope.userinfo = json.result;
                //        Constant.userinfo = json.result;
                //    });
            });
    }
});
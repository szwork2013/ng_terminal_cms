/**
 * @file 用户信息服务
 * @author zhaoran
 * @date 2015-07-20
 */

angular.module('cmsService').factory('userinfoService', function($http, $q, Constant, $cookies){

    return {
        get: function(){
            var url = '/easy-roa/v1/user/getRyUser';

            var deferred = $q.defer();

            // $http({
            //     url: url,
            //     method: 'GET'
            // }).success(function(json){
            //     console.log(json);
            //     deferred.resolve(json);
            // });
            
            // then 和 success 参数不同
            // then 的参数是 response
            // success 的参数是 response.data
            $http.post(url, {
                ryst: $cookies.get('RYST'),
                channel: '002'
            })
            .success(function(json){
                deferred.resolve(json);
            })

            return deferred.promise;
        }
    };
})
.factory('loginService', function($http, $q){

    return {
        post: function(params){
            var url = '/public/login';

            var deferred = $q.defer();

            // $http({
            //     url: url,
            //     method: 'POST',
            //     data: {
            //         data: params
            //     }
            // }).then(function(json){
            //     console.log(json);
            //     deferred.resolve(json);
            // });

            $http.post(url, {
                data: params
            })
            .success(function(json){
                deferred.resolve(json);
            })

            return deferred.promise;
        }
    };
})
.factory('logoutService', function($http, $q){

    return {
        post: function(){
            var url = '/public/logout';

            var deferred = $q.defer();

            // $http({
            //     url: url,
            //     method: 'POST',
            //     data: {
            //         data: params
            //     }
            // }).then(function(json){
            //     console.log(json);
            //     deferred.resolve(json);
            // });

            $http.post(url)
            .success(function(json){
                deferred.resolve(json);
            })

            return deferred.promise;
        }
    };
});
/**
 * Created by dulin on 2015/10/19.
 */
angular.module('cmsService').factory('couponService',
    function ($http, $log, $q) {

        function http(url, params, errMsg) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: url,
                params: params
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject(errMsg);
            });

            return deferred.promise;
        }

        return {

            getCouponList: function (params) {
                var url = '/api/preferential/list';
                return http(url, params, '请求优惠信息列表出错');
            },

            getCouponInfo: function (params) {
                var url = '/api/preferential/info';
                return http(url, params, '请求优惠信息详情出错');
            },

            createCoupon: function (params) {
                var url = '/api/preferential/add';
                return http(url, params, '新建优惠信息出错');
            },

            updateCoupon: function(params) {
                var url = '/api/preferential/update';
                return http(url, params, '更新优惠信息出错');
            },

            stopCoupon: function(params) {
                var url = '/api/preferential/delete';
                return http(url, params, '删除优惠信息出错');
            }
        }
    });
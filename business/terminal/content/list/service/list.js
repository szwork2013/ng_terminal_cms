angular.module('cmsService').provider('ListService', function () {

    this.$get = function ($http, $q, $log) {
        /**
         * 方案列表请求
         * @param datas mall_id    商场id    必选
         *                page    页数    可选，默认1
         *                page_size    页面大小    可选，默认20
         *
         * @returns {*}
         */
        var getCaseList = function (datas) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/api/case/list',
                params: datas
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('获取方案列表出错，请重试');
            });
            return deferred.promise;
        };

        /**
         * 方案创建请求
         * @param datas
         *
         * mall_id    商场id    必选
         * layout_name    布局名称    必选
         * color    色系    必选string
         * tag    风格    必选string
         * direction    版式    必选
         *
         * @returns {*}
         */
        var createTpl = function (datas) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/api/case/create',
                params: datas
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('创建方案出错，请重试');
            });
            return deferred.promise;
        };

        /**
         * 方案删除请求
         * @param datas mall_id 商城ID, case_id 方案ID
         * @returns {*}
         */
        var deleteCase = function (datas) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/api/case/delete',
                params: datas
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('删除方案出错，请重试');
            });
            return deferred.promise;
        };


        /**
         * 方案启用请求
         * @param datas
         * @returns {*}
         */
        var enable = function (datas) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/api/case/startup',
                params: datas
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error.msg);
            });
            return deferred.promise;
        };

        /**
         * 方案发布请求
         * @param datas
         * @returns {*}
         */
        var releaseCase = function (datas) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/api/case/publish',
                params: datas
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function (error) {
                deferred.reject(error.msg);
            });
            return deferred.promise;
        };

        return {
            getCaseList: getCaseList,
            deleteCase: deleteCase,
            releaseCase: releaseCase,
            enable: enable,
            createTpl: createTpl
        }
    }
});
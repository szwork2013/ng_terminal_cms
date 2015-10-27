/**
 * Created by dulin on 2015/9/18.
 */
angular.module('cmsService').factory('FilterService',
    function ($http, $q, $log, Dialog) {

        /**
         * 获取筛选条件数据
         * @param mallId
         * @returns {*}
         */
        var getFilterData = function (mallId) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/api/layout/filter',
                params: {
                    mall_id: 1
                }
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('加载筛选条件失败');
            });
            return deferred.promise;
        };

        /**
         * 转换筛选条件数据
         * @param data 后台来的原始筛选条件数据
         * @returns {*} 构造好的新筛选条件数据
         */
        var transformFilterData = function (data) {
            var result = data.result,
                tags = [],
                directions = [];
            angular.forEach(result, function (value, key, self) {
                if (key === 'tag') {
                    angular.forEach(value, function (v, k, s) {
                        tags.push({
                            enTxt: k,
                            cnTxt: v
                        });
                    });
                    result.tag = tags;
                }
                if (key === 'direction') {
                    angular.forEach(value, function (v, k, s) {
                        directions.push({
                            enTxt: k,
                            cnTxt: v
                        });
                    });
                    result.direction = directions;
                }
            });
            return data;
        };

        /**
         * 获取默认筛选条件
         * @param dataTrans 如果是筛选条件数据，则有默认筛选条件；如果不传筛选条件数据，则没有默认筛选条件。
         * @returns {{tagFilter: *, directionFilter: *, colorFilter: string}}
         * 版式，色系，风格筛选条件
         */
        var getInitFilterActive = function (dataTrans) {
            var result = dataTrans ? dataTrans.result : '',
                tagActive = result ? result.tag[0].enTxt : '',
                directionActive = result ? result.direction[0].enTxt : '',
                colorActive = result ? 'white' : '';
            return {
                tagFilter: tagActive,
                directionFilter: directionActive,
                colorFilter: colorActive
            }
        };

        /**
         * 获取自定义模版列表
         * @param datas  筛选条件，商家ID等数据
         * @returns {*} 请求promise;
         */
        var getLayoutList = function (datas) {
            var deferred = $q.defer();
            $http({
                method: 'POST',
                url: '/api/layout/list',
                params: datas
            }).success(function (data) {
                deferred.resolve(data);
            }).error(function () {
                deferred.reject('加载自定义布局列表失败');
            });
            return deferred.promise;
        };

        /**
         * 验证模版名称合法性
         * @param form 模版名称表单
         * @returns {boolean} 不合法返回false
         */
        var validateCaseName = function (form) {
            var caseName = form.caseName;
            if (caseName.$error.required) {
                Dialog.alert(null, '请输入模版名称');
                return false;
            } else if(caseName.$error.maxlength) {
                Dialog.alert(null, '模版名称过长，16个汉字或者32个英文字符内');
                return false;
            } else if(form.$valid) {
                return true;
            }
        };

        var validateFilter = function(filterObj) {
            if(!filterObj.color) {
                Dialog.alert(null, '请选择模版配色');
                return false;
            } else if(!filterObj.tag) {
                Dialog.alert(null, '请选择模版风格');
                return false;
            } else if(!filterObj.direction) {
                Dialog.alert(null, '请选择模版版式');
                return false;
            } else {
                return true;
            }
        };

        return {
            getFilterData: getFilterData,
            transformFilterData: transformFilterData,
            getInitFilterActive: getInitFilterActive,
            getLayoutList: getLayoutList,
            validateCaseName: validateCaseName,
            validateFilter: validateFilter
        }
    }
);
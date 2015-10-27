/**
 * Created by dulin on 2015/10/9.
 */
angular.module('cmsService').factory('EditService',
    function ($log, $http, $q) {
        return {
            transformSettingData: function(caseInfo) {
                var data = [],
                    settingData = caseInfo.setting,
                    config = caseInfo.config;
                angular.forEach(settingData, function(val, key) {
                    if(key === 'direction') {
                        data.push({
                            text: '已选择版式：',
                            direction: val
                        });
                    }
                    if(key === 'color') {
                        angular.forEach(config.color, function(v, k) {
                            if(val === k) {
                                data.push({
                                    text: '已选择配色：',
                                    enColorName: val,
                                    cnColorName: v.name
                                });
                            }
                        });
                    }
                    if(key === 'tag') {
                        angular.forEach(config.tag, function(v, k) {
                            if(val === k) {
                                data.push({
                                    text: '已选择风格：',
                                    enTagName: val,
                                    cnTagName: v
                                });
                            }
                        });
                    }
                });
                return data;
            },

            getCaseInfo: function(params) {
                var url = '/api/case/info';

                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: url,
                    params: params
                })
                .success(function (data) {
                    deferred.resolve(data);
                }).error(function () {
                    deferred.reject('获取数据出错，请重试');
                });

                return deferred.promise;
            }
        }
    });
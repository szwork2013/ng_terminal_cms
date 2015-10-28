/**
 * @file 设置信息
 * @author zhaoran
 * @date 2015-09-19
 */

angular.module('cmsService').factory('SettingService',
    function ($http, $q, Constant, $cookies, Upload, $log, Dialog) {

        var getAllModules = function (settings) {
            var modules = {};
            angular.forEach(settings, function (val) {
                angular.forEach(val, function (v, k) {
                    modules[k] = v;
                    if (!v['name']) {
                        v['name'] = k;
                    }
                });
            });
            return modules;
        };

        var param = function (obj) {
            var query = "", name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + "[" + i + "]";
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + "&";
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + "[" + subName + "]";
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + "&";
                    }
                } else if (value !== undefined && value !== null) {
                    query += encodeURIComponent(name) + "=" + encodeURIComponent(value) + "&";
                }
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };

        return {
            getFloorData: function (params) {
                var url = '/api/mall/floor';
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: url,
                    params: params
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function () {
                    deferred.reject('获取楼层数据出错，请重试');
                });

                return deferred.promise;
            },


            getFacilityDefaultIcon: function () {
                var url = '/api/case/facility/icon/default';
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: url
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function () {
                    deferred.reject('获取默认公共设施图标出错，请重试');
                });

                return deferred.promise;
            },

            setFloorSettingInitialData: function (floorData, buildingConfig) {
                var data = {
                    show: 1,
                    merchantType: 'single',
                    logoKey: 'default',
                    customLogos: [],
                    specificLogoGroup: 'default1',
                    buildingList: angular.copy(floorData),
                    activeFloor: null
                };

                var merchant_show_rule = _.mapObject(angular.copy(buildingConfig.merchant_show_rule),
                    function () {
                        return '';
                    });

                var values, ids;

                angular.forEach(data.buildingList, function (building, index) {
                    angular.forEach(building.floors, function (floor, index, floors) {
                        floors[index] = {
                            id: index,
                            name: floor,
                            cnName: '',
                            enName: '',
                            isNameShow: false,
                            introductions: [],
                            first_screen_merchant_rule: 'default',
                            recommend_merchants: [{}, {}, {}],
                            custom_first_screen_merchants: [{}],
                            public_facilities: null
                        };
                        for (var i = 0; i < 6; i++) {
                            floors[index].introductions.push({
                                id: i,
                                data: ''
                            });
                        }
                    });

                    values = _.values(building.floors);
                    ids = _.pluck(building.floors, 'id');
                    delete building.floors;
                    building.floors = _.object(ids, values);

                    angular.extend(building, {
                        nameKey: 'dong',
                        name: '',
                        title: '',
                        isExpand: !index,
                        merchant_sort: 'latest_time',
                        isShow: false,
                        merchant_show_rule: angular.copy(merchant_show_rule)
                    });
                });

                values = _.values(data.buildingList);
                ids = _.pluck(data.buildingList, 'id');
                data.buildingMap = _.object(ids, values);
                delete data.buildingList;

                $log.info('settingInitData:', data);
                return data;
            },

            getModuleInfo: function (params) {
                var url = '/api/case/module/info';

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
            },

            getMallInfo: function (params) {
                var url = '/api/mall/info',
                    deferred = $q.defer();
                $http.post(url, params)
                    .success(function (json) {
                        deferred.resolve(json);
                    }).error(function () {
                        deferred.reject('请求商场信息出错');
                    });

                return deferred.promise;
            },

            /**
             * 获取方案-页面-配置信息
             * @param params
             * @returns {*}
             */
            getCasePageConfig: function (params) {
                var url = '/api/case/page/config',
                    deferred = $q.defer();
                $http.post(url, params)
                    .success(function (json) {
                        deferred.resolve(json);
                    }).error(function () {
                        deferred.reject('请求页面配置数据出错');
                    });

                return deferred.promise;
            },

            /**
             * 获取方案-页面-所有模块
             * @param params
             * @returns {*}
             */
            getCasePageModuleAll: function (params) {
                var deferred = $q.defer(),
                    url = '/api/case/page/module/all';
                $http.post(url, params)
                    .success(function (data) {
                        deferred.resolve(data);
                    }).error(function () {
                        deferred.reject('请求页面所有模块数据出错');
                    });
                return deferred.promise;
            },

            getModulesByBlockName: function (blockName) {
                var caseConfig = this,
                    blockModuleMap = caseConfig.result.block_module,
                    moduleNames = blockModuleMap[blockName],
                    modules = caseConfig.result.modules,
                    moduleArr = [];
                angular.forEach(moduleNames, function (element, index) {
                    moduleArr.push(modules[element]);
                });
                return moduleArr;
            },

            upload: function ($files) {
                var $file = null,
                    error = null,
                    deferred = $q.defer();
                if ($files && $files.length) {
                    for (var i = 0; i < $files.length; i++) {
                        $file = $files[i];
                        error = $file.$error;
                        if (error === 'maxSize') {
                            Dialog.alert(null, '文件过大');
                            return;
                        } else if (error === 'pattern') {
                            Dialog.alert(null, '文件格式不正确');
                            return;
                        } else if (error === 'maxHeight') {
                            Dialog.alert(null, '文件高度不正确');
                            return;
                        } else if (error === 'maxWidth') {
                            Dialog.alert(null, '文件宽度不正确');
                            return;
                        } else {
                            Upload.upload({
                                url: '/api/upload/front',
                                method: 'POST',
                                file: $file,
                                fields: {
                                    mall_id: 1
                                }
                            }).success(function (data) {
                                deferred.resolve(data);
                            }).error(function () {
                                deferred.reject('文件上传失败');
                            });
                            return deferred.promise;
                        }
                    }
                }
            },

            /**
             * 获取正在使用的方案名称
             * @param params {mall_id: 1}商场id
             * @returns {*}
             */
            getCaseUsing: function (params) {
                var url = '/api/case/using',
                    deferred = $q.defer();
                $http.post(url, params)
                    .success(function (json) {
                        deferred.resolve(json);
                    }).error(function () {
                        deferred.reject('请求正在使用的方案名称出错');
                    });
                return deferred.promise;
            },

            setModuleCheckBoxData: function (checkBoxData) {
                var obj = this;
                angular.forEach(checkBoxData, function (val, key) {
                    obj[key] = false;
                });
            },

            sortUp: function (el, arr) {
                var index = arr.indexOf(el);
                if (!index) return;
                arr.splice(index - 1, 0, arr.splice(index, 1)[0]);
            },

            sortDown: function (el, arr) {
                var index = arr.indexOf(el);
                if (index === arr.length) return;
                arr.splice(index + 1, 0, arr.splice(index, 1)[0]);
            },

            /**
             * 保存用户设置的方案-模块数据
             * @param datas
             * @returns {*}
             */
            saveUserSetting: function (datas) {
                datas.setting = angular.toJson(datas.setting);
                var deferred = $q.defer();
                $http({
                    method: 'POST',
                    url: '/api/case/page/module/set',
                    data: datas,
                    headers: {'Content-Type':'application/x-www-form-urlencoded'},
                    transformRequest: function(data) {
                        return angular.isObject(data) && String(data) !== "[object File]" ? param(data) : data;
                    }
                }).success(function (data) {
                    deferred.resolve(data);
                }).error(function (error) {
                    deferred.reject('方案设置保存失败');
                });
                return deferred.promise;
            },

            /**
             * 获取模块用户配置数据，如果还没有配置过数据，则设置默认数据给改模块
             * @param caseData
             * @param blockName
             * @param moduleName
             * @param settingScope
             * @param defaultData
             * @returns {*}
             */
            getModuleSetting: function (caseData, blockName, moduleName, settingScope, defaultData) {
                return (caseData.result[blockName] && caseData.result[blockName][moduleName])
                    ? caseData.result[blockName][moduleName]
                    : function () {
                    caseData.result[blockName] ? angular.noop() : caseData.result[blockName] = {};
                    caseData.result[blockName][moduleName] = defaultData;
                    settingScope.allModule = getAllModules(caseData.result);
                    return caseData.result[blockName][moduleName];
                }();
            },

            getSelectedModuleNameMap: function (caseData) {
                var result = caseData.result,
                    map = {};
                angular.forEach(result, function (val, key) {
                    angular.forEach(val, function (v, k) {
                        map[key] = k;
                    });
                });
                return map;
            },

            /**
             * 设置功能入口模块用户配置数据setting.type
             * @param originData
             */
            setFuncModuleCheckboxData: function (originData) {
                var settingType = this;
                angular.forEach(originData, function (func) {
                    settingType[func.enTxt] = false;
                });
            },

            /**
             * 获取品牌导购分类列表
             * @param params
             * @returns {*}
             */
            getShopCatg: function (params) {
                var url = '/api/shop/catg';
                var deferred = $q.defer();
                $http.post(url, params)
                    .success(function (json) {
                        deferred.resolve(json);
                    }).error(function () {
                        deferred.reject('请求品牌导购分类列表出错');
                    });
                return deferred.promise;
            },

            setShopCatgViewData: function (shopCatgs) {
                return angular.forEach(shopCatgs, function (el, index) {
                    el.isDefault = index === 0;
                    el.isExpand = false;
                    el.stickShops = [];
                    for (var i = 0; i < Constant.STICK_SHOP_COUNT; i++) {
                        el.stickShops.push({});
                    }
                });
            },

            /**
             * 获取品牌导购店铺列表
             * @param params
             * @returns {*}
             */
            getShopList: function (params) {
                var url = '/api/shop/list',
                    deferred = $q.defer();
                $http.post(url, params)
                    .success(function (json) {
                        deferred.resolve(json);
                    }).error(function () {
                        deferred.reject('请求店铺列表出错');
                    });
                return deferred.promise;
            },

            setSettingDataSelectedShopMap: function (catg, vmSelectedMap) {
                var selecteShopListMap = {};
                angular.forEach(catg.stickShops, function (obj) {
                    if (obj.id) {
                        vmSelectedMap[obj.id] = true;
                        selecteShopListMap[obj.id] = true;
                    }
                });
                angular.forEach(vmSelectedMap, function (val, id) {
                    if (!selecteShopListMap[id]) {
                        delete vmSelectedMap[id];
                    }
                });
            },

            /**
             * 从分类置顶店铺数组中，取出并复制置顶店铺数据，添加已选择字段（isSelected），push进分类shopList中
             * @param catgs
             * @returns {*}
             */
            setSelectedShopList: function (catgs) {
                var shop;
                angular.forEach(catgs, function (el, index) {
                    var shopList = catgs[index].shopList = [];

                    var selectedMap = catgs[index].selectedMap = {};

                    angular.forEach(el.stickShops, function (stickShop) {
                        if (stickShop.id) {
                            shop = angular.copy(stickShop);
                            shop.isSelected = true;
                            shopList.push(shop);
                            selectedMap[stickShop.id] = true;
                        }
                    });
                });
                return catgs;
            },

            getAllModules: getAllModules
        };
    })
;
/**
 * Created by dulin on 2015/10/12.
 */
angular.module('cms').controller('TerminalContentEditFloorFloorCtrl',
    function ($scope, $log, $stateParams, Dialog, caseData, caseConfig, SettingService, $modal, floorData, facilityDefaultIcon) {

        var settingScope = $scope.$parent.$parent,
            blockName = $stateParams.blockName,
            moduleName = $stateParams.moduleName,
            caseId = $stateParams.caseId,
            page_type = caseConfig.result.name,
            floorResult = floorData.result,
            settingInitialData;

        settingScope.userData.selectedModuleName = moduleName;
        $scope.floorModule = _.findWhere($scope.modules, {name: moduleName});

        settingInitialData = SettingService.setFloorSettingInitialData(floorResult, $scope.floorModule.config.building);

        $scope.setting = SettingService.getModuleSetting(
            caseData,
            blockName,
            moduleName,
            settingScope,
            settingInitialData
        );

        $scope.vm = {
            buildingList: angular.copy(floorResult),
            buildingMap: {},
            pagination: {
                total: -1,
                currentPage: 1,
                pageSize: 10
            },
            facilities: []
        };

        setActiveFloor();
        function setActiveFloor() {
            angular.forEach($scope.setting.buildingMap, function(build, buildId) {
                if(build.isExpand) {
                    $scope.setting.activeFloor = build.floors['0'];
                }
            });
        }

        /**
         * 构造视图临时数据
         */
        initVmModel();
        function initVmModel() {
            var ids = _.pluck($scope.vm.buildingList, 'id');

            angular.forEach(ids, function (id) {
                $scope.vm.buildingMap[id] = {floorId: 0};
            });
            angular.forEach($scope.vm.buildingList, function (build) {
                build.activeFloor = _.first(build.floors);
            });
        }

        /**
         * 构造设施LOGO组预览数据
         */
        generateIconPreview();
        function generateIconPreview() {
            var facilityMap = facilityDefaultIcon[$scope.setting.specificLogoGroup]['facilities'];

            angular.forEach(facilityMap, function (facilityUrl, facilityName) {
                if (_.size($scope.vm.facilities) < 8) {
                    $scope.vm.facilities.push({
                        name: facilityName,
                        url: facilityUrl
                    });
                }
            });
        }


        $log.info('facilities', $scope.vm.facilities);
        $log.info('floorModule:', $scope.floorModule);
        $log.info('buildingMap:', $scope.vm.buildingMap);


        /**
         * 楼层切换
         * @param build 楼
         * @param floor 层
         */
        $scope.changeFloor = function (build, floor) {
            var vmBuild = _.findWhere($scope.vm.buildingList, {id: build.id});
            vmBuild.activeFloor = floor.name;
            $scope.setting.activeFloor = floor;
            $scope.vm.buildingMap[build.id].floorId = floor.id;
        };

        /**
         * 切换楼层配置面板展开
         * @param build
         */
        $scope.togglePanel = function (build) {
            build.isExpand = !build.isExpand;
        };

        $scope.recommendMerchantSortDown = function (merchant, merchantsOfFloor) {
            SettingService.sortDown(merchant, merchantsOfFloor);
        };

        $scope.recommendMerchantSortUp = function (merchant, merchantsOfFloor) {
            SettingService.sortUp(merchant, merchantsOfFloor);
        };

        /**
         * 保存用户配置
         */
        $scope.save = function () {
            SettingService.saveUserSetting({
                mall_id: 1,
                case_id: caseId,
                module_name: moduleName,
                block_name: blockName,
                module_type: $scope.floorModule.type,
                setting: $scope.setting,
                page_type: page_type
            }).success(function (data) {
                Dialog.alert(null, '保存成功');
            }).error(function (error) {
                Dialog.alert(null, error);
            });
        };

        /**
         * 打开“推荐店铺”模态框
         */
        $scope.recommendMerchantModal = function (buildId, floorId, $index) {
            var settingBuild, settingFloor, recommend_merchants;

            settingBuild = $scope.setting.buildingMap[buildId];
            settingFloor = settingBuild.floors[floorId];
            recommend_merchants = settingFloor.recommend_merchants;

            SettingService.getShopList({
                mall_id: 1,
                page_size: $scope.vm.pagination.pageSize
            }).success(function (data) {
                var result = data.result;
                $scope.vm.pagination.currentPage = result.cur_page;
                $scope.vm.pagination.total = result.total;

                $modal.open({
                    templateUrl: __uri('./directive/recommendMerchantModal.html'),
                    controller: 'RecommendMerchantModalCtrl',
                    backdrop: 'static',
                    size: 'md',
                    keyboard: false,
                    resolve: {
                        whereOpen: function () {
                            return 'recommendMerchant';
                        },
                        shopList: function () {
                            return result.data;
                        },
                        merchants: function () {
                            return recommend_merchants;
                        },
                        buildAndFloorData: function () {
                            return {
                                buildId: buildId,
                                floorId: floorId,
                                index: $index
                            }
                        },
                        pagination: function () {
                            return $scope.vm.pagination;
                        }
                    }
                }).result.then(function (data) {
                        if (data) {
                            //TODO 保存推荐店铺
                            var bid = data.buildAndFloorData.buildId,
                                fid = data.buildAndFloorData.floorId,
                                index = data.buildAndFloorData.index,
                                merchant = data.merchant;

                            settingBuild = $scope.setting.buildingMap[bid];
                            settingFloor = settingBuild.floors[fid];
                            recommend_merchants = settingFloor.recommend_merchants;

                            angular.extend(recommend_merchants[index], merchant);

                        }
                    }, function (error) {
                        $log.info(error);
                    })
            }).error(function (error) {
                Dialog.alert(null, error);
            });
        };

        /**
         * 打开“自定义首屏店铺”模态框
         */
        $scope.openMerchantShowRuleModal = function (buildId, floorId) {
            var settingBuild, settingFloor, custom_first_screen_merchants;

            settingBuild = $scope.setting.buildingMap[buildId];
            settingFloor = settingBuild.floors[floorId];
            custom_first_screen_merchants = settingFloor.custom_first_screen_merchants;

            $modal.open({
                templateUrl: __uri('./directive/customMerchantModal.html'),
                controller: 'CustomMerchantModalCtrl',
                backdrop: 'static',
                size: 'md',
                keyboard: false,
                resolve: {

                    merchants: function () {
                        return custom_first_screen_merchants;
                    },

                    buildAndFloorData: function () {
                        return {
                            buildId: buildId,
                            floorId: floorId
                        }
                    },

                    settingData: function() {
                        return $scope.setting;
                    }
                }
            });
        };

        /**
         * 打开“指定LOGO组”模态框
         */
        $scope.openSpecifyLogosModal = function () {
            $modal.open({
                templateUrl: __uri('./directive/selectPublicFacilitiesLogoModal.html'),
                controller: 'SelectPublicFacilitiesLogoModalCtrl',
                backdrop: 'static',
                size: 'w1022',
                keyboard: false,
                resolve: {
                    facilityDefaultIcon: function () {
                        return facilityDefaultIcon;
                    },
                    publicFacilities: function () {
                        return $scope.floorModule.config.building.public_facilities
                    },
                    specificLogoGroup: function () {
                        return $scope.setting.specificLogoGroup;
                    }
                }
            }).result.then(function (data) {
                    if (data) {
                        //TODO 保存指定LOGO组
                        $scope.setting.specificLogoGroup = data;
                        generateIconPreview();
                    }
                }, function (error) {
                    $log.info(error);
                });
        };
        /**
         * 打开“自定公共设施”模态框
         */
        $scope.editPublicFacilities = function (buildId, floorId) {
            var settingBuild, settingFloor, public_facilities;

            settingBuild = $scope.setting.buildingMap[buildId];
            settingFloor = settingBuild.floors[floorId];
            public_facilities = settingFloor.public_facilities;

            $modal.open({
                templateUrl: __uri('./directive/customPublicFacilitiesModal.html'),
                controller: 'CustomPublicFacilitiesModalCtrl',
                backdrop: 'static',
                size: 'lg',
                keyboard: false,
                resolve: {
                    publicFacilities: function () {
                        return $scope.floorModule.config.building.public_facilities
                    },
                    buildAndFloorData: function () {
                        return {
                            buildId: buildId,
                            floorId: floorId
                        }
                    },
                    settingPublicFacilities: function () {
                        return public_facilities;
                    }

                }
            }).result.then(function (data) {
                    if (data) {
                        //TODO 保存商家自定义的设施
                        var bid = data.buildAndFloorData.buildId,
                            fid = data.buildAndFloorData.floorId,
                            facilitySelectedList = data.facilitySelectedList;

                        settingBuild = $scope.setting.buildingMap[bid];
                        settingFloor = settingBuild.floors[fid];

                        if (angular.isArray(settingFloor.public_facilities)) {
                            settingFloor.public_facilities = null;
                        }
                        settingFloor.public_facilities = facilitySelectedList;

                    }
                }, function (error) {
                    $log.info(error);
                });
        };

        /**
         * 打开"自定义公共设施LOGO组"模态框
         */
        $scope.openCustomLogosModal = function () {
            $modal.open({
                templateUrl: __uri('./directive/customLogoModal.html'),
                controller: 'CustomLogoModalCtrl',
                backdrop: 'static',
                size: 'w1022',
                keyboard: false,
                resolve: {
                    publicFacilities: function () {
                        return $scope.floorModule.config.building.public_facilities
                    }
                }
            }).result.then(function (data) {
                    if (data) {
                        //TODO 保存商家上传的设施LOGO
                    }
                }, function (error) {
                    $log.info(error);
                });
        };

    })
    /*推荐店铺*/
    .controller('RecommendMerchantModalCtrl',
    function ($scope,
              $log,
              $modalInstance,
              $rootScope,
              shopList,
              merchants,
              buildAndFloorData,
              pagination,
              SettingService,
              Dialog,
              whereOpen) {

        $scope.vm = {
            shopList: angular.copy(shopList),
            selectedShop: null,
            shopQuery: '',
            pagination: pagination,
            customShop: null
        };

        $log.info('whereOpen', whereOpen);

        initShopList();
        function initShopList() {
            var vmShop;
            angular.forEach($scope.vm.shopList, function (shop) {
                shop.isSelected = false;
            });
            angular.forEach(merchants, function (merchant) {
                if (merchant.id) {
                    vmShop = _.findWhere($scope.vm.shopList, {id: merchant.id});
                    vmShop.isSelected = true;
                }
            });
        }

        $log.info('shopList:', $scope.vm.shopList);
        $log.info('merchants:', merchants);

        function requestShopList(queryString) {
            SettingService.getShopList({
                mall_id: 1,
                keyword: queryString || '',
                page: $scope.vm.pagination.currentPage,
                page_size: $scope.vm.pagination.pageSize
            }).success(function (data) {
                var result = data.result;
                $scope.vm.pagination.currentPage = result.cur_page;
                $scope.vm.pagination.total = result.total;
                $scope.vm.shopList = angular.copy(result.data);
                initShopList();
            }).error(function (error) {
                Dialog.alert(null, error);
            })
        }

        /**
         * 店铺查询
         */
        $scope.queryShop = function () {
            requestShopList($scope.vm.shopQuery);
        };

        /**
         * 分页查询
         */
        $scope.pageChangeHandler = function () {
            requestShopList();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('取消');
        };

        $scope.confirm = function () {
            var data = {buildAndFloorData: buildAndFloorData};

            //if(whereOpen === 'recommendMerchant') {
            //    data.recommend_merchant = angular.copy($scope.vm.selectedShop);
            //} else if(whereOpen === 'customMerchant') {
            //    data.custom_merchant = angular.copy($scope.vm.customShop);
            //}

            data.merchant = angular.copy($scope.vm.selectedShop);

            $modalInstance.close(data);
        };

        $rootScope.$on('$stateChangeStart', $scope.cancel);
    })
    /*自定义“首屏展示店铺”及顺序*/
    .controller('CustomMerchantModalCtrl',
    function ($scope,
              $log,
              $modalInstance,
              $rootScope,
              $modal,
              merchants,
              buildAndFloorData,
              SettingService,
              Dialog,
              settingData) {

        $scope.vm = {
            pagination: {
                total: -1,
                currentPage: 1,
                pageSize: 10
            }
        };

        $scope.setting = {
            customFirstScreenMerchants: merchants,
            data: null
        };

        $scope.openShopListModal = function ($index) {
            angular.extend(buildAndFloorData, {index: $index});

            SettingService.getShopList({
                mall_id: 1,
                page: $scope.vm.pagination.currentPage,
                page_size: $scope.vm.pagination.pageSize
            }).success(function(data) {
                var result = data.result;
                $scope.vm.pagination.currentPage = result.cur_page;
                $scope.vm.pagination.total = result.total;

                $modal.open({
                    templateUrl: __uri('./directive/recommendMerchantModal.html'),
                    controller: 'RecommendMerchantModalCtrl',
                    backdrop: 'static',
                    size: 'md',
                    keyboard: false,
                    resolve: {
                        whereOpen: function () {
                            return 'customMerchant';
                        },
                        shopList: function() {
                            return result.data;
                        },
                        merchants: function() {
                            return merchants;
                        },
                        buildAndFloorData: function () {
                            return buildAndFloorData;
                        },
                        pagination: function () {
                            return $scope.vm.pagination;
                        }
                    }
                }).result.then(function (data) {
                        if (data) {
                            //TODO 保存自定义首屏店铺
                            $scope.setting.data = data;
                            var bid = data.buildAndFloorData.buildId,
                                fid = data.buildAndFloorData.floorId,
                                index = data.buildAndFloorData.index,
                                merchant = data.merchant;

                            var settingBuild = settingData.buildingMap[bid],
                                settingFloor = settingBuild.floors[fid],
                                custom_first_screen_merchants = settingFloor.custom_first_screen_merchants;

                            angular.extend(custom_first_screen_merchants[index], merchant);
                        }
                    }, function (error) {
                        $log.info(error);
                    });
            }).error(function(error) {
                Dialog.alert(null, error);
            });
        };

        $scope.add = function($index) {
            merchants.splice($index + 1, 0, {});
        };

        $scope.delete = function($index) {
            merchants.splice($index, 1);
        };

        $scope.sortDown = function(merchant) {
            SettingService.sortDown(merchant, merchants);
        };

        $scope.sortUp = function(merchant) {
            SettingService.sortUp(merchant, merchants);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('取消');
        };

        $scope.confirm = function () {
            $modalInstance.close(true);
        };

        $rootScope.$on('$stateChangeStart', $scope.cancel);
    })
    /*指定公共设施LOGO组controller*/
    .controller('SelectPublicFacilitiesLogoModalCtrl',
    function ($scope, $log, $modalInstance, $rootScope, facilityDefaultIcon, publicFacilities, specificLogoGroup) {

        $scope.vm = {
            facilityDefaultIcon: facilityDefaultIcon,
            publicFacilities: publicFacilities,
            selectedLogoGroup: specificLogoGroup
        };

        $log.info('facilityDefaultIcon', $scope.vm.facilityDefaultIcon);

        $scope.cancel = function () {
            $modalInstance.dismiss('取消');
        };

        $scope.confirm = function () {
            $modalInstance.close($scope.vm.selectedLogoGroup);
        };

        $rootScope.$on('$stateChangeStart', $scope.cancel);
    })
    /*自定义LOGO组controller*/
    .controller('CustomLogoModalCtrl',
    function ($scope, $log, $modalInstance, $rootScope, publicFacilities) {

        $scope.vm = {
            publicFacilities: publicFacilities
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('取消');
        };

        $scope.confirm = function () {
            $modalInstance.close(true);
        };

        $rootScope.$on('$stateChangeStart', $scope.cancel);
    })
    /*自定义公共设施controller*/
    .controller('CustomPublicFacilitiesModalCtrl',
    function ($scope,
              $log,
              $modalInstance,
              $rootScope,
              publicFacilities,
              buildAndFloorData,
              settingPublicFacilities) {

        $scope.vm = {
            publicFacilities: publicFacilities,
            facilityMap: null
        };

        initFacilityMap(settingPublicFacilities);
        function initFacilityMap(settingPublicFacilities) {
            $scope.vm.facilityMap = _.mapObject(angular.copy(publicFacilities), function () {
                return '';
            });

            angular.forEach(settingPublicFacilities, function (facility) {
                $scope.vm.facilityMap[facility] = true;
            });
        }


        $scope.cancel = function () {
            $modalInstance.dismiss('取消');
        };

        $scope.confirm = function () {
            var facilitySelectedList = [];
            angular.forEach($scope.vm.facilityMap, function (val, k) {
                if (val) {
                    facilitySelectedList.push(k);
                }
            });
            $modalInstance.close({
                buildAndFloorData: buildAndFloorData,
                facilitySelectedList: facilitySelectedList
            });
        };

        $rootScope.$on('$stateChangeStart', $scope.cancel);
    });



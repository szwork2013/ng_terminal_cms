/**
 * Created by dulin on 2015/10/12.
 */
angular.module('cms').controller('TerminalContentEditFloorFloorCtrl',
    function ($scope, $log, $stateParams, Dialog, caseData, caseConfig, SettingService, $modal, floorData) {

        var settingScope = $scope.$parent.$parent,
            blockName = $stateParams.blockName,
            moduleName = $stateParams.moduleName,
            caseId = $stateParams.caseId,
            pageType = caseConfig.result.name,
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
            buildingMap: {}
        };

        var ids = _.pluck($scope.vm.buildingList, 'id');
        angular.forEach(ids, function(id) {
            $scope.vm.buildingMap[id] = {floorId: 0};
        });


        setVmBuildExtraField();
        /**
         * 构造视图临时数据
         */
        function setVmBuildExtraField() {
            angular.forEach($scope.vm.buildingList, function(build) {
                build.activeFloor = _.first(build.floors);
            });
        }

        $log.info('floorModule:', $scope.floorModule);
        $log.info('buildingMap:', $scope.vm.buildingMap);


        /**
         * 楼层切换
         * @param build 楼
         * @param floor 层
         */
        $scope.changeFloor = function(build, floor) {
            var vmBuild = _.findWhere($scope.vm.buildingList, {id: build.id});
            vmBuild.activeFloor = floor.name;
            $scope.vm.buildingMap[build.id].floorId = floor.id;
        };

        /**
         * 切换楼层配置面板展开
         * @param build
         */
        $scope.togglePanel = function(build) {
            build.isExpand = !build.isExpand;
        };

        /**
         * 打开“自定义首屏店铺”模态框
         */
        $scope.openMerchantShowRuleModal = function () {
            $modal.open({
                templateUrl: __uri('./directive/customMerchantModal.html'),
                controller: 'CustomMerchantModalCtrl',
                backdrop: 'static',
                size: 'md',
                keyboard: false
            }).result.then(function (data) {
                    if (data) {
                        //TODO 保存自定义首屏店铺

                    }
                }, function (error) {
                    $log.info(error);
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
                keyboard: false
            }).result.then(function (data) {
                    if (data) {
                        //TODO 保存指定LOGO组
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
                    buildAndFloorData: function() {
                        return {
                            buildId: buildId,
                            floorId: floorId
                        }
                    },
                    settingPublicFacilities: function() {
                        return public_facilities
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

                        if(angular.isArray(settingFloor.public_facilities)){
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
    .controller('CustomMerchantModalCtrl',
    function ($scope, $log, $modalInstance, $rootScope) {
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
    function ($scope, $log, $modalInstance, $rootScope) {

        $scope.vm = {

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('取消');
        };

        $scope.confirm = function () {
            $modalInstance.close(true);
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
    function ($scope, $log, $modalInstance, $rootScope, publicFacilities, buildAndFloorData, settingPublicFacilities) {

        $scope.vm = {
            publicFacilities: publicFacilities,
            facilityMap: null
        };

        initFacilityMap(settingPublicFacilities);
        function initFacilityMap(settingPublicFacilities) {
            $scope.vm.facilityMap = _.mapObject(angular.copy(publicFacilities), function() {
                return '';
            });

            angular.forEach(settingPublicFacilities, function(facility) {
                $scope.vm.facilityMap[facility] = true;
            });
        }


        $scope.cancel = function () {
            $modalInstance.dismiss('取消');
        };

        $scope.confirm = function () {
            var facilitySelectedList = [];
            angular.forEach($scope.vm.facilityMap, function(val, k) {
                if(val) {
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



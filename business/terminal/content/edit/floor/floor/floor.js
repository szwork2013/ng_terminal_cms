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
         * ������ͼ��ʱ����
         */
        function setVmBuildExtraField() {
            angular.forEach($scope.vm.buildingList, function(build) {
                build.activeFloor = _.first(build.floors);
            });
        }

        $log.info('floorModule:', $scope.floorModule);
        $log.info('buildingMap:', $scope.vm.buildingMap);


        /**
         * ¥���л�
         * @param build ¥
         * @param floor ��
         */
        $scope.changeFloor = function(build, floor) {
            var vmBuild = _.findWhere($scope.vm.buildingList, {id: build.id});
            vmBuild.activeFloor = floor.name;
            $scope.vm.buildingMap[build.id].floorId = floor.id;
        };

        /**
         * �л�¥���������չ��
         * @param build
         */
        $scope.togglePanel = function(build) {
            build.isExpand = !build.isExpand;
        };

        /**
         * �򿪡��Զ����������̡�ģ̬��
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
                        //TODO �����Զ�����������

                    }
                }, function (error) {
                    $log.info(error);
                });
        };

        /**
         * �򿪡�ָ��LOGO�顱ģ̬��
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
                        //TODO ����ָ��LOGO��
                    }
                }, function (error) {
                    $log.info(error);
                });
        };
        /**
         * �򿪡��Զ�������ʩ��ģ̬��
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
                        //TODO �����̼��Զ������ʩ
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
         * ��"�Զ��幫����ʩLOGO��"ģ̬��
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
                        //TODO �����̼��ϴ�����ʩLOGO
                    }
                }, function (error) {
                    $log.info(error);
                });
        };

    })
    .controller('CustomMerchantModalCtrl',
    function ($scope, $log, $modalInstance, $rootScope) {
        $scope.cancel = function () {
            $modalInstance.dismiss('ȡ��');
        };

        $scope.confirm = function () {
            $modalInstance.close(true);
        };

        $rootScope.$on('$stateChangeStart', $scope.cancel);
    })
    /*ָ��������ʩLOGO��controller*/
    .controller('SelectPublicFacilitiesLogoModalCtrl',
    function ($scope, $log, $modalInstance, $rootScope) {

        $scope.vm = {

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('ȡ��');
        };

        $scope.confirm = function () {
            $modalInstance.close(true);
        };

        $rootScope.$on('$stateChangeStart', $scope.cancel);
    })
    /*�Զ���LOGO��controller*/
    .controller('CustomLogoModalCtrl',
    function ($scope, $log, $modalInstance, $rootScope, publicFacilities) {

        $scope.vm = {
            publicFacilities: publicFacilities
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('ȡ��');
        };

        $scope.confirm = function () {
            $modalInstance.close(true);
        };

        $rootScope.$on('$stateChangeStart', $scope.cancel);
    })
    /*�Զ��幫����ʩcontroller*/
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
            $modalInstance.dismiss('ȡ��');
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



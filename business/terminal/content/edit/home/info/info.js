/**
 * Created by dulin on 2015/9/23.
 */

angular.module('cms').controller('TerminalContentEditHomeInfoCtrl',
    function ($scope, $log, SettingService, $stateParams, Dialog, caseData, mallInfo) {

        var settingScope = $scope.$parent.$parent,
            blockName = $stateParams.blockName,
            moduleName = $stateParams.moduleName,
            caseId = $stateParams.caseId,
            page_type = settingScope.userData.page_type;

        settingScope.userData.selectedModuleName = moduleName;
        $scope.infoModule = _.findWhere($scope.modules, {name: moduleName});

        $scope.setting = SettingService.getModuleSetting(
            caseData,
            blockName,
            moduleName,
            settingScope,
            {
                city: '上海',
                baseInfo: {},
                show: "1",
                mallName: mallInfo.result.name,
                data: []
            }
        );

        $scope.vm = {
            logoUrl: '',
            moduleName: moduleName
        };

        SettingService.setModuleCheckBoxData.call($scope.setting.baseInfo, $scope.infoModule.config.baseInfo);

        $scope.uploadImg = function ($files) {
            var promise = SettingService.upload($files);
            if (promise) {
                promise.success(function (data) {
                    $scope.vm.logoUrl = data.result.url;
                    $scope.setting.data.push({
                        logo: data.result.url
                    });
                }).error(function (error) {
                    Dialog.alert(error);
                });
            }
        };

        $scope.save = function () {
            SettingService.saveUserSetting({
                mall_id: 1,
                case_id: caseId,
                module_name: moduleName,
                block_name: blockName,
                module_type: $scope.infoModule.type,
                setting: $scope.setting,
                page_type: page_type
            }).then(function (data) {
                Dialog.alert(null, '保存成功');
            }, function (error) {
                Dialog.alert(null ,error);
            });
        };

        $scope.deleteUpload = function () {
            $scope.vm.logoUrl = '';
            $scope.setting.data.length = 0;
        };

    });
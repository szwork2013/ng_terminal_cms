/**
 * @file 首页设置
 * @author zhaoran
 * @date 2015-09-16
 */

angular.module('cms').controller('TerminalContentEditHomeBlockCtrl',
    function ($scope, $state, $stateParams, caseConfig, SettingService, $log, caseData) {

        var settingScope = $scope.$parent;

        //用户选择的block名
        var blockName = $scope.userData.blockName = $stateParams.blockName;

        //$scope.$watch('userData.blockExistSameModule', function(newVal, oldVal) {
        //    $log.info(newVal, settingScope.userData.blockName);
        //    var module = _.findWhere($scope.modules, {type: settingScope.userData.blockExistSameModule})
        //    module.disabled = true;
        //}, true);

        //获取所选block的所有类目
        $scope.modules = SettingService.getModulesByBlockName.call(caseConfig, blockName);

        //默认选中所选block的第一个类目
        $scope.userData.selectedModuleName = caseData.result[blockName] ? Object.keys(caseData.result[blockName])[0]
        : function() {
            return $scope.modules ? $scope.modules[0].name : ''
        }();

        $scope.userData.selectedModuleDisplayType =
            _.findWhere($scope.modules, {
                name: $scope.userData.selectedModuleName
            })['display_type'];

        //监控用户选择类目信息,如'ad1, info1'
        $scope.$watch('userData.selectedModuleName', function (newValue) {

            if (!newValue) {
                return;
            }

            $scope.userData.selectedModuleDisplayType = _.findWhere($scope.modules, {name: newValue})['display_type'];
            settingScope.userData.selectedModuleNameMap[blockName] = newValue;
            //$log.info("selectedModuleName:",newValue, settingScope.userData.selectedModuleNameMap, caseData);

            $state.go('cms.terminal.content.edit.home.block.module', {
                moduleName: newValue
            });

        }, true);
    });
/**
 * Created by dulin on 2015/10/9.
 */
angular.module('cms').controller('TerminalContentEditSettingCtrl',
    function ($scope, caseInfo, $log, EditService) {
        $log.info(caseInfo);
        $scope.vm = {
            settingData: null,
            caseInfo: null
        };

        $scope.vm.settingData = EditService.transformSettingData(caseInfo.result);
        $scope.vm.caseInfo = caseInfo.result;
    });
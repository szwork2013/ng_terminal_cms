/**
 * Created by dulin on 2015/10/12.
 */
angular.module('cms').controller('TerminalContentEditFloorCtrl',
    function ($scope, $state, $stateParams, caseConfig, SettingService, caseData, $log) {

        //�û�ѡ���block������Ŀ������
        $scope.userData = {
            blockName: '',
            selectedModuleName: '',
            selectedModuleNameMap: null,
            selectedModuleDisplayType: ''
        };

        $log.info(caseConfig);
        $log.info("caseData:", caseData);

        $scope.userData.selectedModuleNameMap = SettingService.getSelectedModuleNameMap(caseData);
        //��ȡ��ģ���ÿ��block������ʽ��Ϣ
        $scope.casePageStyles = caseConfig.result.blocks;

        //��ȡ��case����
        $scope.caseName = caseConfig.result.display_name;
        //��ȡ��caseɫϵ����񣬰�ʽ
        $scope.caseSetting = caseConfig.result.setting;

        //��ȡ��case���е�module��Ϣ
        $scope.allModule = SettingService.getAllModules(caseData.result);
        //$log.info("allModule: ", $scope.allModule);

        //ѡ��block,����block�����ظ�block���е�module��Ŀ
        $scope.selectBlock = function (block) {
            var blockName = block.name;
            if (blockName === $scope.userData.blockName) return;
            $state.go('cms.terminal.content.edit.floor.block', {
                blockName: blockName
            }, {
                reload: true
            });
        };
    });
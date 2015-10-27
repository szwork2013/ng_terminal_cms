/**
 * @file 首页设置
 * @author zhaoran
 * @date 2015-09-16
 */

angular.module('cms').controller('TerminalContentEditHomeCtrl',
    function ($scope, $state, $stateParams, caseConfig, SettingService, caseData, $log) {

        //用户选择的block名、类目名数据
        $scope.userData = {
            blockName: '',
            selectedModuleName: '',
            selectedModuleNameMap: null,
            selectedModuleDisplayType: '',
            page_type: '',
            blockExistSameModule: ''
        };

        //$log.info(caseConfig);
        //$log.info(caseData);

        //获取页面类型
        $scope.userData.page_type = caseConfig.result.name;

        $scope.userData.selectedModuleNameMap = SettingService.getSelectedModuleNameMap(caseData);
        //获取该模版的每个block布局样式信息
        $scope.casePageStyles = caseConfig.result.blocks;

        //获取该case名称
        $scope.caseName = caseConfig.result.display_name;
        //获取该case色系，风格，版式
        $scope.caseSetting = caseConfig.result.setting;

        //获取该case所有的module信息
        $scope.allModule = SettingService.getAllModules(caseData.result);
        //$log.info("allModule: ", $scope.allModule);
        //$log.info("caseData:", caseData);

        //选择block,根据block名加载该block所有的module类目
        $scope.selectBlock = function (block) {
            var blockName = block.name;
            if (blockName === $scope.userData.blockName) return;
            $state.go('cms.terminal.content.edit.home.block', {
                blockName: blockName
            }, {
                reload: true
            });
        };
    });
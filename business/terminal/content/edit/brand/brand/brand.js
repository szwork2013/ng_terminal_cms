/**
 * Created by dulin on 2015/10/12.
 */
angular.module('cms').controller('TerminalContentEditBrandBrandCtrl',
    function ($scope, $log, $stateParams, Dialog, caseData, caseConfig, SettingService, shopCatg) {

        var settingScope = $scope.$parent.$parent,
            blockName = $stateParams.blockName,
            moduleName = $stateParams.moduleName,
            caseId = $stateParams.caseId,
            shopCatgs = SettingService.setShopCatgViewData(shopCatg.result),
            pageType = caseConfig.result.name;

        settingScope.userData.selectedModuleName = moduleName;
        $scope.brandModule = _.findWhere($scope.modules, {name: moduleName});

        $scope.setting = SettingService.getModuleSetting(
            caseData,
            blockName,
            moduleName,
            settingScope,
            {
                show: 1,
                shopCatgs: shopCatgs,
                sort: 'time'
            }
        );

        $scope.vm = {
            moduleName: moduleName,
            showModal: false,
            pagination: {
                total: null,
                currentPage: 1,
                pageSize: 10
            },
            shopList: null,
            catg_id: null,
            shopQuery: '',
            selectedShop: null,
            stickShopIndex: null,
            shopCatgs: null
        };

        $scope.vm.shopCatgs = SettingService.setSelectedShopList(angular.copy($scope.setting.shopCatgs));


        /**
         * 根据品牌分类ID请求该品牌分类下的店铺列表
         * @param opts
         */
        function requestShopList(opts) {
            var vmShopCatg = _.findWhere($scope.vm.shopCatgs, {id: $scope.vm.catg_id});
            $scope.vm.selectedShop = null;

            SettingService.getShopList({
                mall_id: 1,
                catg_id: $scope.vm.catg_id,
                page: $scope.vm.pagination.currentPage,
                page_size: $scope.vm.pagination.pageSize,
                keyword: opts.keyword || ''
            }).success(function (data) {
                $scope.vm.pagination.total = data.result.total;
                $scope.vm.pagination.currentPage = data.result.cur_page;
                $scope.vm.shopList =
                    function () {
                        var shopList = [];
                        if(vmShopCatg.shopList) {
                            angular.forEach(data.result.data, function(queryShop) {
                                queryShop.isSelected = vmShopCatg.selectedMap[queryShop.id];
                                shopList.push(queryShop);
                            });
                            return shopList;
                        } else {
                            return data.result.data;
                        }
                    }();
                (opts.cb || angular.noop)();
            }).error(function (error) {
                Dialog.alert(null, error);
            });
        }

        /**
         * 品牌分类展开操作
         * @param shopCatg 品牌分类
         */
        $scope.slideToggle = function (shopCatg) {
            shopCatg.isExpand = !shopCatg.isExpand;
        };

        /**
         * 品牌分类-升序操作
         * @param shopCatg 当前进行排序操作的品牌分类
         */
        $scope.sortUp = function (shopCatg) {
            SettingService.sortUp(shopCatg, $scope.setting.shopCatgs);
        };

        /**
         * 品牌分类-降序操作
         * @param shopCatg 当前进行排序操作的品牌分类
         */
        $scope.sortDown = function (shopCatg) {
            SettingService.sortDown(shopCatg, $scope.setting.shopCatgs);
        };

        /**
         * 设置“默认展示”品牌分类
         * @param shopCatg 品牌分类
         */
        $scope.setDefaultShopCatg = function (shopCatg) {
            shopCatg.isDefault = true;
            angular.forEach($scope.setting.shopCatgs, function(el) {
                if(el.id !== shopCatg.id) {
                    el.isDefault = false;
                }
            });
        };

        /**
         * 保存用户配置数据
         */
        $scope.save = function () {
            SettingService.saveUserSetting({
                mall_id: 1,
                case_id: caseId,
                module_name: moduleName,
                block_name: blockName,
                module_type: $scope.brandModule.type,
                setting: $scope.setting,
                page_type: pageType
            }).then(function (data) {
                Dialog.alert(null, '保存成功');
            }, function (error) {
                Dialog.alert(null, error);
            });
        };

        /**
         * 添加置顶店铺
         * @param shopCatg 当前品牌分类
         * @param $index 当前置顶店铺条目索引
         */
        $scope.addStickShop = function (shopCatg, $index) {
            $scope.vm.catg_id = shopCatg.id;
            $scope.vm.stickShopIndex = $index;
            requestShopList({
                cb: $scope.openShopListModal
            });
        };

        /**
         * 店铺列表分页
         */
        $scope.pageChangeHandler = function () {
            requestShopList();
        };

        /**
         * 置顶店铺确认
         */
        $scope.saveStickShop = function () {
            var settingShopCatg = _.findWhere($scope.setting.shopCatgs, {id: $scope.vm.catg_id}),
                vmShopCatg = _.findWhere($scope.vm.shopCatgs, {id: $scope.vm.catg_id}),
                settingStickShop = settingShopCatg.stickShops[$scope.vm.stickShopIndex];

            angular.extend(settingStickShop, $scope.vm.selectedShop);
            SettingService.setSettingDataSelectedShopMap(settingShopCatg, vmShopCatg.selectedMap);
            $scope.closeShopListModal();
        };

        /**
         * 打开分类下店铺列表弹窗
         */
        $scope.openShopListModal = function() {
            $scope.vm.showModal = true;
        };

        /**
         * 关闭分类下店铺列表弹窗
         */
        $scope.closeShopListModal = function() {
            $scope.vm.showModal = false;
        };

        /**
         * 店铺查询
         * @param shopQuery 用户输入的店铺名
         */
        $scope.queryShop = function (shopQuery) {
            requestShopList({keyword: shopQuery});
        };

    });
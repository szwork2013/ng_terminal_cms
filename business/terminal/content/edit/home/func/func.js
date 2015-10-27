/**
 * Created by dulin on 2015/9/23.
 */
angular.module('cms').controller('TerminalContentEditHomeFuncCtrl',
    function ($scope, $log, SettingService, $stateParams, Dialog, caseData) {

        var settingScope = $scope.$parent.$parent,
            moduleName = $stateParams.moduleName,
            blockName = $stateParams.blockName,
            caseId = $stateParams.caseId,
            page_type = settingScope.userData.page_type,
            qrcodeData;


        settingScope.userData.selectedModuleName = moduleName;

        $scope.funcModule = _.findWhere($scope.modules, {name: moduleName});

        $scope.setting = SettingService.getModuleSetting(
            caseData,
            blockName,
            moduleName,
            settingScope,
            {
                num: 3,
                show: 1,
                data: [],
                type: {}
            }
        );
        $log.info($scope.setting);

        $scope.vm = {
            funcCount: _.size($scope.funcModule.config.type),
            funcSelectedCount: _.size($scope.setting.data),
            moduleName: moduleName,
            qrcode: null,
            shopData: _.findWhere($scope.setting.data, {enTxt: 'shop'}) || _.findWhere($scope.funcModule.config.type, {enTxt: 'shop'})
        };

        qrcodeData = _.findWhere($scope.setting.data, {enTxt: 'qrcode'});

        init();
        function init() {
            $scope.vm.qrcode = function(){
                if(angular.isUndefined(qrcodeData)) {
                    qrcodeData = {};
                    if(!_.size(qrcodeData.data)) {
                        qrcodeData.data = [];
                    }
                    return '';
                } else {
                    return _.first(qrcodeData.data).image;
                }
            }();

            $.isEmptyObject($scope.setting.type) ?
                SettingService.setFuncModuleCheckboxData.call($scope.setting.type, $scope.funcModule.config.type) :
                angular.noop();
        }

        $scope.$watch('setting.type', function (newVal) {
            var count = 0;
            angular.forEach(newVal, function (val, key) {
                if (val) count++;
                angular.forEach($scope.funcModule.config.type, function (el) {
                    if (key === el.enTxt) {
                        el.isChecked = val;
                    }
                });
            });
            $scope.vm.funcSelectedCount = count;
        }, true);

        /**
         * 检查是否有任意一个功能被勾选
         * @returns {boolean} 如果有任意一个功能被勾选，则为true，如果没有一个功能被勾选，则为false
         */
        $scope.isAnyCheckboxChecked = function () {
            return _.some($scope.setting.type);
        };

        /**
         * 勾选的功能-排序-升序
         * @param func
         */
        $scope.sortUp = function (func) {
            SettingService.sortUp(func, $scope.setting.data);
        };

        /**
         * 勾选的功能-排序-降序
         * @param func
         */
        $scope.sortDown = function (func) {
            SettingService.sortDown(func, $scope.setting.data);
        };


        /**
         * 二维码-图片上传
         * @param $file
         */
        $scope.uploadQrcode = function ($file) {
            var promise = SettingService.upload($file);
            if (promise) {
                promise.success(function (data) {
                    var url = data.result.url;
                    $scope.vm.qrcode = url;
                    _.findWhere($scope.setting.data, {enTxt: 'qrcode'}).data.push({
                        image: url
                    });
                }).error(function (error) {
                    Dialog.alert(error);
                });
            }
        };

        /**
         * 主力店铺-图片上传
         * @param $file
         */
        $scope.uploadShop = function ($file) {
            var promise = SettingService.upload($file);
            if (promise) {
                promise.success(function (data) {
                    var url = data.result.url;
                    $scope.vm.shopData.data.push({
                        image: url
                    });
                }).error(function (error) {
                    Dialog.alert(error);
                });
            }
        };

        /**
         * 功能入口编辑-确认保存
         */
        $scope.save = function () {
            var num = parseInt($scope.setting.num, 10),
                funcCount = $scope.vm.funcSelectedCount,
                shopNum, shopImgLen;

            if (num !== funcCount) {
                Dialog.alert(null, '功能选择数量不正确，请检查');
                return;
            }
            if($scope.vm.shopData) {
                shopNum = $scope.vm.shopData.numSelected;
                shopImgLen = _.size($scope.vm.shopData.data);
                if (shopImgLen < shopNum) {
                    Dialog.alert(null, '主力店铺图片数量不正确，请检查');
                    return;
                }
            }

            SettingService.saveUserSetting({
                mall_id: 1,
                case_id: caseId,
                module_name: moduleName,
                block_name: blockName,
                module_type: $scope.funcModule.type,
                setting: $scope.setting,
                page_type: page_type
            }).then(function () {
                Dialog.alert(null, '保存成功');
            }, function (error) {
                Dialog.alert(null, error);
            });
        };

        /**
         * 主力店铺-图片排序-升序
         * @param shop 图片对象
         */
        $scope.shopSortUp = function (shop) {
            SettingService.sortUp(shop, $scope.vm.shopData.data);
        };

        /**
         * 主力店铺-图片排序-降序
         * @param shop 图片对象
         */
        $scope.shopSortDown = function (shop) {
            SettingService.sortDown(shop, $scope.vm.shopData.data);
        };

        /**
         * 删除主力店铺上传的图片
         * @param shop
         */
        $scope.deleteShopUpload = function (shop) {
            var index = $scope.vm.shopData.data.indexOf(shop);
            $scope.vm.shopData.data.splice(index, 1);
        };

        /**
         * 主力店铺数量选择
         * @param newNum 选择的数量
         */
        $scope.shopNumChange = function (newNum) {
            $scope.vm.shopData.numSelected = newNum;
        };

        $scope.checkboxChange = function(type) {
            var isExist = false;
            angular.forEach($scope.setting.data, function(el, index, settingData) {
                if(el.enTxt === type.enTxt) {
                    settingData.splice(index, 1);
                    isExist = true;
                }
            });
            if(!isExist) {
                $scope.setting.data.push(type);
            }
        };

    });

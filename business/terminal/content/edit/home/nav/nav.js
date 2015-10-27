/**
 * Created by dulin on 2015/9/23.
 */
angular.module('cms').controller('TerminalContentEditHomeNavCtrl',
    function ($scope, $log, SettingService, $stateParams, Dialog, caseData, caseConfig) {

        var settingScope = $scope.$parent.$parent,
            moduleName = $stateParams.moduleName,
            blockName = $stateParams.blockName,
            caseId = $stateParams.caseId,
            page_type = settingScope.userData.page_type;


        settingScope.userData.selectedModuleName = moduleName;

        $scope.navModule = _.findWhere($scope.modules, {name: moduleName});
        $scope.setting = SettingService.getModuleSetting(
            caseData,
            blockName,
            moduleName,
            settingScope,
            {
                num: "2",
                data: []
            }
        );

        $log.info($scope.setting);

        $scope.vm = {
            imgs: null,
            imgObj: {
                bgUrl: '',
                titleUrl: ''
            }
        };

        //angular.forEach(caseData.result, function(val, key) {
        //    if(key === 'a') {
        //        settingScope.userData.blockExistSameModule =
        //            caseConfig.result.modules[_.first(_.keys(val))]['type'];
        //    }
        //});

        /**
         * 如果有用户配置的上传图片数据，复制一份并赋值给视图变量
         */
        $scope.vm.imgs = _.size($scope.setting.data) ?
            angular.copy($scope.setting.data) :
            [{
                bgUrl: '',
                titleUrl: ''
            }];

        /**
         * 监视用户选择的要上传的条目数量
         * 检查最后一个上传条目“背景图”和“标题图”是否都上传完毕
         * 如果上传条目没有上传完整，则返回，视图不添加新的待上传条目
         *
         */
        $scope.$watch('setting.num', function (newVal) {
            var imgLen = _.size($scope.vm.imgs),
                num = parseInt(newVal, 10),
                isLastUploadItemComplete = $scope.isUploadComplete(_.last($scope.vm.imgs));
            if (num > imgLen) {
                if (!isLastUploadItemComplete) return;
                addEmptyUploadItem();
            }
        });


        /**
         * 添加新的待上传条目
         */
        function addEmptyUploadItem() {
            $scope.vm.imgs.push({
                bgUrl: '',
                titleUrl: ''
            });
        }

        /**
         * 清空视图临时变量
         */
        function clearTempImgObj() {
            var imgObj = this;
            imgObj.bgUrl = imgObj.titleUrl = '';
        }

        /**
         * 如果一个上传条目上传完毕，将该上传条目push到用户setting.data数组中，
         * 并且如果用户所选数量大于已经完成上传的上传条目数量，则添加新的待上传条目
         */
        $scope.$watch('vm.imgObj', function (newImgObj) {
            if (_.every(newImgObj)) {
                if (_.size($scope.vm.imgs) < $scope.setting.num) {
                    addEmptyUploadItem();
                }
                $scope.setting.data.push(angular.copy(newImgObj));
                clearTempImgObj.call($scope.vm.imgObj);
            }
        }, true);

        /**
         * 保存用户配置信息
         */
        $scope.save = function () {
            var num = parseInt($scope.setting.num, 10),
                imgLen = _.size($scope.setting.data);
            if (num !== imgLen) {
                Dialog.alert(null, '上传内容数量不符合，请检查');
                return;
            }
            SettingService.saveUserSetting({
                mall_id: 1,
                case_id: caseId,
                module_name: moduleName,
                block_name: blockName,
                module_type: $scope.navModule.type,
                setting: $scope.setting,
                page_type: page_type
            }).then(function (data) {
                Dialog.alert(null, '保存成功');
            }, function (error) {
                Dialog.alert(null, error);
            });
        };

        /**
         * 上传背景图
         * @param $file 背景图
         * @param $index 视图上传条目索引
         */
        $scope.uploadBgImg = function ($file, $index) {
            $log.info($file);
            var promise = SettingService.upload($file);
            if (promise) {
                promise.success(function (data) {
                    var url = data.result.url;
                    $scope.vm.imgs[$index] = $scope.vm.imgs[$index] || {};
                    $scope.vm.imgs[$index].bgUrl = url;
                    $scope.vm.imgObj.bgUrl = url;
                }).error(function (error) {
                    Dialog.alert(null, error);
                });
            }
        };

        /**
         * 上传标题图
         * @param $file 标题图
         * @param $index 视图上传条目索引
         */
        $scope.uploadTitleImg = function ($file, $index) {
            $log.info($file);
            var promise = SettingService.upload($file);
            if (promise) {
                promise.success(function (data) {
                    var url = data.result.url;
                    $scope.vm.imgs[$index] = $scope.vm.imgs[$index] || {};
                    $scope.vm.imgs[$index].titleUrl = url;
                    $scope.vm.imgObj.titleUrl = url;
                }).error(function (error) {
                    Dialog.alert(null, error);
                });
            }
        };

        $scope.sortUp = function (img, imgs) {
            var index = imgs.indexOf(img),
                settingImg = $scope.setting.data[index],
                isFirstImg = index === 0;
            if (isFirstImg) return;
            SettingService.sortUp(img, imgs);
            SettingService.sortUp(settingImg, $scope.setting.data);
        };

        $scope.sortDown = function (img, imgs) {
            var index = imgs.indexOf(img),
                settingImg = $scope.setting.data[index],
                isLastImg = index === (_.size($scope.setting.data) - 1);
            if (isLastImg) return;
            SettingService.sortDown(img, imgs);
            SettingService.sortDown(settingImg, $scope.setting.data);
        };

        /**
         * 删除上传条目中的“背景图”和“标题图”数据
         * @param img 当前条目中的上传数据
         */
        $scope.deleteUpload = function (img) {
            var index = $scope.vm.imgs.indexOf(img),
                isCompleteObj = $scope.isUploadComplete(img);

            if (isCompleteObj) {
                $scope.vm.imgs.splice(index, 1);
                $scope.setting.data.splice(index, 1);
                if (_.size($scope.vm.imgs) < $scope.setting.num) {
                    addEmptyUploadItem();
                }
            } else {
                clearTempImgObj.call(img);
            }
        };

        /**
         * 检查上传条目是否完成，完成条件：“背景图”和“标题图”都上传完毕
         * @param img 当前上传条目上传数据
         */
        $scope.isUploadComplete = function (img) {
            return _.every(img);
        };

    });
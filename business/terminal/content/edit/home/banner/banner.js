/**
 * @file 广告设置
 * @author zhaoran
 * @date 2015-09-19
 */

angular.module('cms').controller('TerminalContentEditHomeBannerCtrl',
    function ($scope, $stateParams, Dialog, SettingService, $log, caseData, Upload, caseConfig) {

        var settingScope = $scope.$parent.$parent,
            moduleName = $stateParams.moduleName,
            blockName = $stateParams.blockName,
            caseId = $stateParams.caseId,
            page_type = settingScope.userData.page_type;

        settingScope.userData.selectedModuleName = moduleName;

        $scope.adModule = _.findWhere($scope.modules, {name: moduleName});
        $scope.setting = SettingService.getModuleSetting(
            caseData,
            blockName,
            moduleName,
            settingScope,
            {
                num: 1,
                mode: "default",
                effect: "scrollLeft",
                interval: 4,
                loop: 'loop',
                data: []
            }
        );

        $log.info(caseData, caseConfig);

        $scope.vm = {
            uploadFiles: null,
            type: {},
            effect: ''
        };

        //angular.forEach(caseData.result, function(val, key) {
        //    if(key === 'd') {
        //        settingScope.userData.blockExistSameModule =
        //        caseConfig.result.modules[_.first(_.keys(val))]['type'];
        //    }
        //});

        /**
         * 删除上传的内容
         * @param file
         */
        $scope.deleteUpload = function (file) {
            var index = $scope.setting.data.indexOf(file);
            $scope.setting.data.splice(index, 1);
        };

        /**
         * 图片、视频上传
         * @param $files 图片、视频文件，支持单个或多个
         */
        $scope.upload = function ($files) {
            var type = null,
                size,
                len = null,
                $file = null,
                totalTime,
                isVideoExist = hasUploadVideo();
            if(_.size($files)) {
                if(isVideoExist) {
                    Dialog.alert(null, '只能上传1个视频文件');
                    return;
                }
                len = $files.length;
                for(var i = 0; i < len; i++) {
                    $file = $files[i];
                    type = ($file.type.indexOf('image') !== -1) ? 'image' : 'video';
                    size = $file.size;
                    if(type === 'image' && size > 90000) {
                        Dialog.alert(null, '图片大小超出限制');
                        return;
                    }
                    if(type === 'video' && size > 20000000) {
                        Dialog.alert(null, '视频大小超出限制');
                        return;
                    }
                    if(type === 'image') {
                        totalTime = $scope.setting.interval;
                    }
                    if(type === 'video') {
                        totalTime = 15;
                    }

                    Upload.upload({
                        url: '/api/upload/front',
                        method: 'POST',
                        file: $file,
                        fields: {
                            mall_id: 1
                        }
                    }).success(function(data) {
                        var url = data.result.url,
                            fileObj = {
                                totalTime: totalTime,
                                type: type,
                                url: url
                            };
                        $scope.setting.data.push(fileObj);
                    }).error(function (error) {
                        Dialog.alert(error);
                    });
                }
            }
        };

        /**
         * 检查是否已经上传了视频
         */
        function hasUploadVideo() {
            var typeArr;
            typeArr = _.pluck($scope.setting.data, 'type');
            return _.contains(typeArr, 'video');
        }

        /**
         * 向上排序
         * @param file
         */
        $scope.sortUp = function (file) {
            SettingService.sortUp(file, $scope.setting.data);
        };

        /**
         * 向下排序
         * @param file
         */
        $scope.sortDown = function (file) {
            SettingService.sortDown(file, $scope.setting.data);
        };

        /**
         * 保存用户配置
         */
        $scope.save = function () {
            var num = parseInt($scope.setting.num, 10),
                fileLen = _.size($scope.setting.data);
            if(num !== fileLen) {
                Dialog.alert(null, '上传内容数量不符合，请检查');
                return;
            }
            SettingService.saveUserSetting({
                mall_id: 1,
                case_id: caseId,
                module_name: moduleName,
                block_name: blockName,
                module_type: $scope.adModule.type,
                setting: $scope.setting,
                page_type: page_type
            }).then(function (data) {
                Dialog.alert(null, '保存成功');
            }, function (error) {
                Dialog.alert(null, error);
            });
        };
    });
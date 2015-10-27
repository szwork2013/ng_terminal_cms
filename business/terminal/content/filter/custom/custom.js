/**
 * @file 首页模版筛选
 * @author
 * @date 2015-09-17
 */

angular.module('cms').controller('TerminalContentFilterCustomCtrl',
    function ($scope, customData, $log, FilterService, Dialog, ListService, $state) {

        $log.info(customData);

        var params = {};

        $scope.customLayoutList = customData.result.data;

        $scope.$on('tagFilter', function(e , data) {
            getCustomLayoutFilteredList({tag: data});
        });

        $scope.$on('directionFilter', function(e, data) {
            getCustomLayoutFilteredList({direction: data});
        });

        $scope.$on('colorFilter', function(e, data) {
            getCustomLayoutFilteredList({color: data});
        });

        function getCustomLayoutFilteredList(filter) {
            var defaultData = {
                     mall_id: 1
                };
            params = angular.extend(params, defaultData, filter);
            FilterService.getLayoutList(params).then(function(data) {
                $scope.customLayoutList = data.result.data;
            }, function(error) {
                Dialog.alert(error);
            });
        }

        $scope.tplCreate = function(customLayout) {
            var isCaseNameValid = FilterService.validateCaseName($scope.$parent.caseNameForm),
                isFilterValid;
            if(!isCaseNameValid) return;

            isFilterValid = FilterService.validateFilter(params);
            if(!isFilterValid) return;

            ListService.createTpl({
                mall_id: params.mall_id,
                name: $scope.$parent.vm.caseName,
                layout_name: customLayout.name,
                color: params.color,
                tag: params.tag,
                direction: params.direction
            }).then(function(data) {
                $state.go('cms.terminal.content.edit.setting', {caseId: data.result.id});
            }, function(error) {
                Dialog.alert(error);
            });

        };
    });
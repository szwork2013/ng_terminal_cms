/**
 * @file 首页模版筛选
 * @author
 * @date 2015-09-17
 */

angular.module('cms').controller('TerminalContentFilterCtrl',
    function ($scope, $log, filterData, FilterService) {
        //debugger;
        var filterDataTransformed = FilterService.transformFilterData(filterData);
        $log.info(filterDataTransformed);
        $scope.tabs = [
            {
                title: '标准版',
                fullKey: 'content.filter.standard',
                reload: true
            },
            {
                title: '自定义',
                fullKey: 'content.filter.custom',
                reload: true
            }
        ];
        $scope.vm = {
            caseName: ''
        };

        $scope.filterActive = FilterService.getInitFilterActive();
        $scope.filterData = filterDataTransformed.result;

        $scope.tagFilter = function (tag) {
            $log.info(tag);
            $scope.filterActive.tagFilter = tag.enTxt;
            $scope.$broadcast('tagFilter', tag.enTxt);
        };
        $scope.colorFilter = function (color) {
            $log.info(color);
            $scope.filterActive.colorFilter = color;
            $scope.$broadcast('colorFilter', color);
        };
        $scope.directionFilter = function (direction) {
            $log.info(direction);
            $scope.filterActive.directionFilter = direction.enTxt;
            $scope.$broadcast('directionFilter', direction.enTxt);
        };
    });
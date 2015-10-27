/**
 * @file 首页列表
 * @author zhaoran
 * @date 2015-09-16
 */
angular.module('cms').controller('TerminalContentListCtrl',
    function ($scope, Constant, $log, ListService, Dialog, $state, caseUsing) {

        $scope.pagination = {
            currentPage: 1,
            pageSize: Constant.pageSize,
            total: null
        };
        requestPageList();

        $scope.vm = {
            usingCaseName: caseUsing.result.name,
            hasDeploy: caseUsing.result.has_deploying
        };

        /**
         * 方案删除
         * @param caseObj 方案对象
         */
        $scope.delete = function (caseObj) {
            if(caseObj.status !== Constant.CASE_STATUS_UNUSED) return;
            Dialog.confirm(null, '删除后无法恢复是否确认删除', function () {
                ListService.deleteCase({
                    mall_id: 1,
                    case_id: caseObj.id
                }).then(function (data) {
                    var index = $scope.caseList.indexOf(caseObj);
                    $scope.caseList.splice(index, 1);
                    requestPageList();
                }, function (error) {
                    Dialog.alert(null, error);
                });
            });
        };

        /**
         * 方案启用
         * @param caseObj 方案
         */
        $scope.enable = function(caseObj) {
            ListService.enable({
                mall_id: 1,
                case_id: caseObj.id
            }).then(function() {
                requestPageList();
            }, function(error) {
                Dialog.alert(null, error);
            });
        };

        /**
         * 方案发布
         * @param caseObj 方案对象
         */
        $scope.release = function(caseObj) {
            ListService.releaseCase({
                mall_id: 1,
                case_id: caseObj.id
            }).then(function() {
                requestPageList();
            }, function(error) {
                Dialog.alert(null, error);
            });
        };

        /**
         * 方案编辑页跳转
         * @param caseObj
         */
        $scope.edit = function (caseObj) {
            $state.go('cms.terminal.content.edit.setting', {
                caseId: caseObj.id
            });
        };

        /**
         * 方案预览
         * @param caseObj
         */
        $scope.preview = function (caseObj) {

        };

        /**
         * 前端界面分页ng-change事件
         */
        $scope.pageChangeHandler = function () {
            requestPageList();
        };

        /**
         * 方案列表分页请求
         */
        function requestPageList() {
            ListService.getCaseList({
                mall_id: 1,
                page: $scope.pagination.currentPage,
                page_size: 10
            }).then(function (data) {
                $scope.caseList = data.result.data;
                $scope.pagination.pageSize = data.pageSize;
                $scope.pagination.total = data.result.total;
            }, function (error) {
                Dialog.alert(null, error);
            });
        }

        /**
         * 获取方案序号
         * @param $index 当前页方案列表数据ng-repeat索引
         * @returns {*} 当前页序号
         */
        $scope.getCaseIndex = function($index) {
            var baseIndex = ($scope.pagination.currentPage - 1) * 10;
            return $index + 1 + baseIndex;
        };

    });
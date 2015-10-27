/**
 * Created by dulin on 2015/10/19.
 */
angular.module('cms').controller('TerminalContentCouponCtrl',
    function ($scope, $log, $modal, couponService, Constant, Dialog, mallInfo) {

        var nowDateTime = moment().format('YYYY-MM-DD HH:mm');

        $scope.couponTabs = [
            {
                text: '全部',
                key: 'all',
                status: ''
            },
            {
                text: '未发布',
                key: 'notReleased',
                status: 1
            },
            {
                text: '在线',
                key: 'online',
                status: 2
            },
            {
                text: '已失效',
                key: 'outOfDate',
                status: 3
            }
        ];

        $scope.vm = {
            couponList: null,
            currentPage: 1,
            pageSize: Constant.pageSize,
            total: -1,
            filter: {
                title: '',
                publisher: '',
                publish_time: '',
                from: '',
                to: '',
                status: ''
            }
        };

        initDatePicker();
        requestCouponList();

        /**
         * 初始化过滤条件的datepicker
         */
        function initDatePicker() {
            var rangeTimeConfig = angular.extend({}, Constant.COUPON_DATE_PICKER_OPTIONS, {
                singleDatePicker: false,
                autoUpdateInput: false
            });

            var releaseTimeConfig = angular.extend({}, Constant.COUPON_DATE_PICKER_OPTIONS, {
                autoUpdateInput: false
            });

            $('#couponReleaseTimeFilter').daterangepicker(releaseTimeConfig)
                .on('apply.daterangepicker', function(ev, picker) {
                    var startDate = picker.startDate.format('YYYY-MM-DD HH:mm');
                    $scope.vm.filter.publish_time = startDate;
                    picker.setStartDate(startDate);
                    $(this).val(startDate).trigger('change');
                }).on('cancel.daterangepicker', function(ev, picker) {
                    $scope.vm.filter.publish_time = '';
                    $(this).val('').trigger('change');
                });

            $('#couponRangeTimeFilter').daterangepicker(rangeTimeConfig)
                .on('apply.daterangepicker', function (ev, picker) {
                    var startDate = picker.startDate.format('YYYY-MM-DD HH:mm'),
                        endDate = picker.endDate.format('YYYY-MM-DD HH:mm');
                    $scope.vm.filter.from = startDate;
                    $scope.vm.filter.to = endDate;
                    picker.setStartDate(startDate);
                    picker.setEndDate(endDate);
                    $(this).val(startDate + picker.locale.separator + endDate).trigger('change');
                }).on('cancel.daterangepicker', function(ev, picker) {
                    $scope.vm.filter.from = '';
                    $scope.vm.filter.to = '';
                    $(this).val('').trigger('change');
                });
        }

        /**
         * 根据查询条件查询优惠信息
         */
        $scope.queryCoupon = function () {
            requestCouponList($scope.vm.filter);
        };

        /**
         * 打开优惠信息详情模态框
         * @param coupon 当前优惠
         */
        $scope.couponDetail = function (coupon) {
            couponService.getCouponInfo({
                mall_id: 1,
                id: coupon.id
            }).success(function (data) {
                var couponInfo = data.result;
                $modal.open({
                    templateUrl: __uri('./directive/couponDetail.html'),
                    controller: 'CouponDetailModalCtrl',
                    resolve: {
                        couponInfo: function () {
                            return couponInfo;
                        },
                        mallInfo: function () {
                            return mallInfo.result;
                        }
                    }
                });
            }).error(function (error) {
                Dialog.alert(null, error);
            });
        };

        /**
         * 请求优惠信息列表，过滤条件(可选)
         */
        function requestCouponList(extendParams) {
            var params = angular.extend({
                mall_id: 1,
                page: $scope.vm.currentPage,
                page_size: $scope.vm.pageSize
            }, extendParams);

            couponService.getCouponList(params)
                .success(function (data) {
                    var result = data.result;
                    $scope.vm.currentPage = result.cur_page;
                    $scope.vm.total = result.total;
                    $scope.vm.couponList = result.data;
                }).error(function (error) {
                    Dialog.alert(null, error);
                });
        }

        /**
         * 分页处理函数-请求优惠信息列表
         */
        $scope.pageChangeHandler = function () {
            requestCouponList();
        };

        /**
         * 优惠信息tab页处理函数
         * 过滤优惠信息列表
         * @param couponTab 点击的tab标签
         */
        $scope.couponTabClickHandler = function (couponTab) {
            var statusFilter;
            $scope.vm.filter.status = couponTab.status;

            if (couponTab.status !== 0) {
                statusFilter = {status: couponTab.status};
            }

            requestCouponList.call(this, statusFilter);
        };

        /**
         * 创建和编辑优惠信息
         * @param opts
         */
        $scope.createAndEditCoupon = function (opts) {
            $modal.open({
                templateUrl: __uri('./directive/createAndEditCoupon.html'),
                controller: 'CreateAndEditCouponModalCtrl',
                backdrop: 'static',
                size: 'wp700',
                keyboard: false,
                resolve: {
                    couponData: function () {
                        return opts ? opts.couponData : '';
                    },
                    nowDateTime: function () {
                        return nowDateTime;
                    },
                    mallInfo: function () {
                        return mallInfo.result;
                    }
                }
            }).result.then(function (newCouponData) {
                    if (newCouponData) {
                        if (angular.isDefined(opts)) {
                            (opts.cb || angular.noop).call(this, newCouponData);
                        } else {
                            //TODO 新建优惠
                            couponService.createCoupon(newCouponData)
                                .success(function (data) {
                                    if (data.result.id) {
                                        Dialog.alert(null, '新建成功');
                                        requestCouponList();
                                    }
                                }).error(function (error) {
                                    Dialog.alert(null, error);
                                });
                        }
                    }
                }, function (reason) {
                    $log.info(reason);
                });
        };

        /**
         * 停用优惠信息
         * @param coupon 当前优惠信息
         */
        $scope.stopCoupon = function (coupon) {
            $modal.open({
                templateUrl: __uri('./directive/stopCoupon.html'),
                controller: 'StopCouponModalCtrl',
                windowClass: 'modal-vcenter',
                size: 'wp400'
            }).result.then(function (isConfirm) {
                    if (isConfirm) {
                        couponService.stopCoupon({
                            mall_id: 1,
                            id: coupon.id
                        }).success(function (data) {
                            //Dialog.confirm(null, '停用成功', function() {
                            requestCouponList();
                            //});
                        }).error(function (error) {
                            Dialog.alert(null, error);
                        });
                    }
                }, function (reason) {
                    $log.info(reason);
                });
        };

        /**
         * 编辑优惠信息
         * @param coupon 当前优惠信息
         */
        $scope.editCoupon = function (coupon) {
            $scope.createAndEditCoupon({
                couponData: coupon,
                cb: function (updateData) {
                    //TODO 编辑优惠
                    couponService.updateCoupon(updateData)
                        .success(function (data) {
                            Dialog.alert(null, '编辑成功');
                            requestCouponList();
                        }).error(function (error) {
                            Dialog.alert(null, error);
                        });
                }
            });
        };

    }).controller('CreateAndEditCouponModalCtrl',
    function ($scope, $rootScope, $modalInstance, $log, Constant, couponData, couponService, nowDateTime, mallInfo, SettingService, Dialog) {

        $scope.coupon = {
            start_time: couponData.start_time || nowDateTime,
            end_time: couponData.end_time || nowDateTime,
            publish_time: couponData.publish_time || nowDateTime,
            title: couponData.title || '',
            mall_id: mallInfo.id,
            merchant_id: couponData.merchant_id,
            merchant_name: couponData.merchant_name,
            introduction: couponData.introduction || ''
        };

        $scope.vm = {
            malls: [],
            showMerchantListMenu: false,
            total: -1,
            currentPage: 1,
            pageSize: 10,
            merchantList: null,
            queryMerchant: '',
            modalTitle: couponData ? '编辑优惠' : '新建优惠'
        };

        if (!angular.isArray(mallInfo)) {
            $scope.vm.malls.push(mallInfo);
        } else {
            $scope.vm.malls.concat(mallInfo);
        }
        $scope.coupon.mall_id = _.first($scope.vm.malls)['id'];

        $modalInstance.rendered.then(initDatePicker);

        /**
         * 初始化datepicker，如果是编辑操作，则拉取当前编辑的优惠信息的数据
         */
        function initDatePicker() {
            var rangeTimeConfig = angular.extend({}, Constant.COUPON_DATE_PICKER_OPTIONS, {
                singleDatePicker: false,
                startDate: $scope.coupon.start_time,
                endDate: $scope.coupon.end_time
            });

            var releaseTimeConfig = angular.extend({}, Constant.COUPON_DATE_PICKER_OPTIONS, {
                startDate: $scope.coupon.publish_time
            });

            $('#couponReleaseTime').daterangepicker(releaseTimeConfig,
                function (start) {
                    $scope.coupon.publish_time = start.format('YYYY-MM-DD HH:mm');
                });

            $('#couponRangeTime').daterangepicker(rangeTimeConfig,
                function (start, end) {
                    $scope.coupon.start_time = start.format('YYYY-MM-DD HH:mm');
                    $scope.coupon.end_time = end.format('YYYY-MM-DD HH:mm');
                });
        }

        /**
         * 店铺列表请求
         * @param exParams 额外的字段
         */
        function requestMerchantList(exParams) {
            var parmas = angular.extend({
                mall_id: 1,
                page: $scope.vm.currentPage,
                page_size: $scope.vm.pageSize
            }, exParams);

            SettingService.getShopList(parmas)
                .success(function (data) {
                    var result = data.result;
                    $scope.vm.showMerchantListMenu = true;
                    $scope.vm.total = result.total;
                    $scope.vm.currentPage = result.cur_page;
                    $scope.vm.merchantList = result.data;
                }).error(function (error) {
                    Dialog.alert(null, error);
                });
        }

        /**
         * 打开或关闭店铺列表下拉菜单，打开操作时，请求店铺列表数据
         */
        $scope.openMerchantDropMenu = function () {
            if (!$scope.vm.showMerchantListMenu) {
                requestMerchantList();
            } else {
                $scope.vm.showMerchantListMenu = false;
            }
        };

        $scope.pageChangeHandler = function () {
            requestMerchantList();
        };

        /**
         * 选择要关联的店铺
         * @param merchant 店铺obj
         */
        $scope.selectMerchant = function (merchant) {
            $scope.vm.showMerchantListMenu = false;
            $scope.coupon.merchant_id = merchant.id;
            $scope.coupon.merchant_name = merchant.name;
        };

        /**
         * 查询店铺
         */
        $scope.queryMerchant = function () {
            requestMerchantList({keyword: $scope.vm.queryMerchant});
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('取消');
        };

        /**
         * 确认新建
         */
        $scope.confirm = function () {
            var coupon;
            if ($scope.createAndEditCouponForm.$valid) {
                if (couponData) {
                    coupon = angular.extend({}, $scope.coupon, {id: couponData.id});
                } else {
                    coupon = $scope.coupon;
                }
                $modalInstance.close(coupon);
            }
        };

        $rootScope.$on('$stateChangeStart', function () {
            $scope.cancel();
        });

    }).controller('StopCouponModalCtrl',
    function ($scope, $modalInstance, $log, $rootScope) {
        $scope.cancel = function () {
            $modalInstance.dismiss('取消');
        };

        $scope.confirm = function () {
            $modalInstance.close(true);
        };

        $rootScope.$on('$stateChangeStart', function () {
            $scope.cancel();
        });
    }).controller('CouponDetailModalCtrl', function ($scope, $modalInstance, $log, couponInfo, mallInfo, $rootScope) {
        $scope.vm = {
            couponInfo: couponInfo,
            mall: mallInfo
        };

        $rootScope.$on('$stateChangeStart', function () {
            $modalInstance.dismiss();
        });
    });
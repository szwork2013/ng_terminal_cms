/**
 * @file 路由
 * @author zhaoran
 * @date 2015-09-15
 */

require('business/terminal');

require('business/terminal/content');

require('business/terminal/content/list');
require('business/terminal/content/list/service');

require('business/terminal/content/coupon');
require('business/terminal/content/coupon/service');

require('business/terminal/content/filter');
require('business/terminal/content/filter/service');
require('business/terminal/content/filter/standard');
require('business/terminal/content/filter/custom');

require('business/terminal/content/edit');
require('business/terminal/content/edit/service');

require('business/terminal/content/edit/setting');
require('business/terminal/content/edit/setting/service');

require('business/terminal/content/edit/home');
require('business/terminal/content/edit/home/block');
require('business/terminal/content/edit/home/banner');
require('business/terminal/content/edit/home/func');
require('business/terminal/content/edit/home/info');
require('business/terminal/content/edit/home/nav');

require('business/terminal/content/edit/brand');
require('business/terminal/content/edit/brand/block');
require('business/terminal/content/edit/brand/brand');

require('business/terminal/content/edit/floor');
require('business/terminal/content/edit/floor/block');
require('business/terminal/content/edit/floor/floor');

require('business/terminal/directives/scrollFix');

require('business/terminal/demo/carousel');
require('business/terminal/demo/load_module');
require('business/terminal/demo/nav');
require('business/terminal/demo/func');
require('business/terminal/demo/ry_carousel');
require('business/terminal/demo/brand');
require('business/terminal/demo/infinite_scroll');
require('business/terminal/demo/banner');


angular.module('cms').config(function ($stateProvider, $urlRouterProvider, Constant, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://mcms.rongyi.com/upload/**']);

    $urlRouterProvider
        .when('/cms/terminal', '/cms/terminal/content/list')
        .when('/cms/terminal/content', '/cms/terminal/content/list')
        .when('/cms/terminal/content/filter', '/cms/terminal/content/filter/standard')
        .when('/cms/terminal/content/edit', '/cms/terminal/content/edit/setting');

    $stateProvider
        .state('cms.terminal', {
            abstract: true,
            url: '/terminal',
            template: '<div ui-view pos="cms.terminal"></div>',
            controller: 'TerminalCtrl'
        });

    $stateProvider
        .state('cms.terminal.content', {
            abstract: true,
            url: '/content',
            template: '<div ui-view pos="cms.terminal.content"></div>'
        })
        .state('cms.terminal.content.list', {
            url: '/list',
            templateUrl: __uri('/business/terminal/content/list/list.html'),
            controller: 'TerminalContentListCtrl',
            resolve: {
                caseUsing: function(SettingService) {
                    return SettingService.getCaseUsing({
                        mall_id: 1
                    });
                }
            }
        })
        .state('cms.terminal.content.coupon', {
            url: '/coupon',
            templateUrl: __uri('/business/terminal/content/coupon/coupon.html'),
            controller: 'TerminalContentCouponCtrl',
            resolve: {
                mallInfo: function(SettingService) {
                    return SettingService.getMallInfo({
                        mall_id: 1
                    });
                }
            }
        })
        .state('cms.terminal.content.filter', {
            url: '/filter',
            templateUrl: __uri('/business/terminal/content/filter/filter.html'),
            controller: 'TerminalContentFilterCtrl',
            resolve: {
                filterData: function (FilterService) {
                    return FilterService.getFilterData();
                }
            }
        })
        .state('cms.terminal.content.filter.standard', {
            url: '/standard',
            templateUrl: __uri('/business/terminal/content/filter/standard/standard.html'),
            controller: 'TerminalContentFilterStandardCtrl'
        })
        .state('cms.terminal.content.filter.custom', {
            url: '/custom',
            templateUrl: __uri('/business/terminal/content/filter/custom/custom.html'),

            controller: 'TerminalContentFilterCustomCtrl',
            resolve: {
                customData: ['FilterService', function (FilterService) {
                    return FilterService.getLayoutList({
                        mall_id: 1
                    });
                }]
            }
        })
        .state('cms.terminal.content.edit', {
            abstract: true,
            url: '/edit',
            template: '<div ui-view pos="cms.terminal.content.edit"></div>'
        })
        .state('cms.terminal.content.edit.setting', {
            url: '/setting/:caseId',
            templateUrl: __uri('/business/terminal/content/edit/setting/setting.html'),
            controller: 'TerminalContentEditSettingCtrl',
            resolve: {
                caseInfo: function (EditService, $stateParams) {
                    var caseId = parseInt($stateParams.caseId);
                    return EditService.getCaseInfo({
                        mall_id: 1,
                        case_id: caseId
                    });
                }
            }
        })
        .state('cms.terminal.content.edit.home', {
            url: '/home/:caseId/:type',
            templateUrl: __uri('/business/terminal/content/edit/home/home.html'),
            controller: 'TerminalContentEditHomeCtrl',
            resolve: {
                caseData: function (SettingService, $stateParams) {
                    var caseId = parseInt($stateParams.caseId),
                        type = $stateParams.type;
                    return SettingService.getCasePageModuleAll({
                        mall_id: 1,
                        case_id: caseId,
                        page_type: type
                    });
                },

                caseConfig: function (SettingService, $stateParams) {
                    var caseId = parseInt($stateParams.caseId),
                        type = $stateParams.type;
                    return SettingService.getCasePageConfig({
                        mall_id: 1,
                        case_id: caseId,
                        type: type
                    });
                },
                mallInfo: function(SettingService) {
                    return SettingService.getMallInfo({
                        mall_id: 1
                    });
                }
            }
        })
        .state('cms.terminal.content.edit.home.block', {
            url: '/:blockName',
            templateUrl: __uri('/business/terminal/content/edit/home/block/block.html'),
            controller: 'TerminalContentEditHomeBlockCtrl'
        })
        .state('cms.terminal.content.edit.home.block.module', {
            url: '/:moduleName',
            templateProvider: function ($stateParams, caseConfig) {
                var map = {
                    banner: __inline('/business/terminal/content/edit/home/banner/banner.html'),
                    func: __inline('/business/terminal/content/edit/home/func/func.html'),
                    info: __inline('/business/terminal/content/edit/home/info/info.html'),
                    nav: __inline('/business/terminal/content/edit/home/nav/nav.html')
                };

                var modules = caseConfig.result.modules;
                var moduleType = modules[$stateParams.moduleName].type;
                return map[moduleType];
            },
            controllerProvider: function ($stateParams, caseConfig) {
                var modules = caseConfig.result.modules;
                var moduleName = modules[$stateParams.moduleName].type;

                var controllerName = 'TerminalContentEditHome-' + moduleName + '-Ctrl';
                return $.camelCase(controllerName);
            }
        })
        /*--------------------------品牌导购------------------------------*/
        .state('cms.terminal.content.edit.brand', {
            url: '/brand/:caseId/:type',
            templateUrl: __uri('/business/terminal/content/edit/brand/brand.html'),
            controller: 'TerminalContentEditBrandCtrl',
            resolve: {
                caseData: function (SettingService, $stateParams) {
                    var caseId = parseInt($stateParams.caseId),
                        type = $stateParams.type;
                    return SettingService.getCasePageModuleAll({
                        mall_id: 1,
                        case_id: caseId,
                        page_type: type
                    });
                },

                caseConfig: function (SettingService, $stateParams) {
                    var caseId = parseInt($stateParams.caseId),
                        type = $stateParams.type;
                    return SettingService.getCasePageConfig({
                        mall_id: 1,
                        case_id: caseId,
                        type: type
                    });
                },

                shopCatg: function(SettingService) {
                    return SettingService.getShopCatg({
                        mall_id: 1
                    });
                }
            }
        })
        .state('cms.terminal.content.edit.brand.block', {
            url: '/:blockName',
            templateUrl: __uri('/business/terminal/content/edit/brand/block/block.html'),
            controller: 'TerminalContentEditBrandBlockCtrl'
        })
        .state('cms.terminal.content.edit.brand.block.module', {
            url: '/:moduleName',
            templateProvider: function ($stateParams, caseConfig) {
                var map = {
                    brand: __inline('/business/terminal/content/edit/brand/brand/brand.html')
                };

                var modules = caseConfig.result.modules;
                var moduleType = modules[$stateParams.moduleName].type;
                return map[moduleType];
            },
            controllerProvider: function ($stateParams, caseConfig) {
                var modules = caseConfig.result.modules;
                var moduleName = modules[$stateParams.moduleName].type;

                var controllerName = 'TerminalContentEditBrand-' + moduleName + '-Ctrl';
                return $.camelCase(controllerName);
            }
        })
        /*--------------------------楼层导购------------------------------*/
        .state('cms.terminal.content.edit.floor', {
            url: '/floor/:caseId/:type',
            templateUrl: __uri('/business/terminal/content/edit/floor/floor.html'),
            controller: 'TerminalContentEditFloorCtrl',
            resolve: {
                caseData: function (SettingService, $stateParams) {
                    var caseId = parseInt($stateParams.caseId),
                        type = $stateParams.type;
                    return SettingService.getCasePageModuleAll({
                        mall_id: 1,
                        case_id: caseId,
                        page_type: type
                    });
                },

                caseConfig: function (SettingService, $stateParams) {
                    var caseId = parseInt($stateParams.caseId),
                        type = $stateParams.type;
                    return SettingService.getCasePageConfig({
                        mall_id: 1,
                        case_id: caseId,
                        type: type
                    });
                },

                floorData: function(SettingService) {
                    return SettingService.getFloorData({
                        mall_id: 1
                    });
                },

                facilityDefaultIcon: function (SettingService, Dialog) {
                    return SettingService.getFacilityDefaultIcon()
                        .then(function (data) {
                            return data.result;
                        }, function (error) {
                            Dialog.alert(null, error);
                        });
                }
            }
        })
        .state('cms.terminal.content.edit.floor.block', {
            url: '/:blockName',
            templateUrl: __uri('/business/terminal/content/edit/floor/block/block.html'),
            controller: 'TerminalContentEditFloorBlockCtrl'
        })
        .state('cms.terminal.content.edit.floor.block.module', {
            url: '/:moduleName',
            templateProvider: function ($stateParams, caseConfig) {
                var map = {
                    floor: __inline('/business/terminal/content/edit/floor/floor/floor.html')
                };

                var modules = caseConfig.result.modules;
                var moduleType = modules[$stateParams.moduleName].type;
                return map[moduleType];
            },
            controllerProvider: function ($stateParams, caseConfig) {
                var modules = caseConfig.result.modules;
                var moduleName = modules[$stateParams.moduleName].type;

                var controllerName = 'TerminalContentEditFloor-' + moduleName + '-Ctrl';
                return $.camelCase(controllerName);
            }
        })

    $stateProvider
        .state('cms.terminal.demo', {
            abstract: true,
            url: '/demo',
            template: '<div ui-view pos="cms.terminal.home"></div>'
        })
        .state('cms.terminal.demo.carousel', {
            url: '/carousel',
            templateUrl: __uri('/business/terminal/demo/carousel/carousel.html')
            //template: '<div ui-view pos="cms.terminal.home"></div>'
        })
        .state('cms.terminal.demo.info', {
            url: '/info',
            templateUrl: __uri('/business/terminal/demo/info/info.html'),
            controller: 'TerminalDemoInfoCtrl'
            //template: '<div ui-view pos="cms.terminal.home"></div>'
        })
        .state('cms.terminal.demo.load_module', {
            url: '/load_module',
            templateUrl: __uri('/business/terminal/demo/load_module/load_module.html'),
            controller: 'TerminalDemoLoadModuleCtrl'
            //template: '<div ui-view pos="cms.terminal.home"></div>'
        })
        .state('cms.terminal.demo.nav', {
            url: '/nav',
            templateUrl: __uri('/business/terminal/demo/nav/nav.html')
            //template: '<div ui-view pos="cms.terminal.home"></div>'
        })
        .state('cms.terminal.demo.func', {
            url: '/func',
            templateUrl: __uri('/business/terminal/demo/func/func.html'),
            controller: 'TerminalDemoFuncCtrl'
            //template: '<div ui-view pos="cms.terminal.home"></div>'
        })
        .state('cms.terminal.demo.ry_carousel', {
            url: '/ry_carousel',
            templateUrl: __uri('/business/terminal/demo/ry_carousel/ry_carousel.html'),
            controller: 'TerminalDemoRyCarouselCtrl'
            //template: '<div ui-view pos="cms.terminal.home"></div>'
        })
        .state('cms.terminal.demo.brand', {
            url: '/brand',
            templateUrl: __uri('/business/terminal/demo/brand/brand.html'),
            controller: 'TerminalDemoBrandCtrl'
            //template: '<div ui-view pos="cms.terminal.home"></div>'
        })
        .state('cms.terminal.demo.infinite_scroll', {
            url: '/infinite_scroll',
            templateUrl: __uri('/business/terminal/demo/infinite_scroll/infinite_scroll.html'),
            controller: 'TerminalDemoInfiniteScrollCtrl'
            //template: '<div ui-view pos="cms.terminal.home"></div>'
        })
		.state('cms.terminal.demo.banner', {
			url: '/banner',
			templateUrl: __uri('/business/terminal/demo/banner/banner.html'),
			controller: 'TerminalDemoBannerCtrl'
			//template: '<div ui-view pos="cms.terminal.home"></div>'
		});
});
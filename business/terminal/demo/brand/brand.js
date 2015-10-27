/**
 * Created by Ivan on 2015/10/9.
 */
angular.module('cms').controller('TerminalDemoBrandCtrl', function($scope, $timeout, Constant){
    $scope.selectedType = 'category';
    $scope.selectedBig = '1';
    $scope.selectedKey = '1';
    $scope.findList = [{
        key: 'category',
        name: '品牌查找'
    }, {
        key: 'abc',
        name: '字母查找'
    }, {
        key: 'floor',
        name: '楼层查找'
    }];


    var getItems = function(i) {
        var rtv = [];
        for (var j = 0; j < 6; j ++ ) {
            rtv.push({
                logo: '/terminal_static/business/terminal/demo/brand/img/logo.png',
                name: 'DOCTOR',
                type: '男女服饰',
                floor: 'L1',
                position: 1024 + (i || 0) + j,
                image: '/terminal_static/business/terminal/demo/brand/img/brand.jpg',
                tips: ['quan', 'hui', 'wait']
            });
        }
        return rtv;
    };
    $scope.items = getItems();

    $scope.nextPage = function() {
        if ($scope.busy) return;
        $scope.busy = true;

        $timeout(function() {
            $scope.items = $scope.items.concat(getItems($scope.items.length));
            $scope.busy = false;
        }, 3000);
    };
});
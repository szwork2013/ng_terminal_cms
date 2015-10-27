/**
 * Created by Ivan on 2015/9/19.
 */
angular.module('cms').controller('CarouselDemoCtrl', function ($scope) {
    //$scope.myInterval = 5000;

    // 是否动画
    $scope.noWrapSlides = false;
    var slides = $scope.slides = [{
        type: 'video',
        src: 'http://127.0.0.1:8080/terminal_static/business/terminal/carousel/img/ad1-pic1.png'
    }, {
        type: 'image',
        src: 'http://127.0.0.1:8080/terminal_static/business/terminal/carousel/img/ad1-pic1.png'
    }, {
        type: 'image',
        src: 'http://127.0.0.1:8080/terminal_static/business/terminal/carousel/img/ad1-pic2.png'
    }];

    var getInterval = function (obj) {
        var rtv;
        if (obj.type == 'video') {
            rtv = 15000;
        } else {
            rtv = 5000;
        }
        return rtv;
    };

    // 播放时长
    $scope.myInterval = getInterval(slides[0]);

    $scope.$watch(function () {
        for (var i = 0; i < slides.length; i++) {
            if (slides[i].active) {
                return slides[i];
            }
        }
    }, function (currentSlide, previousSlide) {
        if (currentSlide !== previousSlide) {
            $scope.myInterval = getInterval(currentSlide);
            console.log('currentSlide:', currentSlide);
        }
    });

    //console.log($scope.getCurrentIndex());
    //$scope.addSlide = function() {
    //  slides.push({
    //    image: 'http://127.0.0.1:8080/terminal_static/business/terminal/carousel/img/ad1-pic1.png'
    //  });
    //};

    //$scope.$watch('slides[0].active', function (active) {
    //  if (active) {
    //    console.log('slide 0 is active');
    //  }
    //});
});
/**
 * Created by dulin on 2015/9/30.
 */
angular.module('cmsDirective').directive('scrollFix', function ($log, $window, $document) {
    return {
        restrict: 'EA',
        replace: false,
        scope: {},
        link: function (scope, element, attrs) {
            var doc = $document[0],
                preview = doc.querySelector('.preview-area'),
                editAreaOffset = element.offset(),
                editAreaTop = editAreaOffset.top;

            $window.onscroll = function (e) {
                var rect = preview.getBoundingClientRect(),
                    top = rect.top,
                    $preview = angular.element(preview),
                    className = 'fix',
                    scrollY = doc.body.scrollTop || doc.documentElement.scrollTop;

                top <= 0 ?
                    $preview.addClass(className)
                    : angular.noop();

                scrollY <= editAreaTop ?
                    $preview.removeClass(className)
                    : angular.noop();
            };
        }
    }
});

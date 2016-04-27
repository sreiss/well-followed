/**
 * A spinner to show when a content should be loaded.
 */
angular.module('wellFollowed').directive('wfLoader', function() {
    return {
        restrict: 'AE',
        templateUrl: 'common/wf-loader.html',
        link: function (scope, element, attributes) {
            var parentHeight = element.parent().height();

            scope.marginTopBot = ((parentHeight - 32) / 2);
            if (scope.marginTopBot < 10) {
                scope.marginTopBot = 10;
            }
        }
    }
});
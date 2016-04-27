/**
 * A button with a loader displayed when isLoading is true.
 */
angular.module('wellFollowed').directive('wfLoaderButton', function() {
    return {
        restrict: 'E',
        templateUrl: 'common/wf-loader-button.html',
        transclude: true,
        scope: {
            clickCallback: '&',
            isLoading: '=',
            options: '=?'
        },
        link: function(scope, element, attributes) {

            scope.options = scope.options || {};
            scope.options.btnClass = 'default' || scope.options.btnClass;

        }
    };
});
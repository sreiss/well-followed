/**
 * Base directive for error pages.
 */
angular.module('wellFollowed').directive('wfError', function() {
    return {
        restrict: 'E',
        templateUrl: 'error/wf-error.html'
    };
});
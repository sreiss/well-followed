/**
 * Access denied error page.
 */
angular.module('wellFollowed').directive('wfErrorAccessDenied', function() {
    return {
        restrict: 'E',
        templateUrl: 'error/wf-error-access-denied.html'
    };
});
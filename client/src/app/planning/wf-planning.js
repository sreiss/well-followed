/**
 * Base directive for the planning screen.
 */
angular.module('wellFollowed').directive('wfPlanning', function() {
    return {
        restrict: 'E',
        templateUrl: 'planning/wf-planning.html'
    };
});
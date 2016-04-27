/**
 * Displayed when the given type of data isn't handled.
 */
angular.module('wellFollowed').directive('wfSensorNotImplemented', function() {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-sensor-not-implemented.html'
    }
});
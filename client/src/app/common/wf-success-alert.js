/**
 * Displays a success alert.
 */
angular.module('wellFollowed').directive('wfSuccessAlert', function() {
    return {
        restrict: 'E',
        templateUrl: 'common/wf-success-alert.html',
        scope: {
            alert: '=alertObject',
            close: '=',
            alertCount: '='
        },
        link: function(scope, element, attributes) {

        }
    };
});
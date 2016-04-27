/**
 * Displays a list of error or success alerts.
 */
angular.module('wellFollowed').directive('wfAlerts', function(wfAlertTypes, $timeout) {
    return {
        restrict: 'E',
        templateUrl: 'common/wf-alerts.html',
        scope: {
            alerts: '=?'
        },
        link: function(scope, element, attributes) {
            scope.alerts = scope.alerts || [];

            scope.alertTypes = wfAlertTypes;

            scope.$on('wfError', function(event, message) {
                scope.alerts.push({
                    type: wfAlertTypes.error,
                    message: message
                });
            });

            scope.close = function(alert) {
                scope.alerts.splice(scope.alerts.indexOf(alert), 1);
            };

            scope.$watch('alerts', function(alerts) {
                if (alerts.length > 0 && alerts[0].type === wfAlertTypes.success) {
                    $timeout(function() {
                        scope.alerts.shift();
                    }, 2000);
                }
            });
        }
    };
});
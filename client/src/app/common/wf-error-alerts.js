/**
 * Displays a list of error alerts.
 */
angular.module('wellFollowed').directive('wfErrorAlerts', function() {
   return {
       restrict: 'E',
       templateUrl: 'common/wf-error-alerts.html',
       link: function(scope, element, attributes) {
           scope.alerts = [];

           scope.$on('wfError', function(message) {
                scope.alerts.push({
                   message: message
                });
           });

           scope.close = function(alert) {
               scope.alerts.splice(scope.alerts.indexOf(alert), 1);
           };
       }
   };
});
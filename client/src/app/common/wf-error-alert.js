angular.module('wellFollowed').directive('wfErrorAlert', function() {
   return {
       restrict: 'E',
       templateUrl: 'common/wf-error-alert.html',
       scope: {
           alert: '=alertObject',
           close: '=',
           alertCount: '='
       },
       link: function(scope, element, attributes) {

       }
   };
});
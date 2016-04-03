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
           switch (scope.alert.message.message) {
               case 'login failed':
                   scope.alert.message = 'E-mail ou mot de passe incorrects.';
                   break;
               default:
                   scope.alert.message = scope.alert.message.message;
                   break;
           }
       }
   };
});
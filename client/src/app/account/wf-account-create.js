angular.module('wellFollowed').directive('wfAccountCreate', function($wfAuth, $state) {
   return {
       restrict: 'E',
       templateUrl: 'account/wf-account-create.html',
       require: '^wfApp',
       link: function(scope, element, attributes, wfApp) {

           wfApp.showErrors(false);

           scope.user = {};

           scope.subscribe = function() {
               $wfAuth.createUser(scope.user).then(function(result) {
                   wfApp.addSuccess('Utilisateur "' + result.data.username + '" enregistré.');
                   $state.go('login');
               });
           };
       }
   };
});
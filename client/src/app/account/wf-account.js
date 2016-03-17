angular.module('wellFollowed').directive('wfAccount', function($wfAuth, $wfUser, $state) {
   return {
       restrict: 'E',
       templateUrl: 'account/wf-account.html',
       require: '^wfApp',
       link: function(scope, element, attributes, wfApp) {

           //var unregister = scope.$watch(function() {
           //    return $wfAuth.getCurrentUser();
           //}, function(user) {
           //    if (!!user) {
           //        scope.user = user;
           //        unregister();
           //    }
           //});

           var storedUser = $wfAuth.getCurrentUser();

           scope.user = null;

           if (storedUser !== null) {
               $wfUser.getUser(storedUser.username)
                   .then(function (result) {
                       scope.user = result.data;
                   });
           } else {
               $state.go('login');
           }


           scope.previousState = wfApp.getPreviousState().name || 'sensor';

       }
   }
});
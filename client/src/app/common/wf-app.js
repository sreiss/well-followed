angular.module('wellFollowed').directive('wfApp', function($wfAuth, wfAlertTypes) {
   return {
       restrict: 'E',
       templateUrl: 'common/wf-app.html',
       controller: function($scope, $location) {

           $scope.alerts = [];
           $scope.showErrors = true;
           $scope.authentication = $wfAuth.authentication;
           $scope.previousState = {};

           this.getAuthentication = function() {
               return $scope.authentication;
           };

           this.showErrors = function(show) {
               $scope.showErrors = show;
           };

           this.addSuccess = function(message) {
                $scope.alerts.unshift({
                    type: wfAlertTypes.success,
                    message: message
                });
           };

           this.getPreviousState = function() {
                return $scope.previousState;
           };

           this.refreshMenu = function() {
                $scope.$broadcast('refreshMenu');
           };

           $scope.$on('$stateChangeSuccess', function(event, to, toParams, previous, previousParams) {
               $scope.showErrors = true;
               $scope.previousState = previous;
           });

           $scope.logOut = function() {
               $wfAuth.logout();
               $location.path('/connexion');
           }

       }
   }
});
angular.module('wellFollowed').directive('wfApp', function($wfAuth, wfAlertTypes, $state, WfUser, LoopBackAuth) {
   return {
       restrict: 'E',
       templateUrl: 'common/wf-app.html',
       controller: function($scope, $location) {

           var self = this;

           $scope.alerts = [];
           $scope.showErrors = true;
           $scope.isAuthenticated = WfUser.isAuthenticated();
           $scope.previousState = {};

           this.getAuthentication = function() {
               return $scope.isAuthenticated;
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
               LoopBackAuth.clearUser();
               LoopBackAuth.clearStorage();
               $scope.$broadcast('refreshMenu');
               $state.go('login');
           }

       }
   }
});
/**
 * The main directive of the application that should be present in every page.
 */
angular.module('wellFollowed').directive('wfApp', function($wfAuth, wfAlertTypes, $state, WfUser, LoopBackAuth, $wfAuth) {
   return {
       restrict: 'E',
       templateUrl: 'common/wf-app.html',
       controller: function($scope, $location) {

           var self = this;

           $scope.alerts = [];
           $scope.showErrors = true;
           $scope.isAuthenticated = WfUser.isAuthenticated();
           $scope.previousState = {};

           /**
            * Returns whether the user is authenticated or not.
            * @returns {*}
            */
           this.getAuthentication = function() {
               return $scope.isAuthenticated;
           };

           /**
            * Indicates if an alert should be shown on top of the page containing the HTTP Errors that may occur.
            * @param show
            */
           this.showErrors = function(show) {
               $scope.showErrors = show;
           };

           /**
            * Adds a success alert at the top of the page with the given message.
            * @param message
            */
           this.addSuccess = function(message) {
                $scope.alerts.unshift({
                    type: wfAlertTypes.success,
                    message: message
                });
           };

           /**
            * Gets the last state that was browsed before the current one.
            * @returns {{}|*}
            */
           this.getPreviousState = function() {
                return $scope.previousState;
           };

           /**
            * Indicates if the menu should be refreshed (after a logout for exemple).
            */
           this.refreshMenu = function() {
               $scope.isAuthenticated = WfUser.isAuthenticated();
               $scope.$broadcast('refreshMenu');
           };

           // Reset the view variables when the state changes.
           $scope.$on('$stateChangeSuccess', function(event, to, toParams, previous, previousParams) {
               $scope.showErrors = true;
               $scope.previousState = previous;
           });

           /**
            * Logs the user out.
            */
           $scope.logOut = function() {
               LoopBackAuth.clearUser();
               LoopBackAuth.clearStorage();
               $scope.isAuthenticated = WfUser.isAuthenticated();
               self.refreshMenu();
               $state.go('login');
           }

       }
   }
});
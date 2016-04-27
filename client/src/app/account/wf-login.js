/**
 * Login page.
 */
angular.module('wellFollowed').directive('wfLogin', function(WfUser, $state) {
    return {
        restrict: 'E',
        templateUrl: 'account/wf-login.html',
        require: '^wfApp',
        link: function (scope, element, attributes, wfApp) {

            wfApp.showErrors(false);

            scope.login = function() {
                WfUser.login({
                    email: scope.email,
                    password: scope.password
                }, function () {
                    wfApp.refreshMenu();
                    $state.go('home');
                });
            }

        }
    };
});
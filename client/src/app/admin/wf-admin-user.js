angular.module('wellFollowed').directive('wfAdminUser', function($wfUser, $state) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-user.html',
        scope: {
            username: '@'
        },
        require: '^wfApp',
        link: function(scope, element, attributes, wfApp) {

            scope.isNew = false;
            scope.user = null;

            if (!!scope.username) {
                $wfUser.getUser(scope.username)
                    .then(function (response) {
                        scope.user = response.data;
                        scope.isNew = false;
                    });
            } else {
                scope.user = {};
                scope.isNew = true;
            }

            scope.createUser = function() {
                $wfUser.createUser(scope.user)
                    .then(function() {
                        wfApp.addSuccess("Utilisateur \"" + scope.user.username + "\" créé.");
                        $state.go('admin.users');
                    });
            };

            scope.updateUser = function() {
                $wfUser.updateUser(scope.user)
                    .then(function() {
                        wfApp.addSuccess("Utilisateur mis à jour.");
                        $state.go('admin.users');
                    });
            };

            scope.previousState = wfApp.getPreviousState().name || 'admin.users';
        }
    };
});
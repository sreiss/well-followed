angular.module('wellFollowed').directive('wfAdminUser', function(WfUser, $state) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-user.html',
        scope: {
            userId: '@'
        },
        require: '^wfApp',
        link: function(scope, element, attributes, wfApp) {

            scope.isNew = false;
            scope.user = null;

            if (!!scope.userId) {
                WfUser.get({id: scope.userId})
                    .$promise
                    .then(function (user) {
                        scope.user = user;
                        scope.isNew = false;
                    });
            } else {
                scope.user = {};
                scope.isNew = true;
            }

            scope.createUser = function() {
                WfUser.create(scope.user)
                    .$promise
                    .then(function() {
                        wfApp.addSuccess("Utilisateur \"" + scope.user.username + "\" créé.");
                        $state.go('admin.users');
                    });
            };

            scope.updateUser = function() {
                WfUser.updateUser(scope.user)
                    .$promise
                    .then(function() {
                        wfApp.addSuccess("Utilisateur mis à jour.");
                        $state.go('admin.users');
                    });
            };

            scope.previousState = wfApp.getPreviousState().name || 'admin.users';
        }
    };
});
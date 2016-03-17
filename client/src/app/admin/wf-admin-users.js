angular.module('wellFollowed').directive('wfAdminUsers', function ($wfUser, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-users.html',
        require: '^wfApp',
        link: function (scope, element, attributes, wfApp) {

            scope.users = null;

            var refresh = function () {
                $wfUser.getUsers()
                    .then(function (response) {
                        scope.users = response.data;
                    });
            };
            refresh();

            scope.deleteUser = function (username) {
                $wfModal.open({
                    scope: scope,
                    directiveName: 'wf-delete-modal'
                })
                    .then(function () {
                        scope.users = null;
                        return $wfUser.deleteUser(username);
                    })
                    .then(function (response) {
                        wfApp.addSuccess("Utilisateur supprimé.");
                    })
                    .finally(function () {
                        refresh();
                    });
            };
        }
    }
});
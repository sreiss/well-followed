angular.module('wellFollowed').directive('wfAdminUsers', function (WfUser, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-users.html',
        require: '^wfApp',
        link: function (scope, element, attributes, wfApp) {

            scope.users = null;

            var refresh = function () {
                WfUser.find()
                    .$promise
                    .then(function (users) {
                        scope.users = users;
                    });
            };
            refresh();

            scope.deleteUser = function (id) {
                $wfModal.open({
                    scope: scope,
                    directiveName: 'wf-delete-modal'
                })
                    .then(function () {
                        scope.users = null;
                        return WfUser.deleteById({id: id});
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
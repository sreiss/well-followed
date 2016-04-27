/**
 * Admin page to list the institutions
 */
angular.module('wellFollowed').directive('wfAdminInstitutions', function(Institution, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-institutions.html',
        require: '^wfApp',
        link: function(scope, element, attributes, wfApp) {

            scope.institutions = null;

            var refresh = function() {
                Institution.find({ filter: { include: 'type' } })
                    .$promise
                    .then(function (institutions) {
                        scope.institutions = institutions;
                });
            };
            refresh();

            scope.deleteInstitution = function(id) {
                $wfModal.open({
                    scope: scope,
                    directiveName: 'wf-delete-modal'
                })
                    .then(function () {
                        scope.institutions = null;
                        return Institution.deleteById({id: id});
                    })
                    .then(function(response) {
                        wfApp.addSuccess("Établissement supprimé.");
                    })
                    .finally(function() {
                        refresh();
                    });
            };
        }
    }
});
angular.module('wellFollowed').directive('wfAdminInstitutions', function($wfInstitution, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-institutions.html',
        require: '^wfApp',
        link: function(scope, element, attributes, wfApp) {

            scope.institutions = null;

            var refresh = function() {
                $wfInstitution.getInstitutions()
                    .then(function (response) {
                        scope.institutions = response.data;
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
                        return $wfInstitution.deleteInstitution(id);
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
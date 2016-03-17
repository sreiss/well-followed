angular.module('wellFollowed').directive('wfAdminInstitutionTypes', function ($wfInstitutionType, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-institution-types.html',
        require: '^wfApp',
        link: function (scope, element, attributes, wfApp) {

            scope.institutionTypes = null;

            var refresh = function () {
                $wfInstitutionType.getInstitutionTypes()
                    .then(function (response) {
                        scope.institutionTypes = response.data;
                    });
            };
            refresh();

            scope.deleteInstitutionType = function (id) {
                $wfModal.open({
                    scope: scope,
                    directiveName: 'wf-delete-modal'
                })
                    .then(function () {
                        scope.institutionTypes = null;
                        return $wfInstitutionType.deleteInstitutionType(id);
                    })
                    .then(function (response) {
                        wfApp.addSuccess("Type d'établissement supprimé.");
                    })
                    .finally(function () {
                        refresh();
                    });
            };
        }
    }
});
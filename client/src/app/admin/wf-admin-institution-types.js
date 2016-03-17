angular.module('wellFollowed').directive('wfAdminInstitutionTypes', function (InstitutionType, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-institution-types.html',
        require: '^wfApp',
        link: function (scope, element, attributes, wfApp) {

            scope.institutionTypes = null;

            var refresh = function () {
                InstitutionType.find()
                    .$promise
                    .then(function (institutionTypes) {
                        scope.institutionTypes = institutionTypes;
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
                        return InstitutionType.deleteById({id: id});
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
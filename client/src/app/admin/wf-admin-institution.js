angular.module('wellFollowed').directive('wfAdminInstitution', function(InstitutionType, Institution, $state) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-institution.html',
        scope: {
            institutionId: '@'
        },
        require: '^wfApp',
        link: function(scope, element, attributes, wfApp) {

            scope.institution = null;
            scope.institutionTypes = [];

            InstitutionType.find()
                .$promise
                .then(function(institutionTypes) {
                    scope.institutionTypes = institutionTypes;
                });


            if (!!scope.institutionId) {
                Institution.get(scope.institutionId)
                    .$promise
                    .then(function (institution) {
                        scope.institution = institution;
                    });
            } else {
                scope.institution = {};
            }

            scope.createInstitution = function() {
                scope.institution.typeId = scope.institution.type.id;
                Institution.create(scope.institution)
                    .$promise
                    .then(function() {
                        wfApp.addSuccess("Établissement \"" + scope.institution.tag + "\" créé.");
                        $state.go('admin.institutions');
                    });
            };

            scope.updateInstitution = function() {
                Institution.update(scope.institution)
                    .$promise
                    .then(function() {
                        wfApp.addSuccess("Établissement mis à jour.");
                        $state.go('admin.institutions');
                    });
            };

            scope.previousState = wfApp.getPreviousState().name || 'admin.institutions';
        }
    };
});
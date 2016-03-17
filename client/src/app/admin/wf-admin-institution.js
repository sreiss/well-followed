angular.module('wellFollowed').directive('wfAdminInstitution', function($wfInstitutionType, $wfInstitution, $state) {
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

            $wfInstitutionType.getInstitutionTypes()
                .then(function(response) {
                    scope.institutionTypes = response.data;
                });


            if (!!scope.institutionId) {
                $wfInstitution.getInstitution(scope.institutionId)
                    .then(function (response) {
                        scope.institution = response.data;
                    });
            } else {
                scope.institution = {};
            }

            scope.createInstitution = function() {
                $wfInstitution.createInstitution(scope.institution)
                    .then(function() {
                        wfApp.addSuccess("Établissement \"" + scope.institution.tag + "\" créé.");
                        $state.go('admin.institutions');
                    });
            };

            scope.updateInstitution = function() {
                $wfInstitution.updateInstitution(scope.institution)
                    .then(function() {
                        wfApp.addSuccess("Établissement mis à jour.");
                        $state.go('admin.institutions');
                    });
            };

            scope.previousState = wfApp.getPreviousState().name || 'admin.institutions';
        }
    };
});
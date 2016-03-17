angular.module('wellFollowed').directive('wfAdminInstitutionType', function($wfInstitutionType, $state) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-institution-type.html',
        scope: {
            institutionTypeId: '@'
        },
        require: '^wfApp',
        link: function(scope, element, attributes, wfApp) {

            scope.institutionType = null;

            if (!!scope.institutionTypeId) {
                $wfInstitutionType.getInstitutionType(scope.institutionTypeId)
                    .then(function (response) {
                        scope.institutionType = response.data;
                    });
            } else {
                scope.institutionType = {};
            }

            scope.createInstitutionType = function() {
                $wfInstitutionType.createInstitutionType(scope.institutionType)
                    .then(function() {
                        wfApp.addSuccess("Type d'établissement \"" + scope.institutionType.tag + "\" créé.");
                        $state.go('admin.institutionTypes');
                    });
            };

            scope.updateInstitutionType = function() {
                $wfInstitutionType.updateInstitutionType(scope.institutionType)
                    .then(function() {
                        wfApp.addSuccess("Type d'établissement mis à jour.");
                        $state.go('admin.institutionTypes');
                    });
            };

            scope.previousState = wfApp.getPreviousState().name || 'admin.institutionTypes';
        }
    };
});
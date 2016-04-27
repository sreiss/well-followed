/**
 * Admin institution type creation and edition page.
 */
angular.module('wellFollowed').directive('wfAdminInstitutionType', function(InstitutionType, $state) {
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
                InstitutionType.get({id: scope.institutionTypeId})
                    .$promise
                    .then(function (institutionType) {
                        scope.institutionType = institutionType;
                    });
            } else {
                scope.institutionType = {};
            }

            scope.createInstitutionType = function() {
                InstitutionType.create(scope.institutionType)
                    .$promise
                    .then(function() {
                        wfApp.addSuccess("Type d'établissement \"" + scope.institutionType.tag + "\" créé.");
                        $state.go('admin.institutionTypes');
                    });
            };

            scope.updateInstitutionType = function() {
                scope.institutionType.$save(function() {
                    wfApp.addSuccess("Type d'établissement mis à jour.");
                    $state.go('admin.institutionTypes');
                });
            };

            scope.previousState = wfApp.getPreviousState().name || 'admin.institutionTypes';
        }
    };
});
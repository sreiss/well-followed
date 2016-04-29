/**
 * Admin page to list the institution types.
 */
angular.module('wellFollowed').directive('wfAdminInstitutionTypes', function (InstitutionType, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-institution-types.html',
        require: '^wfApp',
        link: function (scope, element, attributes, wfApp) {

            scope.currentPage = 1;
            scope.institutionTypesPerPage = 10;
            scope.institutionTypesCount = 0;
            scope.institutionTypes = null;

            var getPageFilter = function(currentPage) {
                currentPage = currentPage || 1;
                return {
                    limit: scope.institutionTypesPerPage,
                    offset: (currentPage - 1) * scope.institutionTypesPerPage
                };
            };

            var getSearchFilter = function(searchText) {
                var filter = {};
                if (searchText) {
                    filter = {
                        where: {
                            tag: {
                                like: searchText
                            }
                        }
                    };
                }
                return filter;
            };

            var refresh = scope.refresh = function(currentPage, searchText) {
                var searchFilter = getSearchFilter(searchText);
                var pageFilter = getPageFilter(currentPage);
                var filter = angular.extend(pageFilter, searchFilter);
                filter = filter || {};
                InstitutionType.count(searchFilter)
                    .$promise
                    .then(function(result) {
                        scope.institutionTypesCount = result.count;
                        return InstitutionType.find({filter: filter}).$promise;
                    })
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
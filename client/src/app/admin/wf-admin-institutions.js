/**
 * Admin page to list the institutions
 */
angular.module('wellFollowed').directive('wfAdminInstitutions', function(Institution, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-institutions.html',
        require: '^wfApp',
        link: function(scope, element, attributes, wfApp) {

            scope.currentPage = 1;
            scope.institutionsPerPage = 10;
            scope.institutionCount = 0;
            scope.instutions = null;

            var getPageFilter = function(currentPage) {
                currentPage = currentPage || 1;
                return {
                    limit: scope.institutionsPerPage,
                    offset: (currentPage - 1) * scope.institutionsPerPage
                };
            };

            var getSearchFilter = function(searchText) {
                var filter = {};
                if (searchText) {
                    filter = {
                        where: {
                            or: [
                                {tag: {
                                    like: searchText
                                }},
                                {'type.tag': {
                                    like: searchText
                                }}
                            ]
                        }
                    };
                }
                return filter;
            };

            var refresh = scope.refresh = function(currentPage, searchText) {
                var searchFilter = getSearchFilter(searchText);
                var pageFilter = getPageFilter(currentPage);
                var filter = angular.extend(pageFilter, searchFilter);
                Institution.count(searchFilter)
                    .$promise
                    .then(function(result) {
                        scope.institutionCount = result.count;
                        filter.include = 'type';
                        return Institution.find({filter: filter}).$promise;
                    })
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
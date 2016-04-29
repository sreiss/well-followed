/**
 * Admin page to list the users.
 */
angular.module('wellFollowed').directive('wfAdminUsers', function (WfUser, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-users.html',
        require: '^wfApp',
        link: function (scope, element, attributes, wfApp) {

            scope.currentPage = 1;
            scope.usersPerPage = 10;
            scope.userCount = 0;
            scope.users = null;

            var getPageFilter = function(currentPage) {
                currentPage = currentPage || 1;
                return {
                    limit: scope.usersPerPage,
                    offset: (currentPage - 1) * scope.usersPerPage
                };
            };

            var getSearchFilter = function(searchText) {
                var filter = {};
                if (searchText) {
                    filter = {
                        where: {
                            or: [
                                {email: {
                                    like: searchText
                                }},
                                {firstName: {
                                    like: searchText
                                }},
                                {lastName: {
                                    like: searchText
                                }}
                            ]
                        }
                    };
                }
                return filter;
            };

            var refresh = scope.refresh = function (currentPage, searchText) {
                var searchFilter = getSearchFilter(searchText);
                var pageFilter = getPageFilter(currentPage);
                var filter = angular.extend(pageFilter, searchFilter);
                WfUser.count(searchFilter)
                    .$promise
                    .then(function(result) {
                        scope.userCount = result.count;
                        return WfUser.find({filter: filter}).$promise;
                    })
                    .then(function (users) {
                        scope.users = users;
                    });
            };
            refresh();

            scope.deleteUser = function (id) {
                $wfModal.open({
                    scope: scope,
                    directiveName: 'wf-delete-modal'
                })
                    .then(function () {
                        scope.users = null;
                        return WfUser.deleteById({id: id});
                    })
                    .then(function (response) {
                        wfApp.addSuccess("Utilisateur supprimé.");
                    })
                    .finally(function () {
                        refresh();
                    });
            };
        }
    }
});
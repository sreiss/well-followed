/**
 * History of the past experiments.
 */
angular.module('wellFollowed').directive('wfExperimentHistory', function (Experiment, $wfModal, $filter) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-experiment-history.html',
        link: function (scope, element, attributes) {

            scope.currentPage = 1;
            scope.experimentsPerPage = 10;
            scope.experimentsCount = 0;
            scope.experiments = null;

            var getPageFilter = function(currentPage) {
                currentPage = currentPage || 1;
                return {
                    limit: scope.experimentsPerPage,
                    offset: (currentPage - 1) * scope.experimentsPerPage
                };
            };

            var getSearchFilter = function(searchText) {
                var filter = {};
                if (searchText) {
                    filter = {
                        where: {
                            or: [
                                {name: {
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
                filter = filter || {};
                Experiment.countAllowed(searchFilter)
                    .$promise
                    .then(function(result) {
                        scope.experimentsCount = result.count;
                        return Experiment.findAllowed({filter: filter}).$promise;
                    })
                    .then(function (experiments) {
                        scope.experiments = $filter('orderBy')(experiments, function (experiment) {
                            return new Date(experiment.event.start);
                        }, true);
                    });
            };
            refresh();

            scope.download = function(experimentId) {
                $wfModal.open({
                    scope: scope,
                    directiveName: 'wf-experiment-history-download-modal',
                    data: {
                        experimentId: experimentId
                    }
                });
            }
        }
    }
});
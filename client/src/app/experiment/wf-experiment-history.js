angular.module('wellFollowed').directive('wfExperimentHistory', function (Experiment, $wfModal, $filter) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-experiment-history.html',
        link: function (scope, element, attributes) {

            scope.experiments = null;

            Experiment.findAllowed()
                .$promise
                .then(function(experiments) {
                    scope.experiments = $filter('orderBy')(experiments, function(experiment) {
                       return new Date(experiment.event.start);
                    }, true);
                });

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
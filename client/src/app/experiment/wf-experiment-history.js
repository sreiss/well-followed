angular.module('wellFollowed').directive('wfExperimentHistory', function (Experiment, $wfModal) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-experiment-history.html',
        link: function (scope, element, attributes) {

            scope.experiments = null;

            Experiment.findAllowed()
                .$promise
                .then(function(experiments) {
                    scope.experiments = experiments;
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
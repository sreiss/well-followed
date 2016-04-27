/**
 * Modal to download the csv files produced at the end of an experiment.
 */
angular.module('wellFollowed').directive('wfExperimentHistoryDownloadModal', function(ExperimentContainer, wfHttpSettings) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-experiment-history-download-modal.html',
        scope: {
            data: '=',
            cancel: '&',
            close: '='
        },
        link: function(scope, element, attributes) {

            scope.urlBase = wfHttpSettings.urlBase;
            scope.files = null;

            ExperimentContainer.getFiles({container: scope.data.experimentId})
                .$promise
                .then(function(files) {
                    scope.files = files;
                });

        }
    }
});
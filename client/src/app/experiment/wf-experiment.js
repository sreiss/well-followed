angular.module('wellFollowed').directive('wfExperiment', function (Sensor) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-experiment.html',
        controller: function ($scope) {

        },
        link: function (scope, element, attributes) {
            scope.sensors = [];
            Sensor.find()
                .$promise
                .then(function(sensors) {
                    scope.sensors = sensors;
                });
        }
    };
});
angular.module('wellFollowed').directive('wfExperiment', function (Sensor, $wfStream, LiveSet) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-experiment.html',
        controller: function ($scope) {

        },
        link: function (scope, element, attributes) {
            Sensor.find()
                .$promise
                .then(function(sensors) {
                    var sensorChanges = $wfStream.openStream('/api/Sensors/change-stream?_format=event-stream');
                    var sensorSet = new LiveSet(sensors, sensorChanges);
                    scope.sensors = sensorSet.toLiveArray();
                });
        }
    };
});
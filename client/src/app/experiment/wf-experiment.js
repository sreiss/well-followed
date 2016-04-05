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
                    sensors.map(function(sensor) {
                        sensor.isPlugged = true;
                    });
                    scope.sensors = sensors;

                    var sensorChanges = $wfStream.openStream('/api/Sensors/change-stream?_format=event-stream');
                    sensorChanges.on('data', function(data) {
                        if (data.type == 'remove') {
                            scope.sensors.map(function (sensor) {
                                if (data.target == sensor.id) {
                                    sensor.isPlugged = false;
                                }
                            });
                        } else if (data.type = 'create') {
                            scope.sensors.push(data.data);
                        }
                    });
                    //var sensorSet = new LiveSet(sensors, sensorChanges);
                    //scope.sensors = sensorSet.toLiveArray();
                });
        }
    };
});
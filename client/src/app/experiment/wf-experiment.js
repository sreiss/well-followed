angular.module('wellFollowed').directive('wfExperiment', function (Sensor, $wfStream, LiveSet, Experiment, WfUser, Event) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-experiment.html',
        controller: function ($scope) {

        },
        require: '^wfApp',
        link: function (scope, element, attributes, wfApp) {
            wfApp.showErrors(false);

            scope.startExperiment = function() {
                scope.isStartingExperiment = true;
                Experiment.start()
                    .$promise
                    .then(function() {

                    })
                    .finally(function() {
                        scope.isStartingExperiment = false;
                    });
            };

            var experimentFilter = {
                where: {
                    isCurrent: true
                },
                include: 'event'
            };

            var experiment;

            scope.experiment = null;

            scope.experimentError = {
                unauthorized: false,
                notFound: false,
                unknown: false
            };

            Experiment.findOne({filter: experimentFilter})
                .$promise
                .then(function(currentExperiment) {
                    experiment = currentExperiment;
                    // We get the user institution to check it against the experiment's one
                    var wfUserFilter = {
                        fields: 'institution',
                        include: 'institution'
                    };

                    return WfUser.findById({id: WfUser.getCurrentId(), filter: wfUserFilter}).$promise;
                })
                .then(function(user) {
                    if (user.institution.id == experiment.event.institutionId) {
                        scope.experiment = experiment;
                    } else {
                        scope.experiment = false;
                        scope.experimentError.unauthorized = true;
                    }
                })
                .catch(function(err) {
                    if (err.status == 404) {
                        scope.experimentError.notFound = true;

                    } else {
                        scope.experimentError.unknown = true;
                    }
                    scope.experiment = false;
                });


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
                            var existingSensor = scope.sensors.filter(function(sensor) {
                                return sensor.id == data.data.id;
                            })[0];
                            if (!existingSensor) {
                                scope.sensors.push(data.data);
                            } else {
                                existingSensor.id = data.data.id;
                                existingSensor.tag = data.data.tag;
                                existingSensor.description = data.data.description;
                                existingSensor.isPlugged = true;
                            }
                        }
                        scope.$apply();
                    });
                    //var sensorSet = new LiveSet(sensors, sensorChanges);
                    //scope.sensors = sensorSet.toLiveArray();
                });
        }
    };
});
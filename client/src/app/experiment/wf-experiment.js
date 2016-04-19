angular.module('wellFollowed').directive('wfExperiment', function (Sensor, $wfStream, LiveSet, Experiment, WfUser, Event, wfEventTypes) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-experiment.html',
        require: ['^wfApp'],
        link: function (scope, element, attributes, controllers) {
            var wfApp = controllers[0];

            wfApp.showErrors(false);

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

            scope.isInitiator = true;

            scope.updateExperiment = function(form) {
                scope.experiment.$save(function() {
                    form.$setPristine(true);
                });
            };

            Experiment.findOne({filter: experimentFilter})
                .$promise
                .then(function (currentExperiment) {
                    experiment = currentExperiment;
                    // We get the user institution to check it against the experiment's one
                    var wfUserFilter = {
                        fields: 'institution',
                        include: 'institution'
                    };

                    return WfUser.findById({id: WfUser.getCurrentId(), filter: wfUserFilter}).$promise;
                })
                .then(function (user) {
                    if (experiment.isPublic || user.institution.id == experiment.event.institutionId || WfUser.getCurrentId() == experiment.event.userId) {
                        scope.experiment = experiment;
                        if (WfUser.getCurrentId() == experiment.event.userId) {
                            scope.isInitiator = true;
                        }
                    } else {
                        scope.experiment = false;
                        scope.experimentError.unauthorized = true;
                    }
                })
                .catch(function (err) {
                    scope.experiment = false
                    if (err.status == 404) {
                        scope.experimentError.notFound = true;

                        var nextEventFilter = {
                            where: {
                                and: [
                                    {
                                        start: {
                                            gt: moment().toDate()
                                        }
                                    },
                                    {eventTypeId: wfEventTypes.booking},
                                    {cancelled: false}
                                ]
                            },
                            order: 'start'
                        };

                        return Event.findOne({filter: nextEventFilter}).$promise;
                    } else {
                        scope.experimentError.unknown = true;
                    }

                    return false;
                })
                .then(function (nextEvent) {
                    if (!!nextEvent) {
                        scope.nextEvent = nextEvent;
                    }
                });


            Sensor.find()
                .$promise
                .then(function (sensors) {
                    sensors.map(function (sensor) {
                        sensor.isPlugged = true;
                    });
                    scope.sensors = sensors;

                    var sensorChanges = $wfStream.openStream('/api/Sensors/change-stream?_format=event-stream');
                    sensorChanges.on('data', function (data) {
                        if (data.type == 'remove') {
                            scope.sensors.map(function (sensor) {
                                if (data.target == sensor.id) {
                                    sensor.isPlugged = false;
                                }
                            });
                        } else if (data.type = 'create') {
                            var existingSensor = scope.sensors.filter(function (sensor) {
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
var csvWriter = require('csv-write-stream'),
    loopback = require('loopback'),
    AdmZip = require('adm-zip'),
    moment = require('moment'),
    path = require('path'),
    fs = require('fs');

module.exports = function (Experiment) {

    /**
     * Ends the current experiment.
     * @returns {deferred.promise|{then, catch, finally}}
     */
    Experiment.end = function () {
        var ExperimentContainer = Experiment.app.models.ExperimentContainer,
            SensorData = Experiment.app.models.SensorData,
            Sensor = Experiment.app.models.Sensor,
            deferred = Promise.defer();

        var experimentFilter = {
            where: {
                isCurrent: true
            },
            include: 'event'
        };

        // one csv per sensor will be saved and zipped inside a file for the experiment.
        Experiment.findOne(experimentFilter)
            .then(function (experiment) {
                if (experiment !== null) {
                    var containerName = experiment.id.toString();
                    ExperimentContainer.getContainer(containerName, function (err, container) {
                        var handler = function (err, container) {
                            Sensor.find()
                                .then(function (sensors) {
                                    var saveFilePromises = [],
                                        filePath = path.join(container.client.root, container.name);

                                    sensors.forEach(function (sensor) {
                                        saveFilePromises.push(SensorData.saveCsvToFile(sensor.id, filePath));
                                    });

                                    Promise.all(saveFilePromises)
                                        .then(function (paths) {
                                            var archivePath = path.join(filePath, experiment.id.toString()),
                                                zip = new AdmZip();

                                            paths.forEach(function (p) {
                                                zip.addLocalFile(p);
                                            });

                                            zip.writeZip(path.join(filePath, experiment.id.toString()) + '.zip');

                                            return true;
                                        })
                                        .then(function () {
                                            return Sensor.destroyAll()
                                        })
                                        .then(function () {
                                            return SensorData.destroyAll()
                                        })
                                        .then(function () {
                                            return experiment.updateAttribute('isCurrent', false);
                                        })
                                        .then(function () {
                                            deferred.resolve();
                                        })
                                        .catch(function (err) {
                                            deferred.reject(err);
                                        });
                                });
                        };

                        if (!container) {
                            ExperimentContainer.createContainer({name: containerName}, handler);
                        } else {
                            handler(null, container);
                        }
                    });
                }
            });

        return deferred.promise;
    };

    /**
     * Find the experiments to which the current user is allowed to access.
     * @param {Function(Error, array)} callback
     */
    Experiment.findAllowed = function (callback) {
        var ctx = loopback.getCurrentContext();
        var accessToken = ctx.get('accessToken');

        var WfUser = Experiment.app.models.WfUser,
            experiments,
            userInstitutionId,
            experimentFilter = {
                where: {
                    isCurrent: false
                },
                include: 'event'
            },
            userFilter = {
                include: 'institution',
                fields: ['institution'],
                where: {
                    id: accessToken.userId
                }
            };

        // Finds the user's institution
        WfUser.findOne(userFilter)
            .then(function (user) {
                if (!!user) {
                    userInstitutionId = user.institution().id.toString();
                    return Experiment.find(experimentFilter);
                } else {
                    throw new Error('No institution attached to this user.');
                }
            })
            .then(function (persistedExperiments) {
                experiments = persistedExperiments.filter(function (experiment) {
                    return experiment.isPublic || experiment.event().institutionId == userInstitutionId;
                });
                callback(null, experiments);
            })
            .catch(function (err) {
                callback(err);
            });
    };


};

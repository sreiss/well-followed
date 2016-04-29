var csvWriter = require('csv-write-stream'),
    loopback = require('loopback'),
    AdmZip = require('adm-zip'),
    moment = require('moment'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash');

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

    var filterExperiments = function(experiments, userInstitutionId) {
        // Workaround to filter nested properties since loopback doesn't handle it yet
        experiments = experiments.filter(function (experiment) {
            return experiment.isPublic || experiment.event().institutionId == userInstitutionId;
        });
        return experiments;
    };

    /**
     * Returns the count of experiments that the user can access.
     * @param {object} where A regular where filter
     * @param {Function(Error, number)} callback
     */
    Experiment.countAllowed = function(where, callback) {
        var ctx = loopback.getCurrentContext();
        var accessToken = ctx.get('accessToken');

        var WfUser = Experiment.app.models.WfUser,
            userInstitutionId,
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

                    var experimentFilter = {
                        where: {
                            isCurrent: false
                        },
                        include: 'event'
                    };

                    where = where || {};
                    experimentFilter = _.merge({where: where}, experimentFilter);

                    return Experiment.find(experimentFilter);
                } else {
                    throw new Error('No institution attached to this user.');
                }
            })
            .then(function (persistedExperiments) {
                var experiments = filterExperiments(persistedExperiments, userInstitutionId);
                callback(null, experiments.length);
            })
            .catch(function (err) {
                callback(err);
            });
    };

    /**
     * Find the experiments to which the current user is allowed to access.
     * @param {Object} filter The same filter object that can be passed to a find method.
     * @param {Function(Error, array)} callback
     */
    Experiment.findAllowed = function (filter, callback) {
        var ctx = loopback.getCurrentContext();
        var accessToken = ctx.get('accessToken');

        var WfUser = Experiment.app.models.WfUser,
            experiments,
            userInstitutionId,
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

                    var experimentFilter = {
                        where: {
                            isCurrent: false
                        },
                        include: 'event'
                    };

                    filter = filter || {};
                    experimentFilter = _.merge(filter, experimentFilter);

                    return Experiment.find(experimentFilter);
                } else {
                    throw new Error('No institution attached to this user.');
                }
            })
            .then(function (persistedExperiments) {
                experiments = filterExperiments(persistedExperiments, userInstitutionId);
                callback(null, experiments);
            })
            .catch(function (err) {
                callback(err);
            });
    };


};

var csvWriter = require('csv-write-stream'),
    loopback = require('loopback'),
    AdmZip = require('adm-zip'),
    moment = require('moment'),
    path = require('path'),
    fs = require('fs');

module.exports = function (Experiment) {

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
                                        .then(function() {
                                            return Sensor.destroyAll()
                                        })
                                        .then(function() {
                                            return SensorData.destroyAll()
                                        })
                                        .then(function() {
                                            return experiment.updateAttribute('isCurrent', false);
                                        })
                                        .then(function() {
                                            deferred.resolve();
                                        })
                                        .catch(function(err) {
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
    }

};

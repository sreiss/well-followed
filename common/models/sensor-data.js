var PassThrough = require('stream').PassThrough,
    amqpConnection = require('amqplib').connect('amqp://localhost'),
    fs = require('fs'),
    path = require('path'),
    moment = require('moment'),
    csvWriter = require('csv-write-stream');

module.exports = function(SensorData) {

    // Handles the connection to RabbitMQ server.
    amqpConnection.then(function(connection) {
        // Opens a channel to RabbitMQ server.
        return connection.createChannel().then(function(ch) {
            var exchange = 'well_followed_sensor';

            var Container = SensorData.app.models.Container;
            var Sensor = SensorData.app.models.Sensor;

            /**
             * This function will be called each time a value is read in the channel between RabbitMQ and the Loopback server.
             * @param msg The message sent in the channel, a json formatted string.
             */
            var dispatchValue = function dispatchValue(msg) {
                var value = JSON.parse(msg.content.toString());
                // If the value is a signal, some custom action have to be made.
                if (value.isSignal) {
                    switch (value.value) {
                        // If it's a start signal, the sensor will be created if it hasn't already been plugged in.
                        case 'start':
                            Sensor.findById(value.sensorId)
                                .then(function(sensor) {
                                    if (!sensor) {
                                        console.log('SensorData: Sensor ' + value.sensorId + ' already plugged in.');
                                    } else {
                                        console.log('SensorData: Sensor ' + value.sensorId + ' plugged in.');
                                    }
                                });
                            break;
                        case 'stop':
                            console.log('SensorData: Sensor ' + value.sensorId + ' unplugged.');
                            break;
                    }
                }
                SensorData.create(value);
            };

            // Assumes the exchange 'well_followed_sensor' exists and and tries to open it.
            // If the exchange has not yet been created on the RabbitMQ server, it has to be and it must contain a queue called the same way as the exchange.
            var ok = ch.assertExchange(exchange, 'direct', {durable: true});

            // Asserts the exchange contains the queue 'well_followed_sensor'.
            ok = ok.then(function() {
                return ch.assertQueue('well_followed_sensor', {exclusive: false});
            });

            // If the exchange and the queue exist, the data can be treated by the dispatchValue callback.
            ok = ok.then(function(qok) {
                return ch.consume(qok.queue, dispatchValue, {noAck: true});
            });
        });
    });

    /**
     * Saves the data of the sensor of which the id is given to the given path.
     * @param sensorId
     * @param filePath
     * @returns Promise
     */
    SensorData.saveCsvToFile = function(sensorId, filePath) {
        var fileName = sensorId + '.csv';
        var fullPath = path.join(filePath, fileName);
        var writer = csvWriter();
        writer.pipe(fs.createWriteStream(fullPath));
        return SensorData.find({where: {sensorId: sensorId}})
            .then(function (sensorData) {
                sensorData.forEach(function (data) {
                    if (!data.isSignal) {
                        var formattedDate = moment(data.date).format('YYYY-MM-DD HH:mm:ss');
                        writer.write({
                            date: formattedDate,
                            value: data.value
                        });
                    }
                });
                writer.end();
                return fullPath;
            })
            .catch(function (err) {
                console.log('Error while emptying ' + value.sensorId + ' values.');
                return false;
            });
    };

};

var PassThrough = require('stream').PassThrough,
    amqpConnection = require('amqplib').connect('amqp://localhost'),
    fs = require('fs'),
    path = require('path'),
    moment = require('moment'),
    csvWriter = require('csv-write-stream');

module.exports = function(SensorData) {

    amqpConnection.then(function(connection) {
        return connection.createChannel().then(function(ch) {
            var exchange = 'well_followed_sensor';

            var Sensor = SensorData.app.models.Sensor;
            var Container = SensorData.app.models.Container;

            var dispatchValue = function dispatchValue(msg) {
                //sensorValueEmitter.value();
                var value = JSON.parse(msg.content.toString());
                if (value.isSignal) {
                    switch (value.value) {
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
                            Sensor.destroyById(value.sensorId)
                                .then(function(result) {
                                    Container.getContainer('sensors', function(err, container) {
                                        var handler = function(err, container) {
                                            var filePath = path.join(container.client.root, container.name);
                                            var fileName = value.sensorId + '-' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.csv';
                                            var writer = csvWriter();
                                            writer.pipe(fs.createWriteStream(path.join(filePath, fileName)));
                                            SensorData.find({where:{sensorId: value.sensorId}})
                                                .then(function(sensorData) {
                                                    sensorData.forEach(function(data) {
                                                        if (!data.isSignal) {
                                                            var formattedDate = moment(data.date).format('YYYY-MM-DD HH:mm:ss');
                                                            writer.write({
                                                                date: formattedDate,
                                                                value: data.value
                                                            });
                                                        }
                                                    });
                                                    writer.end();
                                                    return;
                                                })
                                                .then(function() {
                                                    return SensorData.destroyAll({sensorId: value.sensorId});
                                                })
                                                .catch(function(err){
                                                    console.log('Error while emptying ' + value.sensorId + ' values.');
                                                });
                                        };

                                        if (!container) {
                                            Container.createContainer('sensors', handler);
                                        } else {
                                            handler(null, container);
                                        }
                                    });
                                    console.log('SensorData: Sensor ' + value.sensorId + ' unplugged.');
                                });
                            break;
                    }
                 }
                SensorData.create(value);
            };

            var ok = ch.assertExchange(exchange, 'direct', {durable: true});

            ok = ok.then(function() {
                return ch.assertQueue('well_followed_sensor', {exclusive: false});
            });

            ok = ok.then(function(qok) {
                return ch.consume(qok.queue, dispatchValue, {noAck: true});
            });
        });
    });

    SensorData.watchValues = function(sensorId, next) {
        var changes = new PassThrough({objectMode: true});

        SensorData.observe('after save', function(ctx, next) {
            if (ctx.instance.sensorId === sensorId)
                changes.write(ctx.instance);
            next();
        });

        next(null, changes);
    };

    SensorData.remoteMethod(
        'watchValues',
        {
            accepts: {arg: 'sensorId', type:'string', http: {source: 'path'}},
            returns: {arg: 'changes', type: 'ReadableStream', json: true},
            http: {verb: 'get', path: '/watchValues/:sensorId'}
        }
    );

};

var PassThrough = require('stream').PassThrough,
    amqpConnection = require('amqplib').connect('amqp://localhost'),
    loopback = require('loopback');

module.exports = function(SensorData) {

    amqpConnection.then(function(connection) {
        return connection.createChannel().then(function(ch) {
            var exchange = 'well_followed_sensor';

            var Sensor = loopback.getModel('Sensor');

            var dispatchValue = function dispatchValue(msg) {
                //sensorValueEmitter.value();
                var value = JSON.parse(msg.content.toString());
                if (value.type == 'signal') {
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

    SensorData.watchValues = function(sensorName, next) {
        var changes = new PassThrough({objectMode: true});

        SensorData.observe('after save', function(ctx, next) {
            if (ctx.instance.sensorName === sensorName)
                changes.write(ctx.instance);
            next();
        });

        next(null, changes);
    };

    SensorData.remoteMethod(
        'watchValues',
        {
            accepts: {arg: 'sensorName', type:'string', http: {source: 'path'}},
            returns: {arg: 'changes', type: 'ReadableStream', json: true},
            http: {verb: 'get', path: '/watchValues/:sensorId'}
        }
    );

};

var PassThrough = require('stream').PassThrough,
    amqpConnection = require('amqplib').connect('amqp://localhost'),
    SensorValueEmitter = require('../../server/event/sensor-value-emitter');

module.exports = function(SensorValue) {

    var sensorValueEmitter = new SensorValueEmitter();

    amqpConnection.then(function(connection) {
        return connection.createChannel().then(function(ch) {
            var exchange = 'well_followed_sensor';

            var dispatchValue = function dispatchValue(msg) {
                sensorValueEmitter.value(JSON.parse(msg.content.toString()));
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

    SensorValue.watchValues = function(sensorName, next) {
        var changes = new PassThrough({objectMode: true});

        sensorValueEmitter.on('value', function(value) {
            if (value.sensorName === sensorName)
                changes.write(value);
        });

        next(null, changes);
    };

    SensorValue.remoteMethod(
        'watchValues',
        {
            accepts: {arg: 'sensorName', type:'string', http: {source: 'path'}},
            returns: {arg: 'changes', type: 'ReadableStream', json: true},
            http: {verb: 'get', path: '/watchValues/:sensorName'}
        }
    );

};

var PassThrough = require('stream').PassThrough,
    amqpConnection = require('amqplib').connect('amqp://localhost');

module.exports = function(SensorValue) {

    amqpConnection.then(function(connection) {
        return connection.createChannel().then(function(ch) {
            var exchange = 'well_followed_sensor';

            var dispatchValue = function dispatchValue(msg) {
                //sensorValueEmitter.value();
                var value = JSON.parse(msg.content.toString());
                SensorValue.create(value);
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

        SensorValue.observe('after save', function(ctx, next) {
            if (ctx.instance.sensorName === sensorName)
                changes.write(ctx.instance);
            next();
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

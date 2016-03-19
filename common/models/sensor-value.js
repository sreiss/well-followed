var PassThrough = require('stream').PassThrough,
    ampqOpen = require('amqplib').connect('amqp://localhost');

module.exports = function(SensorValue) {

    SensorValue.watchValues = function(sensorId, next) {
        var changes = new PassThrough({objectMode: true});

        ampqOpen.then(function(conn) {
            var queueName = 'well_followed_sensor';
            var ok = conn.createChannel();
            ok = ok.then(function(ch) {
                ch.assertQueue(queueName);
                ch.consume(queueName, function(msg) {
                    if (msg !== null) {
                        var sensorValue = JSON.parse(msg.content.toString());
                        changes.write(sensorValue);
                        ch.ack(msg);
                    }
                });
            });
            return ok;
        }).then(null, console.warn);
        //setInterval(function() {
        //    changes.write({
        //        usage: process.memoryUsage(),
        //        time: Date.now()
        //    });
        //}, 250);

        next(null, changes);
    };

    SensorValue.remoteMethod(
        'watchValues',
        {
            accepts: {arg: 'sensorId', type:'string', http: {source: 'path'}},
            returns: {arg: 'changes', type: 'ReadableStream', json: true},
            http: {verb: 'get', path: '/watchValues/:sensorId'}
        }
    );

};

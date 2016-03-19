var PassThrough = require('stream').PassThrough;

module.exports = function(SensorValue) {

    SensorValue.stackValue = function() {

    };

    SensorValue.watchValues = function(sensorId, next) {
        var changes = new PassThrough({objectMode: true});

        setInterval(function() {
            changes.write({
                usage: process.memoryUsage(),
                time: Date.now()
            });
        }, 250);

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

var PassThrough = require('stream').PassThrough,
    VideoStreamEmitter = require('../../server/event/video-stream-emitter');

module.exports = function(VideoStream) {

    var videoStreamEmitter = new VideoStreamEmitter();

    VideoStream.watchStream = function(cameraName, next) {
        var changes = new PassThrough({objectMode: true});
        var writeable = true;

        changes.destroy = function() {
            changes.removeAllListeners('error');
            changes.removeAllListeners('end');
            writeable = false;
            changes = null;
        };

        changes.on('error', function() {
            writeable = false;
            videoStreamEmitter.removeListener('stream', onStream);
        });
        changes.on('end', function() {
            writeable = false;
            videoStreamEmitter.removeListener('stream', onStream);
        });

        if (!changes[cameraName]) {
            changes[cameraName] = new PassThrough({objectMode: true});
        }

        function onStream(stream) {
            if (stream.cameraName === cameraName && writeable)
                changes.write(stream);
        }

        videoStreamEmitter.on('stream', onStream);

        next(null, changes);
    };

    VideoStream.remoteMethod(
        'watchStream',
        {
            accepts: {arg: 'cameraName', type: 'string', http: {source: 'path'}},
            returns: {arg: 'changes', type: 'ReadableStream', json: true},
            http: {verb: 'get', path: '/watchStream/:cameraName'}
        }
    );

    VideoStream.createStream = function(changes, next) {
        videoStreamEmitter.stream(changes);

        next();
    };

    VideoStream.remoteMethod(
        'createStream',
        {
            accepts: [
                {arg: 'changes', type: 'object', json: true, http: {source: 'body'}}
            ],
            http: {verb: 'post', path: '/createStream'}
        }
    );

};

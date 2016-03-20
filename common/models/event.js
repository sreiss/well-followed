module.exports = function(Event) {

    Event.cancel = function(id, next) {
        Event.findById(id)
            .then(function(event) {
                if (event) {
                    event.cancelled = true;
                    event.save();
                }
                next(null, event);
            })
            .catch(function(err) {
                next(err);
            });
    };

    Event.remoteMethod(
        'cancel',
        {
            accepts: {arg: 'id', type: 'string'},
            returns: {type: 'Event', root: true},
            http: {verb: 'delete'}
        }
    );
};

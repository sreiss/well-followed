module.exports = function(Event) {

    /**
     * Allows to cancel an event (without deleting it).
     * @param id The id of the event to delete.
     * @param callback The Loopback callback.
     */
    Event.cancel = function(id, callback) {
        Event.findById(id)
            .then(function(event) {
                if (event) {
                    event.cancelled = true;
                    event.save();
                }
                callback(null, event);
            })
            .catch(function(err) {
                callback(err);
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

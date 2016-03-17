module.exports = function(Event) {

    Event.cancel = function(id, next) {
        Event.findOne({id: id})
            .then(function(event) {
                if (event) {
                    event.cancelled = true;
                    event.save();
                }
                next(null, true);
            })
            .catch(function(err) {
                next(err);
            });
    };

    Event.remoteMethod(
        'cancel',
        {
            accepts: {arg: 'id', type: 'string'},
            returns: {type: 'boolean'},
            http: {verb: 'delete'}
        }
    );
};

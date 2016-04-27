module.exports = function(Event) {
    /**
     * Before saving an event, checks if an other event isn't already booked at this date and if the start and end are coherent.
     */
    Event.observe('before save', function(ctx, next) {
        if (ctx.instance.start.getTime() > ctx.instance.end.getTime()) {
            next(new Error("Start must be inferior to end."));
        } else {
            var eventFilter = {
                where: {
                    and: [
                        {start: {lt: ctx.instance.start}},
                        {end: {gt: ctx.instance.start}}
                    ]
                }
            };
            Event.findOne(eventFilter)
                .then(function(event) {
                    if (event) {
                        next(new Error('Another event is already booked at this date.'));
                        return true;
                    } else {
                        return false;
                    }
                })
                .then(function(hasError) {
                    if (hasError) {
                        var eventFilter = {
                            where: {
                                and: [
                                    {start: {lt: ctx.instance.end}},
                                    {end: {gt: ctx.instance.end}}
                                ]
                            }
                        };
                        return Event.findOne(eventFilter);
                    } else {
                        return false;
                    }
                })
                .then(function(event) {
                    if (!event) {
                        next();
                    } else {
                        next(new Error('Another event is already booked at this date.'));
                    }
                })
                .catch(function(err) {
                    next(err);
                });
        }
    });

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

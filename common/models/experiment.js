var loopback = require('loopback'),
    moment = require('moment');

module.exports = function(Experiment) {

    /**
     * Start an experiment. This will check if an event has been booked and has already started and if the current user did book the event.
     * @param name The name of the experiment.
     * @param {Function(Error)} callback
     */
    Experiment.start = function(name, callback) {
        var ctx = loopback.getCurrentContext();
        var accessToken = ctx.get('accessToken');

        var Event = Experiment.app.models.Event;

        // As a timestamp
        var now = moment().toISOString();

        var event;

        Event.findOne({
                where: {
                    userId: accessToken.userId,
                    start: {'lte': now},
                    end: {'gte': now}
                }
            })
            .then(function(persistedEvent) {
                if (!!persistedEvent) {
                    event = persistedEvent;
                    return Experiment.findOne({where: {eventId: persistedEvent.id}})
                } else {
                    throw new Error('No experiment was scheduled.');
                }
            })
            .then(function(experiment) {
                if (experiment && experiment.isCurrent) {
                    throw new Error('The experiment was already started.');
                } else if (!experiment) {
                    return Experiment.create({name: name || 'test', eventId: event.id, isCurrent: true});
                } else {
                    return experiment.updateAttribute('isCurrent', true);
                }
            })
            .then(function(persistedExperiment) {
                callback(persistedExperiment);
            })
            .catch(function(err) {
                callback(err);
            });
    };

};

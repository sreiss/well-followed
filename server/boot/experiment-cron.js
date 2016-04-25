var cron = require('cron');

module.exports = function (app) {

    var Event = app.models.Event,
        Experiment = app.models.Experiment,
        CronJob = cron.CronJob;

    // A cron is launched to check if an experiment should be started or not.
    // The cron job is executed every 5 minutes.
    try {
        var job = new CronJob({
            cronTime: '* */5 * * * *',
            onTick: function () {

                var experimentFilter = {
                    where: {
                        isCurrent: true
                    },
                    include: 'event'
                };

                Experiment.findOne(experimentFilter)
                    .then(function (experiment) {
                        var eventFilter = {
                            where: {
                                start: {
                                    lt: new Date().toISOString()
                                },
                                end: {
                                    gt: new Date().toISOString()
                                },
                                eventTypeId: 'booking',
                                cancelled: false
                            }
                        };

                        if (experiment == null) {
                            // If no experiment is started
                            return Event.findOne(eventFilter);
                        } else if (experiment.event().end.getTime() < new Date().getTime()) {
                            // If the experiment is over
                            Experiment.end()
                                .then(function () {
                                    return Event.findOne(eventFilter);
                                });
                        } else {
                            // If an experiment is started and not over
                            return null;
                        }
                    })
                    .then(function (event) {
                        // If a valid event was passed through the previous promise, a new experiment needs to be launched.
                        if (!!event) {
                            Experiment.create({
                                name: 'New Experiment',
                                isCurrent: true,
                                eventId: event.id
                            });
                            console.log('New experiment started.');
                        }
                    })
                    .catch(function (err) {
                        console.error('Cron error : ', err);
                    });
            },
            start: true
        });
    } catch (err) {
        console.log('Error while launching the cron.');
    }

};
angular.module('wellFollowed').directive('wfPlanningEventModal', function(Event, WfUser) {
    return {
        restrict: 'E',
        templateUrl: 'planning/wf-planning-event-modal.html',
        scope: {
            close: '=',
            cancel: '&',
            data: '=?'
        },
        link: function (scope, element, attributes) {

            scope.readOnly = false;
            scope.event = null;

            if (scope.data.type === scope.$parent.wfCrudTypes.create) {
                scope.event = scope.data.event;
            } else {
                Event.get({id: scope.data.event.id, filter: {include: ['user', {institution: 'type'}]}})
                    .$promise
                    .then(function (event) {
                        scope.readOnly = true;
                        scope.event = event;
                    });
            }

            scope.createEvent = function() {
                scope.event.userId = WfUser.getCurrentId();
                Event.find({
                    filter: {
                        where: {
                            start: scope.event.start
                        },
                        limit: 1
                    }
                }, function (events) {
                    if (events.length < 1) {
                        WfUser.get({ id: scope.event.userId, filter: { include: { institution: 'type' } } })
                            .$promise
                            .then(function (user) {
                                    scope.event.institutionId = user.institution.id;
                                    return Event.create(scope.event).$promise;
                                })
                            .then(function (event) {
                                    scope.close(event);
                                });
                    } else {
                        console.log("FAUX");
                    }
                });

            };

            scope.deleteEvent = function() {
                Event.cancel({id: scope.event.id})
                    .$promise
                    .then(function(event) {
                        scope.close(event);
                    });
            };
        }
    };
});
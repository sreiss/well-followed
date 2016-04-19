angular.module('wellFollowed').directive('wfPlanningEventForm', function(EventType) {
    return {
        restrict: 'E',
        templateUrl: 'planning/wf-planning-event-form.html',
        scope: {
            eventForm: '=form',
            event: '=',
            readOnly: '@?'
        },
        require: '^form',
        link: function(scope, element, attributes, form) {

            scope.readOnly = scope.readOnly || false;
            scope.eventTypes = null;

            EventType.find()
                .$promise
                .then(function(eventTypes) {
                    scope.eventTypes = eventTypes;
                    if (!scope.event.eventTypeId) {
                        scope.event.eventTypeId = eventTypes[0].id;
                    }
                });

        }
    };
});
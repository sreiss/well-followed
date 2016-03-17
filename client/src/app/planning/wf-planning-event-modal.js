angular.module('wellFollowed').directive('wfPlanningEventModal', function($wfEvent) {
    return {
        restrict: 'E',
        templateUrl: 'planning/wf-planning-event-modal.html',
        scope: {
            close: '=',
            cancel: '&',
            data: '=?'
        },
        link: function(scope, element, attributes) {

            scope.event = null;

            if (scope.data.type === scope.$parent.wfCrudTypes.create) {
                scope.event = scope.data.event;
            } else {
                $wfEvent.getEvent(scope.data.event.id)
                    .then(function (result) {
                        scope.event = result.data;
                    });
            }

            scope.createEvent = function() {
                $wfEvent.createEvent(scope.event).then(function(result) {
                    scope.close(result.data);
                });
            };

            scope.deleteEvent = function() {
                $wfEvent.deleteEvent(scope.event.id).then(function() {
                    scope.close(scope.event);
                });
            };
        }
    };
});
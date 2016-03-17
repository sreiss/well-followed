angular.module('wellFollowed').directive('wfPlanningEventModal', function(Event, WfUser) {
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
                Event.get({id: scope.data.event.id})
                    .$promise
                    .then(function (event) {
                        scope.event = event;
                    });
            }

            scope.createEvent = function() {
                scope.event.userId = WfUser.getCurrentId();
                Event.create(scope.event)
                    .$promise
                    .then(function(event) {
                        scope.close(event);
                    });
            };

            scope.deleteEvent = function() {
                Event.cancel({id: scope.event.id})
                    .$promise
                    .then(function() {
                        scope.close(event);
                    });
            };
        }
    };
});
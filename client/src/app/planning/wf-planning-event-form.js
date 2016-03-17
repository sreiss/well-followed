angular.module('wellFollowed').directive('wfPlanningEventForm', function() {
    return {
        restrict: 'E',
        templateUrl: 'planning/wf-planning-event-form.html',
        scope: {
            eventForm: '=form',
            event: '=',
            readOnly: '=?'
        },
        require: '^form',
        link: function(scope, element, attributes, form) {

            scope.readOnly = scope.readOnly || false;

        }
    };
});
/**
 * Sidebar of the planning screen, next to the calendar.
 */
angular.module('wellFollowed').directive('wfPlanningSidebar', function() {
   return {
       restrict: 'E',
       templateUrl: 'planning/wf-planning-sidebar.html'
   };
});
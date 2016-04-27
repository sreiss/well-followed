/**
 * The base directive of the admin area.
 */
angular.module('wellFollowed').directive('wfAdmin', function() {
   return {
       restrict: 'E',
       templateUrl: 'admin/wf-admin.html'
   };
});
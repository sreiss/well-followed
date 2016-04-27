/**
 * Top menu of the application.
 */
angular.module('wellFollowed').directive('wfMenu', function($wfMenu, $wfAuth, WfUser, $state, LoopBackAuth) {

    var _menuItems = function(scope) {
        scope.menuItems = $wfMenu.getMenu('main');
    };

    return {
        restrict: 'E',
        templateUrl: 'common/wf-menu.html',
        link: function(scope, element, attributes, wfApp) {

            _menuItems(scope);

            scope.$on('refreshMenu', function() {
                _menuItems(scope);
            });

            scope.isActive = function(item) {
                return item.state.split('.')[0] === $state.current.name.split('.')[0];
            };

        }
    };
});
angular.module('wellFollowed').directive('wfMenu', function($wfMenu, $wfAuth, WfUser, $state, LoopBackAuth) {

    var _menuItems = function(scope) {
        scope.menuItems = $wfMenu.getMenu('main');
    };

    return {
        restrict: 'E',
        templateUrl: 'common/wf-menu.html',
        link: function(scope, element, attributes, wfApp) {

            _menuItems(scope);

            scope.$on('$stateChangeSuccess', function(angularEvent, current, previous) {
                _menuItems(scope);
            });

            scope.$on('refreshMenu', function() {
                _menuItems(scope);
                //var currentUser = $wfAuth.getCurrentUser();
                if (!!currentUser)
                    scope.user = currentUser;
            });

        }
    };
});
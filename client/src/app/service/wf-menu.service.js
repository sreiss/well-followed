angular.module('wellFollowed').factory('$wfMenu', function(WfUser, $wfAuth) {
    var _menus = {
        'main': [
            { name: 'Expérience', state: 'experiment', iconClass: "glyphicon glyphicon-tasks" },
            { name: 'Calendrier', state: 'calendar', iconClass: "glyphicon glyphicon-calendar" },
            { name: 'Administration', iconClass: "glyphicon glyphicon-cog", items:
                [
                    { name: "Établissements", state: 'admin.institutions', role: 'admin' },
                    { name: "Types d'établissement", state: 'admin.institutionTypes', role: 'admin'},
                    { name: "Utilisateurs", state: 'admin.users', role: 'admin' }
                ]
            }
        ],
        'noauth': [
            { name: 'S\'inscrire', state: 'subscription'},
            { name: 'Se connecter', state: 'login'}
        ]
    };

    var _getMenu = function(id) {
        var menu = [];
        var isAuthenticated = WfUser.isAuthenticated();
        if (!!isAuthenticated) {
            $wfAuth.getCurrentRoles()
                .then(function(roles) {
                    for (var i = 0; i < _menus[id].length; i++) {
                        if (!_menus[id][i].role || roles.indexOf(_menus[id][i].role) > -1)
                            menu.push(_menus[id][i]);
                    }
                });
        } else if (id === 'noauth') {
            menu = _menus['noauth'];
        }
        //if (id != 'noauth') {
        //    for (var i = 0; i < _menus[id].length; i++) {
        //        var right = _menus[id][i].right;
        //        if ((!!right && $wfAuth.authentication.scopes.indexOf(right) > 0) || !right) {
        //            menu.push(_menus[id][i]);
        //        }
        //    }
        //
        //} else {
        //    menu = _menus[id];
        //}
        return menu;
    };

    return {
        getMenu: _getMenu
    };
});
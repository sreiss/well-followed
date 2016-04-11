angular.module('wellFollowed').factory('$wfMenu', function(WfUser, $wfAuth) {
    var _menus = {
        main: [
            { name: 'Expérience', state: 'experiment', iconClass: "glyphicon glyphicon-tasks" },
            { name: 'Calendrier', state: 'calendar', iconClass: "glyphicon glyphicon-calendar" },
            { name: 'Administration', iconClass: "glyphicon glyphicon-cog", state: 'admin.institutions', items:
                [
                    { name: "Établissements", state: 'admin.institutions', roles: 'admin' },
                    { name: "Types d'établissement", state: 'admin.institutionTypes', roles: 'admin'},
                    { name: "Utilisateurs", state: 'admin.users', roles: 'admin' }
                ]
            }
        ],
        noAuth: [
            { name: 'S\'inscrire', state: 'subscription'},
            { name: 'Se connecter', state: 'login'}
        ]
    };

    var _getMenu = function(id) {
        var menu = [];
        var isAuthenticated = WfUser.isAuthenticated();
        if (!!isAuthenticated) {
            var checkMenuRoles = function(menuToCheck, roles) {
                if (!!menuToCheck.items && menuToCheck.items.length > 0) {
                    checkMenuRoles(menuToCheck, roles);
                }
                for (var i = 0; i < menuToCheck.length; i++) {
                    if (!!menuToCheck[i].roles) {
                        for (var j = 0; j < menuToCheck[i].roles.length; j++) {
                            if (roles.indexOf(menuToCheck[i].roles[j]) > -1) {
                                menu.push(menuToCheck[i]);
                                break;
                            }
                        }
                    } else {
                        menu.push(menuToCheck[i]);
                    }
                }
            };
            $wfAuth.getCurrentRoles()
                .then(function(roles) {
                    checkMenuRoles(_menus[id], roles);
                });
        } else {
            menu = _menus['noAuth'];
        }
        return menu;
    };

    return {
        getMenu: _getMenu
    };
});
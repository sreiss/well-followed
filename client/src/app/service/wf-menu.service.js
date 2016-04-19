angular.module('wellFollowed').factory('$wfMenu', function(WfUser, $wfAuth) {
    var _menus = {
        main: [
            { name: 'Expérience', state: 'experiment', iconClass: "glyphicon glyphicon-tasks" },
            { name: 'Calendrier', state: 'calendar', iconClass: "glyphicon glyphicon-calendar", roles: ['admin', 'teacher'] },
            { name: 'Administration', iconClass: "glyphicon glyphicon-cog", state: 'admin.institutions', roles: ['admin'], items:
                [
                    { name: "Établissements", state: 'admin.institutions', roles: ['admin'] },
                    { name: "Types d'établissement", state: 'admin.institutionTypes', roles: ['admin'] },
                    { name: "Utilisateurs", state: 'admin.users', roles: ['admin'] }
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
            var checkMenuRoles = function(menuToCheck, roles, menuToFill) {
                for (var i = 0; i < menuToCheck.length; i++) {
                    var wasInserted = false;
                    if (!!menuToCheck[i].roles) {
                        for (var j = 0; j < menuToCheck[i].roles.length; j++) {
                            if (roles.indexOf(menuToCheck[i].roles[j]) > -1) {
                                var itemWithoutChilds = angular.copy(menuToCheck[i]);
                                delete itemWithoutChilds.items;
                                menuToFill.push(itemWithoutChilds);
                                wasInserted = true;
                                break;
                            }
                        }
                    } else {
                        var itemWithoutChilds = angular.copy(menuToCheck[i]);
                        delete itemWithoutChilds.items;
                        menuToFill.push(itemWithoutChilds);
                        wasInserted = true;
                    }
                    if (wasInserted && !!menuToCheck[i].items && menuToCheck[i].items.length > 0) {
                        menuToFill[menuToFill.length - 1].items = [];
                        checkMenuRoles(menuToCheck[i].items, roles, menuToFill[menuToFill.length - 1].items);
                    }
                }
            };
            $wfAuth.getCurrentRoles()
                .then(function(roles) {
                    checkMenuRoles(_menus[id], roles, menu);
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
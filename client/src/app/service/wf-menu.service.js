angular.module('wellFollowed').factory('$wfMenu', function(WfUser, RoleMapping) {
    var _menus = {
        'main': [
            { name: 'Expérience', state: 'experiment', role: 'READ_EXPERIMENT', iconClass: "glyphicon glyphicon-tasks" },
            { name: 'Calendrier', state: 'calendar', role: 'READ_EVENT', iconClass: "glyphicon glyphicon-calendar" },
            { name: 'Administration', role: 'READ_ADMIN', iconClass: "glyphicon glyphicon-cog", items:
                [
                    { name: "Établissements", state: 'admin.institutions', role: 'READ_INSTITUTION' },
                    { name: "Types d'établissement", state: 'admin.institutionTypes', role: 'READ_INSTITUTION'},
                    { name: "Utilisateurs", state: 'admin.users', role: 'READ_USER' }
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
            var roleFilter = {
                where: {principalId: WfUser.getCurrentId()},
                include: 'role'
            };
            RoleMapping.find({filter: roleFilter})
                .$promise
                .then(function(roleMapping) {
                    debugger;
                    for (var i = 0; i < _menus[id].length; i++) {
                        if (currentUser.roles.indexOf(_menus[id][i].role) > -1)
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
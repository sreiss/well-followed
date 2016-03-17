/**
 * Code adapté de l'article "AngularJS Token Authentication using ASP.NET Web API 2, Owin, and Identity" de Taiseer Joudeh sur CodeProject.com.
 * @author Taiseer Joudeh
 * @url http://www.codeproject.com/Articles/784106/AngularJS-Token-Authentication-using-ASP-NET-Web-A
 */
angular.module('wellFollowed').factory('$wfAuth', function (localStorageService, $q, LoopBackAuth, WfUser, RoleMapping) {

    var _getCurrentUser = function() {
        var currentUser = localStorageService.get('currentUser');
        if (!currentUser) {
            return WfUser.get({id: WfUser.getCurrentId()}, {
                    filter: {
                        include: 'roles'
                    }
                })
                .$promise
                .then(function (user) {
                    localStorageService.set('currentUser', user);
                    return RoleMapping.find({
                            where: {
                                principalId: user.id
                            },
                            include: "role"
                        })
                        .$promise
                })
                .then(function (roleMappings){
                    var currentUser;
                    debugger;
                    roleMappings.map(function(roleMapping) {
                        currentUser = localStorageService.get('currentUser');
                        currentUser.roles.push(roleMapping.role.name);
                        localStorageService.set('currentUser', currentUser);
                    });
                    debugger;
                    return currentUser;
                });
        } else {
            return $q.resolve(currentUser);
        }
    };

    return {
        getCurrentUser: _getCurrentUser
    };
});
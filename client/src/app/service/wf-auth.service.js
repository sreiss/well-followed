/**
 * Code adapté de l'article "AngularJS Token Authentication using ASP.NET Web API 2, Owin, and Identity" de Taiseer Joudeh sur CodeProject.com.
 * @author Taiseer Joudeh
 * @url http://www.codeproject.com/Articles/784106/AngularJS-Token-Authentication-using-ASP-NET-Web-A
 */
angular.module('wellFollowed').factory('$wfAuth', function (localStorageService, $q, LoopBackAuth, WfUser, RoleMapping) {

    var _getCurrentRoles = function() {
        var filter = {
            where: {principalId: WfUser.getCurrentId()},
            include: 'role'
        };
        return RoleMapping.find({filter: filter})
            .$promise
            .then(function(roleMappings) {
                return roleMappings.map(function(roleMapping) {
                   return roleMapping.role.name;
                });
            });
    };

    return {
        getCurrentRoles: _getCurrentRoles
    };
});
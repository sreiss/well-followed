/**
 * Helper to get information on the currently a authenticated user.
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
/**
 * Admin page to create and edit users.
 */
angular.module('wellFollowed').directive('wfAdminUser', function(WfUser, $state, $q, RoleMapping, Role) {
    return {
        restrict: 'E',
        templateUrl: 'admin/wf-admin-user.html',
        scope: {
            userId: '@'
        },
        require: '^wfApp',
        link: function(scope, element, attributes, wfApp) {

            scope.isNew = false;
            scope.user = null;
            scope.userRoles = null;
            scope.availableRoles = null;

            Role.find()
                .$promise
                .then(function(roles) {
                    scope.availableRoles = roles;
                });

            if (!!scope.userId) {
                WfUser.get({id: scope.userId})
                    .$promise
                    .then(function (user) {
                        scope.user = user;
                        scope.isNew = false;

                        var roleMappingFilter = {
                            where: {
                                principalId: scope.userId
                            },
                            include: 'role'
                        };

                        return RoleMapping.find({filter: roleMappingFilter}).$promise;
                    })
                    .then(function (roleMappings) {
                        scope.userRoles = roleMappings.map(function(roleMapping) {
                           return roleMapping.role.id;
                        });
                    });
            } else {
                scope.user = {};
                scope.isNew = true;
            }

            var saveRoles = function(persistedUser) {
                var rolePromises = [];
                scope.availableRoles.forEach(function (availableRole) {
                    if (scope.userRoles.indexOf(availableRole.id) > -1) {
                        rolePromises.push(availableRole.principals.create({
                            principalId: persistedUser.id,
                            principalType: 'user'
                        }));
                    }
                });

                return $q.all(rolePromises);
            };

            scope.createUser = function() {
                WfUser.create(scope.user)
                    .$promise
                    .then(function(persistedUser) {
                        return saveRoles(persistedUser)
                    })
                    .then(function() {
                        wfApp.addSuccess("Utilisateur \"" + scope.user.username + "\" créé.");
                        $state.go('admin.users');
                    });
            };

            scope.updateUser = function() {

                WfUser.prototype$updateAttributes(
                    {id: scope.user.id},
                    {
                        firstName: scope.user.firstName,
                        lastName: scope.user.lastName
                    }
                ).$promise
                    .then(function() {
                        wfApp.addSuccess("Utilisateur mis à jour.");
                        $state.go('admin.users');
                    });

            };

            scope.previousState = wfApp.getPreviousState().name || 'admin.users';
        }
    };
});
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

            var saveRoles = function(userId, userRoles) {
                return RoleMapping.find({filter: {where: {principalId: userId}}})
                    .$promise
                    .then(function(roles) {
                        var promises = [];
                        roles.forEach(function(roleMapping) {
                            promises.push(RoleMapping.destroyById({id: roleMapping.id}).$promise);
                        });
                        return $q.all(promises);
                    })
                    .then(function(deleted) {
                        var promises = [];
                        scope.availableRoles.forEach(function (availableRole) {
                            if (userRoles.indexOf(availableRole.id) > -1) {
                                promises.push(RoleMapping.create({
                                    roleId: availableRole.id,
                                    principalId: userId,
                                    principalType: 'user'
                                }).$promise);
                            }
                        });
                        return $q.all(promises);
                    });

                //return $q.all(rolePromises);
            };

            scope.updateUserRoles = function(userRoles) {
                scope.userRoles = userRoles;
            };

            scope.createUser = function(userRoles) {
                WfUser.create(scope.user)
                    .$promise
                    .then(function(persistedUser) {
                        return saveRoles(persistedUser.id, userRoles)
                    })
                    .then(function() {
                        wfApp.addSuccess("Utilisateur \"" + scope.user.username + "\" créé.");
                        $state.go('admin.users');
                    });
            };

            scope.updateUser = function(userRoles) {
                saveRoles(scope.user.id, userRoles)
                    .then(function() {
                        return WfUser.prototype$updateAttributes({id: scope.user.id}, {
                            firstName: scope.user.firstName,
                            lastName: scope.user.lastName
                        }).$promise;
                    })
                    .then(function() {
                        wfApp.addSuccess("Utilisateur mis à jour.");
                        $state.go('admin.users');
                    });

            };

            scope.previousState = wfApp.getPreviousState().name || 'admin.users';
        }
    };
});
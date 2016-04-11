module.exports = function(WfUser) {

    WfUser.observe('after save', function(ctx, next) {
        if (ctx.isNewInstance) {
            var Role = WfUser.app.models.Role,
                RoleMapping = WfUser.app.models.RoleMapping;

            Role.findOne({where: {name: 'student'}})
                .then(function(role) {
                    return role.principals.create({
                        principalType: RoleMapping.USER,
                        principalId: ctx.instance.id
                    });
                })
                .then(function(createRole) {
                    next();
                })
                .catch(function(err) {
                    next(err);
                });
        }
    });

};

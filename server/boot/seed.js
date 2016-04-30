module.exports = function(app) {

    var Role = app.models.Role,
        WfUser = app.models.WfUser,
        RoleMapping = app.models.RoleMapping,
        InstitutionType = app.models.InstitutionType,
        Sensor = app.models.Sensor,
        Institution = app.models.Institution,
        EventType = app.models.EventType,
        roles = [
            {name: 'student'},
            {name: 'teacher'},
            {name: 'admin'}
        ],
        user = {
            username: 'admin',
            password: 'wellfollowed',
            email: 'admin@vm-27.iutrs.unistra.fr',
            institutionTag: 'de Strasbourg'
        },
        institutionTypes = [
            {tag: 'I.U.T.'},
            {tag: 'Université'}
        ],
        institutions = [
            {tag: 'Robert Schuman', typeTag: 'I.U.T.', domain: 'iutrs.unistra.fr'},
            {tag: 'de Strasbourg', typeTag: 'Université', domain: 'unistra.fr'}
        ],
        sensors = [
            {name: 'sensor1', tag: 'Capteur supérieur', description: 'Capteur supérieur.'},
            {name: 'sensor2', tag: 'Capteur central', description: 'Capteur central'},
            {name: 'sensor3', tag: 'Capteur inférieur', description: 'Capteur inférieur'}
        ],
        eventTypes = [
            {id: 'booking', tag: 'Réservation'},
            {id: 'event', tag: 'Évènement'}
        ];

    var persistedEntities = {
        roles: [],
        user: {},
        institutionTypes: [],
        institutions: [],
        eventTypes: []
    };

    var rolePromises = [];
    for (var i = 0; i < roles.length; i++) {
        rolePromises.push(Role.findOrCreate({where: roles[i]}, roles[i]));
    }

    Promise.all(rolePromises)
        .then(function(persistedRoles) {
            persistedEntities.roles = persistedRoles;
            return persistedRoles;
        })
        .then(function() {
            var institutionTypePromises = [];
            for (var i = 0; i < institutionTypes.length; i++) {
                institutionTypePromises.push(InstitutionType.findOrCreate({where: institutionTypes[i]}, institutionTypes[i]));
            }
            return Promise.all(institutionTypePromises);
        })
        .then(function(persistedInstitutionTypes) {
            persistedEntities.institutionTypes = persistedInstitutionTypes;
            return persistedInstitutionTypes;
        })
        .then(function() {
            var institutionPromises = [];
            for (var i = 0; i < institutions.length; i++) {
                var type = persistedEntities.institutionTypes.filter(function(institutionType) {
                    return institutionType[0].tag === institutions[i].typeTag;
                })[0];
                var institution = {
                    tag: institutions[i].tag,
                    typeId: type[0].id,
                    type: type[0],
                    domain: institutions[i].domain
                };
                institutionPromises.push(Institution.findOrCreate({where: {tag: institution.tag}},institution));
            }
            return Promise.all(institutionPromises);
        })
        .then(function(persistedInstitutions) {
            persistedEntities.institutions = persistedInstitutions;
            return persistedInstitutions;
        })
        //.then(function() {
        //    var sensorPromises = [];
        //    for (var i = 0; i < sensors.length; i++) {
        //        sensorPromises.push(Sensor.findOrCreate({where: {name: sensors[i].name}}, sensors[i]));
        //    }
        //    return Promise.all(sensorPromises);
        //})
        .then(function(persistedSensors) {
            //persistedEntities.sensors = persistedSensors.map(function(result) {
            //    return result[0];
            //});
            var institution =  persistedEntities.institutions.filter(function(institution) {
                return institution[0].tag === user.institutionTag;
            })[0];
            var userToPersist = {
                username: user.username,
                password: user.password,
                email: user.email,
                institutionId: institution[0].id
            };
            return WfUser.findOrCreate({where: {username: user.username}}, userToPersist);
        })
        .then(function(persistedUser) {
            persistedEntities.user = persistedUser;
            return persistedUser;
        })
        .then(function(persistedUser) {
            // If user was created asign admin role.
            if (persistedUser[1]) {
                var adminRole = persistedEntities.roles.filter(function (role) {
                    return role[0].name === 'admin';
                })[0];
                adminRole[0].principals.create({
                    principalType: RoleMapping.USER,
                    principalId: persistedUser[0].id
                });
                return true;
            }
            return false;
        })
        .then(function() {
            var eventTypePromises = [];
            for (var i = 0; i < eventTypes.length; i++) {
                eventTypePromises.push(EventType.findOrCreate({where: {id: eventTypes[i].id}}, eventTypes[i]));
            }
            return Promise.all(eventTypePromises);
        })
        .then(function() {
            console.log('Seed ran.');
        })
        .catch(function(err) {
            console.error(err);
        });


};
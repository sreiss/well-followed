/**
 * Checks if the given e-mail's domain belongs to an Institution saved in the database.
 */
angular.module('wellFollowed').directive('wfEmailValidator', function(Institution, $q) {
    return {
        restrict: 'A',
        require: '^ngModel',
        link: function(scope, element, attributes, ngModel) {
            ngModel.$asyncValidators.wfDomain = function(email) {
                var emailSplit = email.split('@');
                if (emailSplit.length == 2) {
                    var domain = emailSplit[1];
                    var institutionFilter = {
                        where: {
                            domain: domain
                        }
                    };
                    return Institution.findOne({filter: institutionFilter})
                        .$promise
                        .then(function(institution) {
                            return $q.resolve();
                        })
                        .catch(function(err) {
                            return $q.reject(err);
                        });
                }
            };
        }
    }
});
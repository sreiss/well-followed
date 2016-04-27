/**
 * Subscription page.
 */
angular.module('wellFollowed').directive('wfAccountCreate', function (WfUser, Institution, $state) {
    return {
        restrict: 'E',
        templateUrl: 'account/wf-account-create.html',
        require: '^wfApp',
        link: function (scope, element, attributes, wfApp) {

            wfApp.showErrors(false);

            scope.user = {};

            //scope.institutions = null;
            //scope.institution = null;
            //
            //scope.refreshInstitution = function (email) {
            //    var domain = email.split('@')[1];
            //    if (domain.length > 0) {
            //        var institutionFilter = {
            //            where: {
            //                domain: {
            //                    like: domain + '$'
            //                }
            //            },
            //            include: 'type'
            //        };
            //    }
            //    //Institution.find({filter: {include: 'type'}})
            //    //    .$promise
            //    //    .then(function (institutions) {
            //    //        scope.institutions = institutions;
            //    //    });
            //};
            //refresh();

            scope.subscribe = function () {
                var domain = scope.user.email.split('@')[1];
                var institutionFilter = {
                    where: {
                        domain: domain
                    }
                };
                Institution.findOne({filter: institutionFilter})
                    .$promise
                    .then(function(institution) {
                        scope.user.institutionId = institution.id;
                        return WfUser.create(scope.user).$promise;
                    })
                    .then(function () {
                        wfApp.addSuccess("Inscription réussie.");
                        $state.go('login');
                    });
            };
        }
    };
});
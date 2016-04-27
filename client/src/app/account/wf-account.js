/**
 * This directive displays the current user's informations.
 */
angular.module('wellFollowed').directive('wfAccount', function(WfUser, Institution, $state, $wfAuth) {
   return {
       restrict: 'E',
       templateUrl: 'account/wf-account.html',
       require: '^wfApp',
       link: function(scope, element, attributes, wfApp) {

           wfApp.showErrors(false);

           scope.user = null;
           scope.institutions = null;
           scope.currentRoles = [];

           $wfAuth.getCurrentRoles()
               .then(function(roles) {
                   scope.currentRoles = roles;
               });

           WfUser.get({id: WfUser.getCurrentId(), filter: {include: {institution: 'type'}}})
               .$promise
               .then(function (user) {
                   scope.user = user;
               });

           Institution.find({ filter: { include: 'type' } })
               .$promise
               .then(function (institutions) {
                   scope.institutions = institutions;
               });

           scope.updateUser = function() {

               var updatedAttributes = {
                   firstName: scope.user.firstName,
                   lastName: scope.user.lastName,
                   institutionId: scope.user.institution.id
               };

               WfUser.prototype$updateAttributes({id: scope.user.id}, updatedAttributes)
                   .$promise
                   .then(function() {
                       wfApp.addSuccess("Modifications enregistrées.");
                   });

           };

           scope.updatePassword = function () {
               var updatedAttributes = {
                   password: scope.user.password
               };

               WfUser.prototype$updateAttributes({id: scope.user.id}, updatedAttributes)
                   .$promise
                   .then(function () {
                       wfApp.addSuccess("Mot de passe modifié.");
                   });
           };

           scope.previousState = wfApp.getPreviousState().name || 'sensor';

       }
   }
});
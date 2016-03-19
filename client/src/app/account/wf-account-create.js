angular.module('wellFollowed').directive('wfAccountCreate', function(WfUser, Institution, $state) {
   return {
       restrict: 'E',
       templateUrl: 'account/wf-account-create.html',
       require: '^wfApp',
       link: function(scope, element, attributes, wfApp) {

           wfApp.showErrors(false);

			scope.user = {};
			
			scope.institutions = null;
			
			var refresh = function () {
				Institution.find({filter: { include: 'type' } })
                    .$promise
                    .then(function (institutions) {
					scope.institutions = institutions;
				});
			};
			refresh();
			
			scope.subscribe = function () {
				scope.user.institutionId = scope.institution.id;
				WfUser.create(scope.user)
                    .$promise
                    .then(function () {
					wfApp.addSuccess("Utilisateur \"" + scope.user.username + "\" enregistré.");
					$state.go('login');
				});
			};
       }
   };
});
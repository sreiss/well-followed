angular.module('wellFollowed').directive('wfMatchesPassword', function () {
    return {
        restrict: 'A',
        require: '^ngModel',
        scope: {
            password: '=wfMatchesPassword'

        },
        link: function (scope, element, attributes, ngModel) {
            ngModel.$validators.passwordMismatch = function (modelValue) {
                return modelValue == scope.password;
            }
        }
    }
});
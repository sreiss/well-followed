angular.module('wellFollowed').directive('wfFormatDate', function() {
    return {
        restrict: 'A',
        require: '^ngModel',
        link: function(scope, element, attributes, ngModel) {

            ngModel.$formatters.push(function(value) {
                if (angular.isObject(value) && !!value.toDate) {
                    return value.toDate();
                }
                return new Date(value);
            });

            ngModel.$parsers.push(function(value) {
                return moment(value);
            });

        }
    };
});
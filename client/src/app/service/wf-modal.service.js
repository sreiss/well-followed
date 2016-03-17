angular.module('wellFollowed').factory('$wfModal', function($uibModal) {

    var _open = function(options) {

        options = angular.extend({
            data: {}
        }, options);

        var scope = options.scope.$new();

        var instance = $uibModal.open({
            scope: scope,
            controller: function($scope, $uibModalInstance) {

                $scope.data = options.data;

                $scope.cancel = function() {
                    $uibModalInstance.dismiss('cancel');
                };

                $scope.close = function(value) {
                    $uibModalInstance.close(value);
                };

            },
            template: '<' + options.directiveName + ' close="close" cancel="cancel()" data="data"></' + options.directiveName + '>',
            size: 'modal-lg'
        });

        return instance.result;
    };

    return {
        open: _open
    };

});
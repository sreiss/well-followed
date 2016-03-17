angular.module('wellFollowed').directive('wfSensorTemperature', function() {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-sensor-temperature.html',
        scope: {
            sensor: '='
        },
        require: '^wfExperiment',
        controller: function($scope) {
            $scope.data = [];
        },
        link: function(scope, element, attributes, wfExperiment) {
            scope.currentTemp = 0;
        }
    };
});
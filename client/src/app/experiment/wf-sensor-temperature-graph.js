angular.module('wellFollowed').directive('wfSensorTemperatureGraph', function(SensorValue, createChangeStream) {
   return {
       restrict: 'E',
       templateUrl: 'experiment/wf-sensor-temperature-graph.html',
       require: '^wfExperiment',
       controller: function($scope) {


           $scope.paused = false;

           var src = new EventSource('/api/SensorValues/watchValues/sensor1');
           var changes = createChangeStream(src);


           var values = {
               key: 'Température',
               values: [[0,0]]
           };

           var MAX = 16;
           var data = $scope.data = [values];

           changes.on('data', function(update) {
               console.log(update);
               data.forEach(function(series) {
                   series.values.push([
                       update.value
                   ]);

                   series.values = angular.copy(series.values);
               });

               //while(data.length > MAX && data.length > 1) {
               //    data.shift();
               //}

               $scope.$apply();
           });

           changes.on('error', function(err) {
               debugger;
           });
       },
       link: function(scope, element, attributes, wfExperiment) {



       }
   };
});
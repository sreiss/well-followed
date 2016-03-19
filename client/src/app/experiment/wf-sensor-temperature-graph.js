angular.module('wellFollowed').directive('wfSensorTemperatureGraph', function(SensorValue, createChangeStream) {
   return {
       restrict: 'E',
       templateUrl: 'experiment/wf-sensor-temperature-graph.html',
       require: '^wfExperiment',
       controller: function($scope) {


           $scope.paused = false;

           var src = new EventSource('/api/SensorValues/watchValues/sensor1');
           var changes = createChangeStream(src);

           var heapTotal = {
               key: 'Heap Total',
               src: 'heapTotal',
               values: []
           };

           var heapUsed = {
               key: 'Heap Used',
               src: 'heapUsed',
               values: []
           };

           var rss = {
               key: 'RSS',
               src: 'rss',
               values: []
           };

           var MAX = 16;
           var data = $scope.data = [heapTotal, heapUsed, rss];

           changes.on('data', function(update) {
               data.forEach(function(points) {
                   if($scope.paused) return;
                   points.values.push([
                       update.time,
                       update.usage[points.src]
                   ]);

                   while(points.values.length > MAX && points.values.length > 1) {
                       points.values.shift();
                   }

                   points.values = angular.copy(points.values);
               });

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
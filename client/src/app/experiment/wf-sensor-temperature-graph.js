angular.module('wellFollowed').directive('wfSensorTemperatureGraph', function(SensorValue) {
   return {
       restrict: 'E',
       templateUrl: 'experiment/wf-sensor-temperature-graph.html',
       require: '^wfExperiment',
       link: function(scope, element, attributes, wfExperiment) {

           var src = new EventSource('/api/SensorValue/stream');
           var changes = createChangeStream(src);

           var date = {
               key: 'Temps t',
               src: 'date',
               values: []
           };

           var value = {
               key: 'Valeur',
               src: 'value',
               values: []
           };

           var data = scope.data = [date, value];

           changes.on('data', function(update) {

           });

           scope.xAxisTickFormatFunction = function(){
               return function(d){
                   return d3.time.format('%H:%M')(moment.unix(d).toDate());
               }
           };

       }
   };
});
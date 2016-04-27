/**
 * A sensor on the experiment page. A directive will be dynamically picked depending on the type of data.
 */
angular.module('wellFollowed').directive('wfSensor', function(SensorData, $wfStream, $compile, $injector) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-sensor.html',
        scope: {
            sensor: '='
        },
        controller: function($scope) {
            this.getPreviousValues = function() {
                return SensorData.find({filter: {where: {sensorId: $scope.sensor.id}}})
                    .$promise;
            };

            this.openStream = function() {
                return $wfStream.openStream('/api/SensorData/change-stream?_format=event-stream');
            };

            this.onChangeReceived = function(callback) {
                var changes = this.openStream();
                changes.on('data', function(message) {
                    if (message.data && (message.data.sensorId == $scope.sensor.id)) {
                        callback(message.data);
                    }
                });
            };
        },
        link: function(scope, element, attributes) {
            var panelBody = element.find('.panel-body');

            // Vérification de l'existence de la directive associée au type
            var type = scope.sensor.type;
            var directiveName = 'wfSensor' + type.charAt(0).toUpperCase() + type.slice(1);
            var directiveElementName = '';
            for (var i = 0; i < directiveName.length; i++) {
                if (directiveName[i] == directiveName[i].toUpperCase()) {
                    directiveElementName += '-' + directiveName[i].toLowerCase();
                } else {
                    directiveElementName += directiveName[i];
                }
            }
            var html;
            if ($injector.has(directiveName + 'Directive') && type != 'notImplemented') {
                html = angular.element('<' + directiveElementName + ' style="display: block"></' + directiveElementName + '>');
            } else {
                html = angular.element('<wf-sensor-not-implemented style="display: block"></wf-sensor-not-implemented>')
            }
            panelBody.append(html);
            $compile(html)(scope.$new());
        }
    };
});
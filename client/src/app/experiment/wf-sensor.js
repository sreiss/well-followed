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
            /**
             * Retrieves the values that where emitted from the server prior to the opening of the page.
             * Useful to draw a graph that begins when the data started to be sent for example
             * (instead of when the user reached the page).
             * @returns {Promise}
             */
            this.getPreviousValues = function() {
                return SensorData.find({filter: {where: {sensorId: $scope.sensor.id}}})
                    .$promise;
            };

            /**
             * Deprecated. Use onChangeReceived instead.
             */
            this.openStream = function() {
                return $wfStream.openStream('/api/SensorData/change-stream?_format=event-stream');
            };

            /**
             * Opens a change stream to the server and calls the given callback each time data is received.
             * @param callback The callback called each time data is received. the data is passed to this callback.
             */
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
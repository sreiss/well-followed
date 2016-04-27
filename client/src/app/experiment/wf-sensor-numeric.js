/**
 * Handles the display of numeric data passed through the sensor.
 */
angular.module('wellFollowed').directive('wfSensorNumeric', function($wfStream, SensorData, $window) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-sensor-numeric.html',
        require: '^wfSensor',
        controller: function($scope) {
            $scope.data = [];
            $scope.temperature = 0;
        },
        link: function(scope, element, attributes, wfSensor) {

            wfSensor.getPreviousValues().then(function(previousData) {

                var windowElement = angular.element($window);

                var n = 50,
                    duration = 750,
                    now = new Date(Date.now() - duration),
                    data = d3.range(n).map(function () {
                        return 0;
                    });

                var margin = {top: 6, right: 0, bottom: 40, left: 0},
                    width = element.width() - margin.right,
                    height = 200 - margin.top - margin.bottom;

                var x = d3.time.scale()
                    .domain([now - (n - 2) * duration, now - duration])
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function (d, i) {
                        return x(now - (n - 1 - i) * duration);
                    })
                    .y(function (d, i) {
                        return y(d);
                    });

                var svg = d3.select(element[0]).select("svg")
                    //.attr("width", width + margin.left + margin.right)
                    //.attr("height", height + margin.top + margin.bottom)
                    //.style("margin-left", -margin.left + "px")
                    .classed("svg-container", true)
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("viewBox", "0 0 600 250")
                    .append("g")
                    .classed("svg-content-responsive", true)
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                var xAxis = svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient('left');

                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("Température (C°)");

                var path = svg.append("g")
                    .attr("clip-path", "url(#clip)")
                    .append("path")
                    .datum(data)
                    .attr("class", "line");

                var pushSensorData = function(sensorData) {
                    // update the domains
                    now = new Date(sensorData.date);
                    x.domain([now - (n - 2) * duration, now - duration]);

                    // Nous ne traitons que la donnée si c'est une valeur
                    if (!sensorData.isSignal) {
                        sensorData.value = parseInt(sensorData.value, 10);
                        if (sensorData.value > 40)
                            y.domain([0, sensorData.value])
                        else
                            y.domain([0, 40]);

                        // push the accumulated count onto the back, and reset the count
                        data.push(sensorData.value);

                        // redraw the line
                        svg.select(".line")
                            .attr("d", line)
                            .attr("transform", null);

                        // slide the x-axis left
                        xAxis.call(x.axis);

                        // slide the line left
                        path.transition()
                            .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

                        // pop the old data point off the front
                        data.shift();
                    }
                };

                if (previousData.length > 0) {
                    previousData.map(function(d) {
                        pushSensorData(d);
                    });
                }

                wfSensor.onChangeReceived(function (sensorData) {
                    if (!sensorData.isSignal) {
                        scope.temperature = sensorData.value;
                    } else {
                        if (sensorData.value == 'start') {
                            scope.temperature = "Acquisition des données...";
                        } else {
                            scope.temperature = 'Tramission terminée.';
                        }
                    }

                    pushSensorData(sensorData);
                });

            });
        }
    };
});
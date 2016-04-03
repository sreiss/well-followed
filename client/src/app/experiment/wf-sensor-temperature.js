angular.module('wellFollowed').directive('wfSensorTemperature', function($wfStream, SensorValue) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-sensor-temperature.html',
        scope: {
            sensor: '='
        },
        require: '^wfExperiment',
        controller: function($scope) {
            $scope.data = [];
            $scope.temperature = 0;
        },
        link: function(scope, element, attributes, wfExperiment) {

            SensorValue.find({filter: {where: {sensorName: scope.sensor.name}}})
                .$promise
                .then(function(previousData) {

                    var changes = $wfStream.openStream('/api/SensorValues/watchValues/' + scope.sensor.name);

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
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .style("margin-left", -margin.left + "px")
                        .append("g")
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

                    var pushSensorValue = function(sensorValue) {
                        // update the domains
                        now = new Date(sensorValue.date);
                        x.domain([now - (n - 2) * duration, now - duration]);
                        if (sensorValue.value > 40)
                            y.domain([0, sensorValue.value])
                        else
                            y.domain([0, 40]);

                        // push the accumulated count onto the back, and reset the count
                        data.push(sensorValue.value);

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
                    };

                    if (previousData.length > 0) {
                        previousData.map(function(d) {
                            pushSensorValue(d);
                        });
                    }

                    changes.on('data', function (sensorValue) {
                        scope.temperature = sensorValue.value;

                        pushSensorValue(sensorValue);
                    });

                });

            //var margin = {top: 20, right: 20, bottom: 30, left: 50},
            //    width = 400 - margin.left - margin.right,
            //    height = 300 - margin.top - margin.bottom;
            //var dateFormat = d3.time.format('%Y-%m-%dT%H:%M:%S');
            //var x = d3.time.scale()
            //    .range([0, width]);
            //var y = d3.scale.linear()
            //    .range([height, 0]);
            //var xAxis = d3.svg.axis()
            //    .scale(x)
            //    .orient('bottom');
            //var yAxis = d3.svg.axis()
            //    .scale(y)
            //    .orient('left');
            //var line = d3.svg.line()
            //    .x(function(d) { return x(d.date); })
            //    .y(function(d) { return y(d.value); });
            //
            //var svg = d3.select(element[0]).select('svg')
            //    .attr("width", width + margin.left + margin.right)
            //    .attr("height", height + margin.top + margin.bottom)
            //    .append('g')
            //    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
            //
            //svg.append("g")
            //    .attr("class", "y axis")
            //    .call(yAxis)
            //    .append("text")
            //    .attr("transform", "rotate(-90)")
            //    .attr("y", 6)
            //    .attr("dy", ".71em")
            //    .style("text-anchor", "end")
            //    .text("Température (C°)");
            //
            //svg.append("g")
            //    .attr("class", "x axis")
            //    .attr("transform", "translate(0," + height + ")")
            //    .call(xAxis);
            //
            //var data = [];
            //changes.on('data', function(sensorValue) {
            //    scope.temperature = sensorValue.value;
            //
            //    sensorValue.date = dateFormat.parse(sensorValue.date);
            //    sensorValue.value = +sensorValue.value;
            //
            //    data.push(sensorValue);
            //
            //    y.domain(d3.extent(data, function(d) {return d.date;}));
            //    x.domain(d3.extent(data, function(d) {return d.value;}));
            //
            //    svg.append("path")
            //        .datum(data)
            //        .attr("class", "line")
            //        .attr("d", line);
            //
            //});
            //
            //changes.on('error', function(err) {
            //    debugger;
            //});
        }
    };
});
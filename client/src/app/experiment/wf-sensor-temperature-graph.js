angular.module('wellFollowed').directive('wfSensorTemperatureGraph', function() {
   return {
       restrict: 'E',
       templateUrl: 'experiment/wf-sensor-temperature-graph.html',
       require: '^wfExperiment',
       link: function(scope, element, attributes, wfExperiment) {

           var n = 243,
               duration = 750,
               now = new Date(Date.now() - duration),
               data = d3.range(n).map(function() { return 0; });

           var margin = {top: 6, right: 40, bottom: 20, left: 40},
               width = element.width() - margin.right,
               height = 120 - margin.top - margin.bottom;

           var x = d3.time.scale()
               .domain([now - (n - 2) * duration, now - duration])
               .range([0, width]);

           var y = d3.scale.linear()
               .range([height, 0]);

           var line = d3.svg.line()
               .interpolate("basis")
               .x(function(d, i) { return x(now - (n - 1 - i) * duration); })
               .y(function(d, i) { return y(d); });

           var svg = d3.select(element[0]).append("p").append("svg")
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

           var axis = svg.append("g")
               .attr("class", "x axis")
               .attr("transform", "translate(0," + height + ")")
               .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));

           var path = svg.append("g")
               .attr("clip-path", "url(#clip)")
               .append("path")
               .datum(data)
               .attr("class", "line");

           var transition = d3.select({}).transition()
               .duration(750)
               .ease("linear");

           //d3.select(window)
           //    .on("scroll", function() { ++count; });

           var session = wfExperiment.getWsSession();

           session.subscribe('sensor/data/' + scope.sensor.name, function(uri, payload) {

               scope.$apply(function() {
                   scope.currentTemp = payload.msg.value;
               });
               //data.push(payload.msg.val);
               //path.transition()
               //    .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");
               // update the domains
               now = new Date(payload.msg.date.date);
               x.domain([now - (n - 2) * duration, now - duration]);
               y.domain([0, d3.max(data)]);

               // push the accumulated count onto the back, and reset the count
               data.push(payload.msg.value);
               //count = 0;

               // redraw the line
               svg.select(".line")
                   .attr("d", line)
                   .attr("transform", null);

               // slide the x-axis left
               axis.call(x.axis);

               // slide the line left
               path.transition()
                   .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

               // pop the old data point off the front
               data.shift();
           });

           //var margin = {top: 20, right: 20, bottom: 30, left: 50},
           //    width = angular.element(element.children()[0]).width() - margin.left - margin.right,
           //    height = 300 - margin.top - margin.bottom;
           //
           //var formatDate = d3.time.format("%d-%b-%y");
           //
           //var x = d3.time.scale()
           //    .range([0, width]);
           //
           //var y = d3.scale.linear()
           //    .range([height, 0]);
           //
           //var xAxis = d3.svg.axis()
           //    .scale(x)
           //    .orient("bottom");
           //
           //var yAxis = d3.svg.axis()
           //    .scale(y)
           //    .orient("left");
           //
           //var line = d3.svg.line()
           //    .x(function(d) { return x(d.date); })
           //    .y(function(d) { return y(d.close); });
           //
           //var svg = d3.select(element.children()[0]).append("svg")
           //    .attr("width", width + margin.left + margin.right)
           //    .attr("height", height + margin.top + margin.bottom)
           //    .append("g")
           //    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
           //
           //var session = wfExperiment.getWsSession();
           //var data = [];
           //
           //x.domain(d3.extent(data, function(d) { return d.date; }));
           //y.domain(d3.extent(data, function(d) { return d.value; }));
           //
           //svg.append("g")
           //    .attr("class", "x axis")
           //    .attr("transform", "translate(0," + height + ")")
           //    .call(xAxis);
           //
           //svg.append("g")
           //    .attr("class", "y axis")
           //    .call(yAxis)
           //    .append("text")
           //    .attr("transform", "rotate(-90)")
           //    .attr("y", 6)
           //    .attr("dy", ".71em")
           //    .style("text-anchor", "end")
           //    .text("Température");
           //
           //session.subscribe('sensor/data/' + scope.sensor.name, function(uri, payload) {
           //
           //    scope.$apply(function() {
           //        scope.currentTemp = payload.msg.value;
           //    });
           //
           //    data.push(payload.msg);
           //
           //    svg.append("path")
           //        .datum(data)
           //        .attr("class", "line")
           //        .attr("d", line);
           //
           //});

       }
   };
});
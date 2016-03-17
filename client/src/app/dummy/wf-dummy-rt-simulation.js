angular.module('wellFollowed').directive('wfDummyRtSimulation', function($wfUrl, $interval) {
    return {
        restrict: 'E',
        scope: {
            sensorName: '@'
        },
        link: function (scope, element, attributes) {
            var websocket = WS.connect($wfUrl.getWsUrl());
            var wsSession = null;

            websocket.on('socket/connect', function (session) {
                wsSession = session;
                console.log('Websocket connection success.');

                $interval(function() {
                    var val = Math.floor((Math.random() * 10) + 9);
                    var p  = document.createElement('p');
                    angular.element(p).text('[' + new Date() + '] Value ' + val + ' sent to ' + scope.sensorName);
                    element.prepend(p);
                    wsSession.publish('sensor/data/' + scope.sensorName, {date: new Date(), val: val});
                }, 1000);
            });

            websocket.on('socket/disconnect', function (error) {
                wsSession = null;
            });
        }
    };
});
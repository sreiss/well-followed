angular.module('wellFollowed').directive('wfVideoStream', function($wfStream) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-video-stream.html',
        link: function(scope, element, attributes) {
            var changes = $wfStream.openStream('/api/VideoStreams/watchStream/camera1');

            var img = element.find('img');
            scope.maxWidth = element.width() - 30;

            changes.on('data', function(stream) {
                img.attr('src', 'data:image/jpeg;base64,' + stream.changes);
            });
        }
    }
});
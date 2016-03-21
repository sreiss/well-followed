angular.module('wellFollowed').directive('wfVideoStream', function(createChangeStream) {
    return {
        restrict: 'E',
        templateUrl: 'experiment/wf-video-stream.html',
        link: function(scope, element, attributes) {
            var src = new EventSource('/api/VideoStreams/watchStream/camera1');
            var changes = createChangeStream(src);

            var img = element.find('img');
            scope.maxWidth = element.width() - 30;

            changes.on('data', function(stream) {
                img.attr('src', 'data:image/jpeg;base64,' + stream.changes);
            });

            scope.$on('$destroy', function() {
                changes.destroy();
            });
        }
    }
});
angular.module('wellFollowed').factory('$wfStream', function(createChangeStream) {

  var _openedStreams = {};

  var _openStream = function(url) {
      if (!_openedStreams[url]) {
        var src = new EventSource(url);
        _openedStreams[url] = createChangeStream(src);
      }
      return _openedStreams[url];
  };

  return {
    openStream: _openStream
  };

});

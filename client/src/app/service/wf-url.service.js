angular.module('wellFollowed').factory('$wfUrl', function($location) {

    var _getApiUrl = function() {
        return 'http://' + $location.host() + ':8085';
    };

    var _getWsUrl = function() {
        return 'ws://' + $location.host() + ':8080';
    };

    return {
        getApiUrl: _getApiUrl,
        getWsUrl: _getWsUrl
    };
    
});
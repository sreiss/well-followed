angular.module('wellFollowed').factory('$wfUser', function($http, WfUser) {

    var _getResource = function() {
        return WfUser;
    };

    return {
        getResource: _getResource
    };

});
angular.module('wellFollowed').factory('$wfUser', function($http, $wfUrl) {

    var _baseUrl = $wfUrl.getApiUrl() + '/api/users';

    var _createUser = function(model) {
        return $http.post(_baseUrl, model);
    };

    var _getUsers = function(filter) {
        return $http.get(_baseUrl, { params: filter });
    };

    var _getUser = function(username) {
        return $http.get(_baseUrl + '/' + username);
    };

    var _updateUser = function(model) {
        return $http.put(_baseUrl, model);
    };

    var _deleteUser = function(username) {
        return $http.delete(_baseUrl + '/' + username);
    };

    return {
        createUser: _createUser,
        getUsers: _getUsers,
        getUser: _getUser,
        updateUser: _updateUser,
        deleteUser: _deleteUser
    };

});
angular.module('wellFollowed').factory('$wfInstitution', function($http, $wfUrl) {

    var _baseUrl = $wfUrl.getApiUrl() + '/api/institution';

    var _createInstitution = function(model) {
        return $http.post(_baseUrl, model);
    };

    var _getInstitutions = function(filter) {
        return $http.get(_baseUrl, { params: filter });
    };

    var _getInstitution = function(id) {
        return $http.get(_baseUrl + '/' + id);
    };

    var _updateInstitution = function(model) {
        return $http.put(_baseUrl, model);
    };

    var _deleteInstitution = function(id) {
        return $http.delete(_baseUrl + '/' + id);
    };

    return {
        createInstitution: _createInstitution,
        getInstitutions: _getInstitutions,
        getInstitution: _getInstitution,
        updateInstitution: _updateInstitution,
        deleteInstitution: _deleteInstitution
    };

});
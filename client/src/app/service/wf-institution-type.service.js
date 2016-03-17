angular.module('wellFollowed').factory('$wfInstitutionType', function($http, $wfUrl) {

    var _baseUrl = $wfUrl.getApiUrl() + '/api/institution-type';

    var _createInstitutionType = function(model) {
        return $http.post(_baseUrl, model);
    };

    var _getInstitutionTypes = function(filter) {
        return $http.get(_baseUrl, { params: filter });
    };

    var _getInstitutionType = function(id) {
        return $http.get(_baseUrl + '/' + id);
    };

    var _updateInstitutionType = function(model) {
        return $http.put(_baseUrl, model);
    };

    var _deleteInstitutionType = function(id) {
        return $http.delete(_baseUrl + '/' + id);
    };

    return {
        createInstitutionType: _createInstitutionType,
        getInstitutionTypes: _getInstitutionTypes,
        getInstitutionType: _getInstitutionType,
        updateInstitutionType: _updateInstitutionType,
        deleteInstitutionType: _deleteInstitutionType
    };

});
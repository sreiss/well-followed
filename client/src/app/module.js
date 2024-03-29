/**
 * Main module of the application.
 */
angular.module('wellFollowed', [
    'ui.router',
    'ngMessages',
    'ngAnimate',
    'wfTemplates',
    'wfLibTemplates',
    'ui.calendar',
    'LocalStorageModule',
    'ui.bootstrap.modal',
    'ui.bootstrap.alert',
    'ui.bootstrap.popover',
    'ui.bootstrap.tooltip',
    'ui.bootstrap.position',
    'ui.bootstrap.pagination',
    'angular-loading-bar',
    'lbServices',
    'nvd3ChartDirectives',
    'ls.LiveSet',
    'ls.ChangeStream'
]).config(function($stateProvider, $urlRouterProvider, $httpProvider, cfpLoadingBarProvider, LoopBackResourceProvider, wfHttpSettings) {

    LoopBackResourceProvider.setUrlBase(wfHttpSettings.urlBase);

    //var formatDate = function(data) {
    //    if (!!data) {
    //        for (var key in data) {
    //            if (data[key] instanceof Date)
    //                data[key] = moment(data[key]);
    //
    //            if (!!data[key].format)
    //                data[key] = data[key].format('YYYY-MM-DD[T]HH:mm:ssZZ');
    //            else if (typeof data[key] === 'object')
    //                formatDate(data[key]);
    //        }
    //    }
    //    return data;
    //};

    //$httpProvider.defaults.transformRequest.unshift(formatDate);

    // To intercept http errors.
    $httpProvider.interceptors.push('$wfAuthInterceptor');

    // Broadcasts an http error to the entire application.
    $httpProvider.interceptors.push(function($q, $rootScope) {
        var errorHandler = function(rejection) {
            $rootScope.$broadcast('wfError', rejection.data.error || rejection.data.message);

            return $q.reject(rejection);
        };

        return {
            'requestError': errorHandler,
            'responseError': errorHandler
        };
    });

    // Registration of all the routes of the application
    // The "template" attribute should always contain a directive to represent a screen.
    $stateProvider
        .state('login', {
            url: '/connexion',
            template: '<wf-login></wf-login>'
        })
        .state('home', {
            url: '/',
            template: '<wf-home></wf-home>'
        })
        .state('calendar', {
            url: '/calendrier',
            template: '<wf-planning></wf-planning>'
        })
        .state('account', {
            url: '/compte',
            template: '<wf-account></wf-account>'
        })
        .state('subscription', {
            url: '/compte/inscription',
            template: '<wf-account-create></wf-account-create>'
        })
        .state('experiment', {
            url: '/experience',
            template: '<wf-experiment></wf-experiment>'
        })
        .state('experimentHistory', {
            url: '/experience/historique',
            template: '<wf-experiment-history></wf-experiment-history>'
        })
        .state('rtSimulation', {
            url: '/dummy/rtSimulation/:sensorName',
            template: function(params) { return '<wf-dummy-rt-simulation sensor-name="' + params.sensorName + '"></wf-dummy-rt-simulation>'; }
        })
        .state('admin', {
            url: '/admin',
            abstract: true,
            template: '<wf-admin></wf-admin>'
        })
        .state('admin.users', {
            url: '/utilisateurs',
            template: '<wf-admin-users></wf-admin-users>'
        })
        .state('admin.user', {
            url: '/utilisateur/:userId',
            template: function(params) { return '<wf-admin-user user-id="' + params.userId + '"></wf-admin-user>'; }
        })
        .state('admin.institutionTypes', {
            url: '/types-d-etablissements',
            template: '<wf-admin-institution-types></wf-admin-institution-types>'
        })
        .state('admin.institutionType', {
            url: '/type-d-etablissement/:id',
            template: function(params) { return '<wf-admin-institution-type institution-type-id="' + params.id + '"></wf-admin-institution-type>'; }
        })
        .state('admin.institutions', {
            url: '/etablissements',
            template: '<wf-admin-institutions></wf-admin-institutions>'
        })
        .state('admin.institution', {
            url: '/etablissement/:id',
            template: function(params) { return '<wf-admin-institution institution-id="' + params.id + '"></wf-admin-institution>'; }
        })
        .state('error', {
            url: '/erreur',
            abstract: true,
            template: '<wf-error></wf-error>'
        })
        .state('error.accessDenied', {
            url: '/acces-refuse',
            template: '<wf-error-access-denied></wf-error-access-denied>'
        });

    $urlRouterProvider.otherwise('/');

    cfpLoadingBarProvider.includeSpinner = false;
})
.run(function($wfAuth, $rootScope, wfCrudTypes) {
    $rootScope.wfCrudTypes = wfCrudTypes;
});
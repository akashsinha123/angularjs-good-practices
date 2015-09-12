'use strict';

/**
 * @ngdoc overview
 * @name AngularAuth
 * @description
 * # AngularAuth
 *
 * Main module of the application.
 */
angular
  .module('AngularAuth', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'btford.socket-io',
    'angular-md5',
    'luegg.directives',
    'http-auth-interceptor'
  ])
  .constant('moment', moment)
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
    
    $routeProvider
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        
      })
      .otherwise({
        redirectTo: '/login'
      });
  });

'use strict';

/**
 * @ngdoc function
 * @name AngularAuth.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the AngularAuth
 */
angular.module('AngularAuth')
  .controller('LoginCtrl', function ($scope, $location, $cookieStore, AuthenticationService) {

    $scope.credentials = {
      email : "",
      password : ""
    };

  	$scope.login = function(){
      AuthenticationService.login($scope.credentials)


    }

  });

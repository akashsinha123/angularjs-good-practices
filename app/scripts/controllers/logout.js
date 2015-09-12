'use strict';

/**
 * @ngdoc function
 * @name AngularAuth.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the AngularAuth
 */
angular.module('AngularAuth')
  .controller('LogoutCtrl', function ($scope, $location, $cookieStore, LoginService) {


  	$scope.testing = function(){
       
        LoginService.testing()
        .then(function(user){
            console.log(user);
        })
        .catch(function(err){
            
        });
    }

    $scope.testing();

  });

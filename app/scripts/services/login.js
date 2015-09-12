'use strict';

/**
 * @ngdoc function
 * @name AngularAuth.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the AngularAuth
 */
// angular.module('AngularAuth')
//   .service('LoginService', function ($http, $q) {
   
//    this.testing = function(){
//     var deferred = $q.defer();
    
//     $http.post('/api/test.php', "random data")
//     .success(function(info){
//       deferred.resolve(info);
//     })
//     .error(function(err){
//       deferred.reject(err);
//     });

//     return deferred.promise;
//    };

//   });

  angular.module('AngularAuth')
  .factory('FlashService', function ($rootScope) {

    return {
      show: function(message) {
        $rootScope.flash = message;
      },

      clear: function(){
        $rootScope.flash = "";
      }
    }

  });

  angular.module('AngularAuth')
  .factory('SessionService', function ($) {

    return {
      get: function(key) {
        return sessionStorage.getItem(key);
      },
      set: function(key, val) {
        return sessionStorage.setItem(key, val);
      },
      unset: function(key) {
        return sessionStorage.removeItem(key);
      }
    }

  });

  angular.module('AngularAuth')
  .factory('AuthenticationService', function ($http, $sanitize, SessionService, CSRF_TOKEN) {

    var cacheSession = function(){
      SessionService.set('authenticated', true);
    }

    var uncacheSession = function(){
      SessionService.unset('authenticated');
    }

    var loginError = function(res) {
      FlashService.show(response)
    }

    var sanitizeCredentials = function(credentials) {
      return {
        email : $sanitize(credentials.email),
        password : $sanatize(credentials.password),
        csrf_token : CSRF_TOKEN
      }
      console.log($sanitize(credentials.email), $sanatize(credentials.password), CSRF_TOKEN);
    }
  
    return {
      login : function(credentials){
        var login = $http.post("/api/login.php", sanitizeCredentials(credentials));
        login.success(cacheSession);
        login.success(FlashService.clear);
        login.error(loginError);
        return login;
      }
    }

  });

  













































var app = angular.module('app',['Angumate']);

app.config(['$routeProvider', function($routeProvider) {

  "use strict";

  $routeProvider.when('', {
    templateUrl: 'partials/home.html',
    resolve: {
      wait: ['angumate', function(angumate) {
        return angumate.promise();
      }]
    }
  })
  .when('/home', {
    templateUrl: 'partials/home.html',
    resolve: ['angumate', function(angumate) {
      return angumate.promise();
    }]
  })
  .when('/download', {
    templateUrl: 'partials/download.html',
    resolve: {
      wait: ['angumate', function(angumate) {
        return angumate.promise();
      }]
    }
  })
  .when('/installation', {
    templateUrl: 'partials/installation.html',
    resolve: {
      wait: ['angumate', function(angumate) {
        return angumate.promise();
      }]
    }
  })
  .when('/usage', {
    templateUrl: 'partials/usage.html',
    resolve: {
      wait: ['angumate', function(angumate) {
        return angumate.promise();
      }]
    }
  })
  .otherwise({ redirectTo: '/home' });

}]);
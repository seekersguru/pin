'use strict';

angular.module('pinApp')
  .controller('LoginCtrl', function ($scope, $location, $rootScope) {
    $scope.user = {};
    $scope.errors = {};
    
    $scope.login = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        $rootScope.login=1;
        $location.url('/dashboard');
      }
    };
  });

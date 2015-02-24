'use strict';

angular.module('pinApp')
  .controller('RegisterCtrl',['$scope','$location','$rootScope','Auth', function ($scope, $location,$rootScope ,Auth) {
    // $scope.user = {};
    $scope.errors = {};

     $scope.register = function(form) {
      $scope.submitted = true;
  
      if(form.$valid) {
        Auth.createUser({
          fullname: $scope.user.fullname,
          name:  $scope.user.name,
          alias: $scope.user.alias,
          address: $scope.user.address,
          email: $scope.user.email,
          phone: $scope.user.phone,
          nominated: $scope.user.nominated
        })
        .then( function() {
          // Account created, redirect to home
          $scope.emailSent = true;
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  }]);

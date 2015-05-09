'use strict';

angular.module('pinApp')
  .controller('ForgotCtrl', function ($scope, Auth) {
    $scope.email = {};
    $scope.errors = {};
    $scope.success = false;
    $scope.submitDisabled = false;
    $scope.forgotPassword = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        $scope.submitDisabled = true;
        Auth.resetPassword({
          email: $scope.email
        })
        .then(function() {
          $scope.success = true;
        })
        .catch(function(err) {
          $scope.errors.other = err.data;
          $scope.submitDisabled = false;
        }); 
      }     
    };
  });

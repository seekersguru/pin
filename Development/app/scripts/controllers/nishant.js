'use strict';

angular.module('pinApp')
  .controller('NishantCtrl',['$scope','$location','$rootScope','Auth', function ($scope, $location,$rootScope ,Auth) {
    // $scope.user = {};
    $scope.errors = {};

     $scope.nishant = function(form) {
      $scope.submitted = true;
  
      if(form.$valid) {

      }
    };

  }]);

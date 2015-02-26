'use strict';

angular.module('pinApp')
  .controller('NishantCtrl',['$scope','$location','$rootScope','$http', function ($scope, $location,$rootScope ,$http) {
    // $scope.user = {};
    $scope.errors = {};

     $scope.nishant = function(form) {
      $scope.submitted = true;
  
      if(form.$valid) {
      	console.log( $scope.user);
        $http.post('api/nishant', $scope.user)
        .success(function(data, status, headers, config){

          $scope.status=data.status;

        })
        .error(function(data, status, headers, config){

        });


      }
    };

  }]);

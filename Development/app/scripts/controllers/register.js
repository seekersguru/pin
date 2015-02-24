'use strict';

angular.module('pinApp')
  .controller('RegisterCtrl',['$scope','$location','$rootScope', function ($scope, $rootScope ,$location) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register=function(form){
  	 $scope.submitted = true;
      if(form.$valid) {
        // $location.url('/login');
        console.log($scope.user);
      }
    };
  }]);

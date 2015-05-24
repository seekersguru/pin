'use strict';

angular.module('pinApp')
	.controller('FooterCtrl', ['$scope','$rootScope','$location',function($scope,$rootScope,$location){


  $scope.searcharticle=function(form)
  {

   if(form.$valid)
      {
       $location.path('/articles/search/'+$scope.search);

      }

  };

// active menu option
	$scope.isActive = function(route) {
      return $location.path() === route;
  };


}]);
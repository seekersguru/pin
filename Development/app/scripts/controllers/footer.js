'use strict';

angular.module('pinApp')
	.controller('FooterCtrl', ['$scope','$rootScope','$location',function($scope,$rootScope,$location){

		// active menu option
		$scope.isActive = function(route) {
	      return $location.path() === route;
	  };



}]);
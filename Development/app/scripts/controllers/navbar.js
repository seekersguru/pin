'use strict';

angular.module('pinApp')
	.controller('NavbarCtrl', ['$scope','$location','$rootScope', function($scope,$location,$rootScope){

	// active menu option
	$scope.isActive = function(route) {
      return $location.path() === route;
  };
    
    // logout
	$scope.logout = function() {
		  $rootScope.loginStatus=0;
		  $location.path('/login');
  };
  
  //login
  $scope.login = function(form) {
	  $scope.submitted = true;
	  $rootScope.loginStatus=1;
	  if(form.$valid) {
	  	$location.path('/dashboard');
	  }
	  else{
	  	$location.path('/login');
	  }
	};

}]);
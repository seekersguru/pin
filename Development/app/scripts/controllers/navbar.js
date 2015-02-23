'use strict';

this.pinApp.controller('NavbarCtrl', ['$scope','$location', function($scope,$location){

	// active menu option
	$scope.isActive = function(route) {
      return $location.path() === route;
  };
    
    // logout
	$scope.logout = function() {
		  $location.path('/login');
  };
  
  //login
  $scope.login = function(form) {
	  $scope.submitted = true;
	  if(form.$valid) {
	  	$location.path('/dashboard');
	  }
	  else{
	  	$location.path('/login');
	  }
	};

}]);
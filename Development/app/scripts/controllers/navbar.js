'use strict';

angular.module('pinApp')
	.controller('NavbarCtrl', ['$scope','$location','$rootScope','Auth', function($scope,$location,$rootScope,Auth){

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
      Auth.login({
        // I really hate doing this, I hope Angular JS guys and FF guys can solve this issue.
        email: document.getElementById('emailnav').value,   // Doing this becuase of Firefox issue of autofill
        password: document.getElementById('passwordnav').value // not trigerring Angular JS update. FFBug ID: 950510
      })
      .then( function() {
        // Logged in, redirect to home
        if ($rootScope.redirectPath) {
          var path = $rootScope.redirectPath;
          $rootScope.redirectPath = undefined;
          $location.path(path);
        } else {
          $location.path('/');
        }
      })
      .catch( function(err) {
        err = err.data;
        $scope.errors.field = err.message.field;
        $scope.errors.message = err.message.message;
        $scope.errors.type = err.message.type;
      });
    }
	};

}]);
'use strict';

angular.module('pinApp')
  .controller('LoginCtrl', function ($scope, Auth,$location, $rootScope) {
    $scope.user = {};
    $scope.errors = {};
    $rootScope.changeFooterNishant = 1;
    
    $scope.login = function(form) {

      $scope.submitted = true;
      console.log();
      console.log();
      if(form.$valid) {
        Auth.login({
          // I really hate doing this, I hope Angular JS guys and FF guys can solve this issue.
          email: document.getElementById('username').value,   // Doing this becuase of Firefox issue of autofill
          password: document.getElementById('password').value // not trigerring Angular JS update. FFBug ID: 950510
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
  });

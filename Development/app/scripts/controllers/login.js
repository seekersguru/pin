'use strict';

angular.module('pinApp')
  .controller('LoginCtrl', function ($scope, Auth,$location, $rootScope) {
    $scope.user = {};
    $scope.errors = {};
    $rootScope.changeFooterNishant = 1;
    console.log(Object.keys($location.search())[0]);
    $scope.facebookLogin = Auth.facebookLogin;
    $scope.linkedinLogin = Auth.linkedinLogin;
    
    $scope.registerStatus = Object.keys($location.search())[0] || 'test';
    $scope.errormessage=$location.search()[$scope.registerStatus] || '';
    $scope.field=Object.keys($location.search())[1] || 'field';
    

    $scope.login = function(form) {

      $scope.submitted = true;
      if(form.$valid) {
        Auth.login({
          // I really hate doing this, I hope Angular JS guys and FF guys can solve this issue.
          email: document.getElementById('username').value,   // Doing this becuase of Firefox issue of autofill
          password: document.getElementById('password').value // not trigerring Angular JS update. FFBug ID: 950510
        })
        .then( function() {
          // Logged in, redirect to home
          if($rootScope.currentUser.role=='admin')
            {

            $location.path('/admin').search({'users':1});

            }else{
              if ($rootScope.redirectPath) {
                var path = $rootScope.redirectPath;
                $rootScope.redirectPath = undefined;
                $location.path(path);
              } else {
                $location.path('/articles/01');

              }
          }
          $scope.registerStatus='test';
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err, function(error, field) {
            form[error.field].$setValidity('mongoose', false);
            $scope.errors[error.field] = error.message;
          });
          $scope.registerStatus='test';
          
        });
      }
    };
  });

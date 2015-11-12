'use strict';

angular.module('pinApp')
  .controller('RecoverCtrl', ['$scope','Auth','$routeParams',function ($scope, Auth, $routeParams) {
    $scope.submitted = false;
    $scope.success = false;
    $scope.token = $routeParams.token;
    $scope.id = $routeParams.id;
    $scope.errors = {};
    $scope.recover = function(form) {
      $scope.submitted = true;
      if (form.$valid && $scope.password === $scope.Rpassword  ) {
        Auth.recoverPassword({
          _id : $scope.id,
          newPassword : $scope.password,
          token : $scope.token
        })
       .then(function() {
         $scope.success = true;
       })
       .catch(function (err) {
         $scope.errors[err.data] = true;;
       });
      }
    };
  }]);
    

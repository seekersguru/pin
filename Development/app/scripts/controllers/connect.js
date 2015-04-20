'use strict';

angular.module('pinApp')
.controller('ConnectCtrl', function ($scope,$rootScope,$http) {
  $scope.connect={};

  $scope.searchFriends=function(form){
    if(form.$valid)
    {
      $scope.searchactive=0;
      $http({ method: 'GET', url: '/api/users/search/'+$scope.connect.search }).
      success(function (data, status, headers, config) {
        $scope.searchactive=1;
        $scope.searchresult=data.users;
        
      }).
      error(function (data, status, headers, config) {
        $scope.searchactive=1;
         alert('There is something Technical Problem Please try after some time.');
      });
    }

  };

  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

});

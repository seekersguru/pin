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

  $scope.checkStatus=function(userId,key){

    var removeIndex = $scope.searchresult[key].following
          .map(function(item)
          { 
            return item.user;
          })
          .indexOf(userId);
     
      if(removeIndex === -1)
      {

        return 0;
      }
      else{
        return 1;
      }
};

$scope.followUser=function(userId,key){

      $http({ method: 'POST', url: '/api/users/connect/'+userId,data:{user:$rootScope.currentUser._id}}).
      success(function (data, status, headers, config) {

        $scope.searchresult[key].following.push({user:$rootScope.currentUser._id,status:false});
      
      }).
      error(function (data, status, headers, config) {
         alert('There is something Technical Problem Please try after some time.');
      });


};

});

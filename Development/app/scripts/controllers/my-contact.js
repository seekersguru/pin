'use strict';

angular.module('pinApp')
.controller('MyContactCtrl', function ($scope,$rootScope,$http) {
  $scope.connect={};

  $scope.searchFriends=function(form){
    
      $scope.searchactive=0;
      $http({ method: 'GET', url: '/api/users/mycontact/'+$rootScope.currentUser._id }).
      success(function (data, status, headers, config) {
        $scope.searchactive=1;
        $scope.searchresult=data.users;
        
        var removeIndex = $scope.searchresult
        .map(function(item)
          { 
            return item._id;
          })
          .indexOf($rootScope.currentUser._id);

        if (removeIndex > -1) {
            $scope.searchresult.splice(removeIndex, 1);
        } 

      }).
      error(function (data, status, headers, config) {
        $scope.searchactive=1;
         alert('There is something Technical Problem Please try after some time.');
      });
    
  };
  
  $scope.searchFriends();

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
        if($scope.searchresult[key].following[removeIndex].status)
        {
          return 2;
        }else{

          return 1;
        }
        
      }
};

$scope.followUser=function(userId,key){

      $http({ method: 'POST', url: '/api/users/connect/'+userId,data:{user:$rootScope.currentUser._id,name:$rootScope.currentUser.name}}).
      success(function (data, status, headers, config) {

      $scope.searchresult[key].following.push({user:$rootScope.currentUser._id,status:false,name:$rootScope.currentUser.name});
      
      }).
      error(function (data, status, headers, config) {
         alert('There is something Technical Problem Please try after some time.');
      });


};

});

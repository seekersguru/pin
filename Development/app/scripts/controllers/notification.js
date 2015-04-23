'use strict';

angular.module('pinApp')
.controller('NotificationCtrl', ['$scope','$location','$rootScope','Auth','$routeParams','$http', function($scope,$location,$rootScope,Auth,$routeParams,$http){

	$scope.type=$routeParams.type;
if($rootScope.currentUser)
{
	
	$http({ method: 'GET', url: '/api/users/'+$rootScope.currentUser._id}).
	success(function (data, status, headers, config) {
		$scope.following=data.following; 
               // alert("done");  
             }).
	error(function (data, status, headers, config) {
              // ...
              // $scope.article={};
            });

	$scope.updateConnect=function(following_id,statusval,key){

		$http({ method: 'PUT', url: '/api/users/followingstatus/'+following_id,data:{'status':statusval,'name':$scope.following[key].name,'user':$scope.following[key].user}}).
	   	success(function (data, status, headers, config) {
			$scope.following[key].status=statusval;   
		}).
		error(function (data, status, headers, config) {
      // ...
      // $scope.article={};
    });

	};
}

}]);
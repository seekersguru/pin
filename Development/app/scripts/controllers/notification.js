'use strict';

angular.module('pinApp')
	.controller('NotificationCtrl', ['$scope','$location','$rootScope','Auth','$routeParams', function($scope,$location,$rootScope,Auth,$routeParams){
    $scope.type=$routeParams.type;
}]);
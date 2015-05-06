'use strict';

angular.module('pinApp')
	.controller('NavbarCtrl', ['$scope','$location','$rootScope','Auth','$http','$modal', function($scope,$location,$rootScope,Auth,$http,$modal){

	// active menu option
	$scope.isActive = function(route) {
      return $location.path() === route;
  };
    
    // logout
	$scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });   
  };



$scope.popuplogin=function(){
  var modalInstance = $modal.open({
            templateUrl: 'loginmodal.html',
            controller: 'NavLoginCtrl',
            windowClass: "modal fade",
            resolve: {
                // searchable: function () {
                //     return $scope.gridUserData[removeIndex].searchable;
                // },
            }
        });

};

  $scope.getEventslist=function(){
    $scope.eventlist=[];
     $http({
      method:"GET",
      url:'api/events/basic'
    }).
    success(function (data,status,headers,config){

      $scope.pineventlist=data.articles;

    })

    .error(function (data,status,headers,config){

    });



  };

  $scope.searcharticle=function(form)
  {

   if(form.$valid)
      {
       $location.path('/articles/search/'+$scope.search);

      }

  };

$scope.getEventslist();  
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
       
          if($rootScope.currentUser.role=='admin')
            {

            $location.path('/admin').search({'users':1});

            }else{
          
        if ($rootScope.redirectPath && $rootScope.redirectPath !== '/register' ) {
          var path = $rootScope.redirectPath;
          $rootScope.redirectPath = undefined;
          $location.path(path);
        } else {
        
            $location.path('/articles/01');
        }
      }
      })
      .catch( function(err) {
        err = err.data;
        // $location.path('/login').search({'loginError': err.message.message,'field':err.message.field});
        $location.path('/login').search({'loginError': err.message.message,'field':err.message.field});
        // $scope.errors.field = err.message.field;
        // $scope.errors.message = err.message.message;
        // $scope.errors.type = err.message.type;
      });
    }
	};

}]);


angular.module('pinApp')
  .controller('NavLoginCtrl', function ($scope, Auth,$location, $rootScope,$modalInstance) {
    $scope.user = {};
    $scope.errors = {};
    $rootScope.changeFooterNishant = 1;
    $scope.facebookLogin = Auth.facebookLogin;
    $scope.linkedinLogin = Auth.linkedinLogin;
    
    $scope.registerStatus = Object.keys($location.search())[0] || 'test';
    $scope.errormessage=$location.search()[$scope.registerStatus] || '';
    $scope.field=Object.keys($location.search())[1] || 'field';
    
    $scope.forgotpassword=function(){
      $modalInstance.dismiss('cancel');
      $location.path("/forgot");
    };

    
    $scope.login = function(form) {

      $scope.submitted = true;
      if(form.$valid) {
        Auth.login({
          // I really hate doing this, I hope Angular JS guys and FF guys can solve this issue.
          email: $scope.user.email,   // Doing this becuase of Firefox issue of autofill
          password: $scope.user.password // not trigerring Angular JS update. FFBug ID: 950510
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
    
  $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
  };
  });

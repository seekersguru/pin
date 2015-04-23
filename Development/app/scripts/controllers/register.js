
'use strict';

angular.module('pinApp')
  .controller('RegisterCtrl',['$scope','$location','$rootScope','Auth', function ($scope, $location,$rootScope ,Auth) {
    // $scope.user = {};
    $scope.errors = {};
    $scope.user={

    'member':'',
    'interests':'',
    'address':{
      'city':''
    }
    };
    // $scope.email = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
     $scope.checkUsername =function(form){
      form['username'].$setValidity('mongoose', true);
      $scope.errors['username'] = '';
      $scope.checkmessage=''; 

      if($scope.user.username){
       $scope.checkusername=1;
       
       Auth.checkUsername({
           username:$scope.user.username
         })
        .then( function(data) {
          if(data.users)
          {
             form['username'].$setValidity('mongoose', false);
             $scope.errors['username'] = 'username already available :(';

          }else{
             form['username'].$setValidity('mongoose', true);
             $scope.errors['username'] = 'Username available. ';
             $scope.checkmessage='Username available.'; 
          }
          $scope.checkusername=0;
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};
          // Update validity of fPorm fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });

      }else{
        form['username'].$setValidity('mongoose', false);
        $scope.errors['username'] = 'Please fill your alias name';
      }


     };

    
    $scope.$watch('user.username', function(n, o) {
        if($scope.user.username){
          $scope.user.username = $scope.user.username.replace(/\s/g, "");
          $scope.user.username = $scope.user.username.replace("@", "");
        }
        if(n && n.length > 16){
          $scope.user.username = o;
        }
      });    
   

     $scope.register = function(form) {
      $scope.submitted = true;
  		$scope.registerDone=0;
      if(form.$valid) {
        Auth.createUser({
          fullname: $scope.user.fullname,
          name:  $scope.user.name,
          username:  $scope.user.username,
          alias: $scope.user.alias,
          address: $scope.user.address,
          email: $scope.user.email,
          phone: $scope.user.phone,
          membertype: $scope.user.member,
          nominated: $scope.user.nominated,
          interests: $scope.user.interests,
          other: $scope.user.other,
          password:$scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $scope.emailSent = true;
          $scope.registerDone=1;
          // $location.path('/login').search({'register': 1});
          $location.path('/notification').search({ 'type':'register'});
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};
          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  }]);


  
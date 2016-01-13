
'use strict';

angular.module('pinApp')
  .controller('RegisterCtrl',['$scope','$location','$rootScope','Auth','$http', function ($scope, $location,$rootScope ,Auth,$http) {
    // $scope.user = {};

   $scope.getCountries = function() {
      return $http.get('/api/countries')
      .then(function(response){
        return response.data.countries.map(function(item){
          return item;
        });
      });
    };

 $scope.allcountry=$scope.getCountries();

   $scope.getCities = function(val) {
      return $http.get('/api/cities/'+val)
      .then(function(response){
        return response.data.cities.map(function(item){
          return item;
        });
      });
    };

    $scope.errors = {};
    $scope.user={

    'member':'',
    'interests':'',
    'address':{
      'city':'Jaipur',
      'country':'India'
    },
    'adminrole': "Experts"
    };
    var precountry=$scope.user.address.country;

    $scope.checkcountry=function(){
       if(precountry !== $scope.user.address.country)
       {
        precountry = $scope.user.address.country;
        $scope.user.address.city="";

       }

    };

    $scope.interests=['Reading about','Networking','Info about' ,'Investments', ' SFOs in India', 'Funds','Wealth planning', 'SFOs overseas', 'Deals','Administration','Exclusive services','Philanthropy'];

    $scope.user.interests=[];

    // toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(fruitName) {
    var idx = $scope.user.interests.indexOf(fruitName);

    // is currently selected
    if (idx > -1) {
      $scope.user.interests.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.user.interests.push(fruitName);
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
             // $("#username").focus();

          }else{
             form['username'].$setValidity('mongoose', true);
             $scope.errors['username'] = 'Username available. ';
             $scope.checkmessage='Username available.';
             // $("#street").focus();
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
          // $("#street").focus();
        });

      }else{
        form['username'].$setValidity('mongoose', false);
        $scope.errors['username'] = 'Please fill your alias name';
        // $("#username").focus();
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
      var d = new Date();
      var n = d.getTime();
      if(form.$valid) {
        Auth.createUser({
          fullname: $scope.user.name,
          name:  $scope.user.name,
          username:  n,
          alias: $scope.user.alias,
          address: $scope.user.address,
          email: $scope.user.email,
          phone: $scope.user.phone,
          membertype: "Family",
          nominated: "Hansi",
          adminrole: "Experts",
          // interests: $scope.user.interests,
          // interests1: $scope.user.interests1,
          // interests11: $scope.user.interests11,
          // interests2: $scope.user.interests2,
          // interests3: $scope.user.interests3,
          // interests4: $scope.user.interests4,
          // other: $scope.user.other,
          password:n.toString(),
          admin:(window.location.search=="?admin=1")
        })
        .then( function() {
          // Account created, redirect to home
          $scope.emailSent = true;
          $scope.registerDone=1;
          // $location.path('/login').search({'register': 1});
          $location.path('/admin').search({ 'contentexpert':'1'});
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

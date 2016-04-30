'use strict';

angular.module('pinApp')
  .controller('RegisterCtrl', ['$scope', '$location', '$rootScope', 'Auth', '$http', function($scope, $location, $rootScope, Auth, $http) {

    $scope.roletypes = [
      'CEO/business head',
      'Management',
      'Sales/Marketing',
      'Investment/Product',
      'RM/client facing',
      'Investment Mgmt',
      'Product Mgmt'
    ];


    $scope.getCountries = function() {
      return $http.get('/api/countries')
        .then(function(response) {
          return response.data.countries.map(function(item) {
            return item;
          });
        });
    };

    $scope.allcountry = $scope.getCountries();

    $scope.getCities = function(val) {
      return $http.get('/api/cities/' + val)
        .then(function(response) {
          return response.data.cities.map(function(item) {
            return item;
          });
        });
    };

    $scope.errors = {};
    $scope.user = {

      'member': '',
      'interests': '',
      'address': {
        'city': '',
        'country': 'India'
      },
      companyname: {
        title: '',
        address: [{
          'street': '',
          'city': '',
          'state': '',
          'country': '',
          'pin': '',
          'phone': ''
        }]
      }
    };
    var precountry = $scope.user.address.country;

    $scope.checkcountry = function() {
      if (precountry !== $scope.user.address.country) {
        precountry = $scope.user.address.country;
        $scope.user.address.city = "";

      }

    };

    $http({
      method: 'GET',
      url: 'api/companys/register'
    }).
    success(function(data, status, headers, config) {
      $scope.companies = data.company;

    }).
    error(function(data, status, headers, config) {

    });


    $scope.changeaddress = function() {

      if ($scope.user.company && $scope.user.company !== 'add-new') {
        var removeIndex = $scope.companies
          .map(function(item) {
            return item._id;
          })
          .indexOf($scope.user.company);

        $scope.companyaddress = $scope.companies[removeIndex].address;
        $scope.selectroletypes = $scope.companies[removeIndex].roletype;
      }

      // for (var i = 0; i < $scope.companies[removeIndex].address.length-1; i++) {
      //       $scope.companyaddress.push($scope.companies[removeIndex].address[i]);
      // }

    };

    // $scope.email = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;
    $scope.checkUsername = function(form) {
      form['username'].$setValidity('mongoose', true);
      $scope.errors['username'] = '';
      $scope.checkmessage = '';

      if ($scope.user.username) {
        $scope.checkusername = 1;

        Auth.checkUsername({
            username: $scope.user.username
          })
          .then(function(data) {
            if (data.users) {
              form['username'].$setValidity('mongoose', false);
              $scope.errors['username'] = 'username already available :(';

            } else {
              form['username'].$setValidity('mongoose', true);
              $scope.errors['username'] = 'Username available. ';
              $scope.checkmessage = 'Username available.';
            }
            $scope.checkusername = 0;
          })
          .catch(function(err) {
            err = err.data;
            $scope.errors = {};
            // Update validity of fPorm fields that match the mongoose errors
            angular.forEach(err.errors, function(error, field) {
              form[field].$setValidity('mongoose', false);
              $scope.errors[field] = error.message;
            });
          });

      } else {
        form['username'].$setValidity('mongoose', false);
        $scope.errors['username'] = 'Please fill your alias name';
      }


    };


    $scope.$watch('user.username', function(n, o) {
      if ($scope.user.username) {
        $scope.user.username = $scope.user.username.replace(/\s/g, "");
        $scope.user.username = $scope.user.username.replace("@", "");
      }
      if (n && n.length > 16) {
        $scope.user.username = o;
      }
    });


    $scope.register = function(form) {
      $scope.submitted = true;
      $scope.registerDone = 0;
      if (form.$valid) {
        Auth.createUser({
            lastname: $scope.user.lastname,
            firstname: $scope.user.firstname,
            username: $scope.user.username,
            alias: $scope.user.alias,
            address: $scope.user.address,
            email: $scope.user.email,
            phone: $scope.user.phone,
            roleType: $scope.user.roleType,
            jobtitle: $scope.user.jobtitle,
            // notes: $scope.user.notes,
            companyname: $scope.user.companyname,
            // notes: $scope.user.notes,
            interests: $scope.user.interests,
            // other: $scope.user.other,
            password: $scope.user.password,
            company: $scope.user.company,
            companyaddress: $scope.user.companyaddress,
          })
          .then(function() {
            // Account created, redirect to home
            $scope.emailSent = true;
            $scope.registerDone = 1;
            // $location.path('/login').search({'register': 1});
            $location.path('/notification').search({
              'type': 'register'
            });
          })
          .catch(function(err) {
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
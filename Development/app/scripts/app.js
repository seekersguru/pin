'use strict';

var pinApp=angular.module('pinApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap',
  'chieffancypants.loadingBar',
  'ngTagsInput',
  'ngSocial',
  'angulartics',
  'angulartics.google.analytics',
  'duScroll',
  'angularFileUpload'
]).config(function( $compileProvider ) {
    $compileProvider.imgSrcSanitizationWhitelist(/^\s*(http|https|ftp|file|blob):|data:image\//);
  })
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'partials2/main'
       
      })
      .when('/dashboard', {
        templateUrl: 'partials2/dashboard'
      })
      .when('/chart', {
        templateUrl: 'partials2/chart'
      })
      .when('/connect', {
        templateUrl: 'partials2/connect'
      })
      .when('/content-id', {
        templateUrl: 'partials2/content-id'
      })
      .when('/login', {
        templateUrl: 'partials2/login'
      })
      .when('/register', {
        templateUrl: 'partials2/register'
      })
      .otherwise({
        redirectTo: '/home'
      });

    $locationProvider.html5Mode(true);

    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      return {
        'responseError': function(response) {
          if(response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          }
          else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  // .run(function ($rootScope, $location, Auth) {
  //   var cartIndex = localStorage.cartIndex;
  //   var currentIndex = 3;
  //   if (!cartIndex || !(parseInt(cartIndex) >= currentIndex)) {
  //     delete localStorage.cart
  //     localStorage.cartIndex = String(currentIndex);
  //   }

  //   // Redirect to login if route requires auth and you're not logged in
  //   $rootScope.$on('$routeChangeStart', function (event, next, current) {

  //     $rootScope.appTitle = 'PaintCollar - Connecting Art with lifeStyle';
  //     if (next.title) {
  //       $rootScope.appTitle = next.title;
  //     }
  //     if ($location.path() !== '/login') {
  //       $rootScope.redirectPath = $location.path();
  //     }
  //     $rootScope.ogTitle = "Paintcollar";
  //     $rootScope.ogDescription = "Paintcollar lets artists soar by turning their art into amazing merchandize. Buy incredible T-shirts, Laptop skins, Posters and more!";
  //     $rootScope.ogImage = "http://i.imgur.com/ZjBS4gJ.jpg";
  //     $rootScope.ogUrl =  "http://"+$location.host()+$location.path();

  //     if (next.authenticate && !Auth.isLoggedIn()) {
  //       $location.path('/login');
  //     }
  //   });
  // })
  .constant('scalingFactor', {tshirt: 12, laptop:6.7478, poster:10.844, canvas: 10.844});

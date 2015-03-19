'use strict';

angular.module('pinApp', [
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
  'angularFileUpload',
  'btford.socket-io',
  'textAngular',
  'com.2fdevs.videogular',
  'com.2fdevs.videogular.plugins.controls',
  'com.2fdevs.videogular.plugins.overlayplay',
  'com.2fdevs.videogular.plugins.poster',
  'ngGrid'
  ])
.value('nickName', 'anonymous')
.config(function( $compileProvider ) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(http|https|ftp|file|blob):|data:image\//);
})
.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'partials2/main'

  })
  .when('/nishant', {
    templateUrl: 'partials2/nishant',
    controller:'NishantCtrl'

  })
  .when('/dashboard', {
    templateUrl: 'partials2/dashboard'
  })
  .when('/chat', {
    templateUrl: 'partials2/chat'
  })
  .when('/chat-start', {
    templateUrl: 'partials2/chat-start',
    controller:'SocketCtrl'
  })
  .when('/chat-listing', {
        templateUrl: 'partials2/chat-listing',
        controller: 'SocketCtrl',
        title: 'Chat Listing'
     })
  .when('/connect', {
    templateUrl: 'partials2/connect'
  })
  .when('/content-id', {
    templateUrl: 'partials2/content-id'
  })
  .when('/login', {
    templateUrl: 'partials2/login',
    controller:'LoginCtrl'
  })
  .when('/register', {
    templateUrl: 'partials2/register',
    controller:'RegisterCtrl'
  })
  .when('/video', {
    templateUrl: 'partials2/video'
  })
  .when('/who-is-this-site-for', {
    templateUrl: 'partials2/who.html'
  })
  .when('/what-we-do', {
    templateUrl: 'partials2/what.html'
  }) 
 .when('/who-we-are', {
    templateUrl: 'partials2/about.html'
  })
  .when('/articles/:pageno', {
    templateUrl: 'partials2/articles',
    controller:'ArticleCtrl',
    resolve:{
      articles: ['$q', '$route', 'Article', function($q, $route, article) {
      var deferred = $q.defer();
      var query = angular.copy($route.current.params);
      query.limit=25;
      article.get(query, function(articles) {
        deferred.resolve(articles.articles);
      },
      function(err){
        deferred.reject();
      });
      return deferred.promise;
    }]

  }
})
  .when('/post-article', {
    templateUrl: 'partials2/post-article',
    controller:'ArticleAddCtrl'

  })  
  .when('/articles/view/:articleid', {
    templateUrl: 'partials2/article-detail',
    controller:'ArticleCtrl',
    resolve:{
      articles: ['$q', '$route', 'Article', function($q, $route, Article) {
            var deferred = $q.defer();
            Article.get({articleId: $route.current.params.articleid}, function(article) {
              deferred.resolve(article);
            },
            function(err){
              deferred.reject();
            });
            return deferred.promise;
          }]

  }
})
  .when('/articles/edit/:id', {
    templateUrl: 'partials2/update-article',
    controller:'ArticleViewEditCtrl',
    resolve: {
          article: ['$q', '$route', 'Article', function($q, $route, Article) {
            var deferred = $q.defer();
            Article.get({articleId: $route.current.params.id}, function(article) {
              article.author = article.author._id;
              deferred.resolve(article);
            },
            function(err){
              deferred.reject();
            });
            return deferred.promise;
          }]
        }
  })
  .when('/myarticles/:pageno', {
    templateUrl: 'partials2/myarticle',
    controller:'ArticleCtrl',
    resolve:{
      articles: ['$q', '$route', 'Article','$rootScope', function($q, $route, article,$rootScope) {
      var deferred = $q.defer();
      var query = angular.copy($route.current.params);
      query.limit=25;
      query.author=$rootScope.user;
      article.get(query, function(articles) {
        deferred.resolve(articles.articles);
      },
      function(err){
        deferred.reject();
      });
      return deferred.promise;
    }]

  }
})
 .when('/admin', {
        templateUrl: 'partials2/admin/adminpanel',
        controller: 'AdminPanelCtrl',
        title: 'Admin Panel'
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

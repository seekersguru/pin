'use strict';

function adjust_window_code() {

  if ($("footer").length) {

    var append_footer = $("footer").html();
    if (append_footer) {
      alert(append_footer);
      $("footer").html("");
      $("#container_div").html(append_footer + $("#container_div").html());
      alert(1);
    }
  }
}

function adjust_window() {
  adjust_window_code();

  setTimeout(function() {
    adjust_window_code();
  }, 100);

  setTimeout(function() {
    adjust_window_code();
  }, 3000);

}

angular.module('pinApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'chieffancypants.loadingBar',
    'ngTagsInput',
    'ngSocial',
    // 'angulartics',
    // 'angulartics.google.analytics',
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
  .config(function($compileProvider) {
    $compileProvider.imgSrcSanitizationWhitelist(
      /^\s*(http|https|ftp|file|blob):|data:image\//);
  })
  .config(['$tooltipProvider', function($tooltipProvider) {
    $tooltipProvider.setTriggers({
      'mouseenter': 'mouseleave',
      'click': 'click',
      'focus': 'blur',
      'never': 'mouseleave' // <- This ensures the tooltip will go away on mouseleave
    });
  }])

.config(function($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'partials2/articles',
        controller: 'ArticleCtrl',
        resolve: {
          articles: ['$q', '$route', 'Article', function($q, $route,
            article) {
            var deferred = $q.defer();
            var query = angular.copy($route.current.params);
            query.limit = 10;
            query.pageno=1;
            article.get(query, function(articles) {
                deferred.resolve(articles);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]
        }
      })
      .when('/', {
        templateUrl: 'partials2/articles',
        controller: 'ArticleCtrl',
        resolve: {
          articles: ['$q', '$route', 'Article', function($q, $route,
            article) {
            var deferred = $q.defer();
            var query = angular.copy($route.current.params);
            query.limit = 10;
            query.pageno=1;
            article.get(query, function(articles) {
                deferred.resolve(articles);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]
        }
      })
      .when('/nishant', {
        templateUrl: 'partials2/nishant',
        controller: 'NishantCtrl'

      })
      .when('/dashboard', {
        templateUrl: 'partials2/dashboard'
      })
      .when('/chat', {
        templateUrl: 'partials2/chat'
      })
      .when('/chat-start', {
        templateUrl: 'partials2/chat-start',
        controller: 'SocketCtrl',
        authenticate: true
      })
      .when('/discussion-start', {
        templateUrl: 'partials2/discussion-start',
        controller: 'SocketCtrl',
        authenticate: true
      })
      .when('/discussion-detail', {
        templateUrl: 'partials2/chat-detail',
        controller: 'SocketCtrl',
        authenticate: true
      })
      .when('/discussion-listing', {
        templateUrl: 'partials2/chat-listing',
        controller: 'SocketCtrl',
        title: 'Chat Listing',
        authenticate: true
      })
      .when('/connect', {
        templateUrl: 'partials2/connect',
        controller: 'ConnectCtrl',
        title: 'Connect Friends',
        authenticate: true
      })
      .when('/content-id', {
        templateUrl: 'partials2/content-id'
      })
      .when('/login', {
        templateUrl: 'partials2/login',
        controller: 'LoginCtrl',
        authenticate: false
      })
      .when('/register', {
        templateUrl: 'partials2/register',
        controller: 'RegisterCtrl',
        authenticate: false

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
      .when('/terms', {
        templateUrl: 'partials2/terms.html'
      })
      .when('/contact-us', {
        templateUrl: 'partials2/contact-us.html'
      })
      .when('/privacy', {
        templateUrl: 'partials2/privacy.html'
      })
      .when('/articles/:pageno', {
        templateUrl: 'partials2/articles',
        controller: 'ArticleCtrl',
        resolve: {
          articles: ['$q', '$route', 'Article', function($q, $route,
            article) {
            var deferred = $q.defer();
            var query = angular.copy($route.current.params);
            query.limit = 10;
            query.pageno=1;
            article.get(query, function(articles) {
                deferred.resolve(articles);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]

        },
      })
      .when('/articles/search/:search', {
        templateUrl: 'partials2/article-search',
        controller: 'ArticleSearchCtrl',
      })
      .when('/post-article', {
        templateUrl: 'partials2/post-article',
        controller: 'ArticleAddCtrl',
        authenticate: true

      })
      .when('/share', {
        templateUrl: 'partials2/share',
        controller: 'ArticleAddCtrl',
        authenticate: true

      })
      .when('/event', {
        templateUrl: 'partials2/meet',
        controller: 'EventListCtrl',
        resolve: {
          events: ['$q', '$route', 'Event', function($q, $route, events) {
            var deferred = $q.defer();
            var query = {
              pageno: 1,
              limit: 25
            };
            events.get(query, function(articles) {
                deferred.resolve(articles.articles);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]

        }
      })
      .when('/articles/view/:articleid', {
        templateUrl: 'partials2/article-detail',
        controller: 'ArticleCtrl',
        resolve: {
          articles: ['$q', '$route', 'Article', function($q, $route,
            Article) {
            var deferred = $q.defer();
            Article.get({
                articleId: $route.current.params.articleid
              }, function(article) {
                var articles={articles:article}
                deferred.resolve(articles);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]

        },
        // authenticate: true
      })
      .when('/articles/edit/:id', {
        templateUrl: 'partials2/update-article',
        controller: 'ArticleViewEditCtrl',
        resolve: {
          article: ['$q', '$route', 'Article', function($q, $route, Article) {
            var deferred = $q.defer();
            Article.get({
                articleId: $route.current.params.id
              }, function(article) {
                article.author = article.author._id;
                deferred.resolve(article);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]
        },
        authenticate: true
      })
      .when('/myarticles/:pageno', {
        templateUrl: 'partials2/myarticle',
        controller: 'ArticleCtrl',
        resolve: {
          articles: ['$q', '$route', 'Article', '$rootScope', function($q,
            $route, article, $rootScope) {
            var deferred = $q.defer();
            var query = angular.copy($route.current.params);
            query.limit = 25;
            query.author = $rootScope.user;
            article.get(query, function(articles) {
                deferred.resolve(articles.articles);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]

        },
        authenticate: true
      })

    .when('/admin', {
        templateUrl: 'partials2/admin/adminpanel',
        controller: 'AdminPanelCtrl',
        title: 'Admin Panel',
        authenticate: true,
        admin: true
      })
      .when('/upload-company', {
        templateUrl: 'partials2/upload-company',
        controller: 'UploadCompanyCtrl',
        title: 'Upload Companies',
        authenticate: true,
        admin: true
      })

    .when('/upload-users', {
      templateUrl: 'partials2/upload-users',
      controller: 'UploadUsersCtrl',
      title: 'Upload Users',
      authenticate: true,
      admin: true
    })

    .when('/user/:id/recover/:token', {
      templateUrl: 'partials2/recover',
      controller: 'RecoverCtrl',
      title: 'Recover',
      authenticate: false
    })

    .when('/404', {
      templateUrl: 'partials2/404',
      title: 'not Found'
    })

    .when('/notification', {
      templateUrl: 'partials2/notification',
      title: 'Notification'
    })

    .when('/my-notification', {
      templateUrl: 'partials2/my-notification',
      title: 'Notification',
      controller: 'NotificationCtrl',
    })

    .when('/forgot', {
        templateUrl: 'partials2/forgot',
        controller: 'ForgotCtrl',
        title: 'Forgot Password',
        authenticate: false
      })
      .when('/settings', {
        templateUrl: 'partials2/settings',
        // controller: 'SettingsCtrl',
        title: 'Settings'
      })
      .when('/add-event', {
        templateUrl: 'partials2/add-event',
        title: 'Add Event',
        controller: 'EventCtrl',
        authenticate: true,
        admin: true
      })
      .when('/add-expert', {
        templateUrl: 'partials2/add-expert',
        title: 'Add Expert',
        controller: 'ExpertCtrl',
        authenticate: true,
        admin: true
      })
      .when('/expert/edit/:id', {
        templateUrl: 'partials2/edit-expert',
        title: 'Add Expert',
        controller: 'ExpertEditViewCtrl',
        authenticate: true,
        admin: true,
        resolve: {
          expert: ['$q', '$route', 'Expert', function($q, $route, Expert) {
            var deferred = $q.defer();
            Expert.get({
                expertId: $route.current.params.id
              }, function(expert) {
                deferred.resolve(expert);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]
        },
      })
      .when('/event/view/:eventid', {
        templateUrl: 'partials2/artical-details-meet',
        controller: 'EventViewCtrl',
        title: 'Meet Event',
        resolve: {
          events: ['$q', '$route', 'Event', function($q, $route, Event) {
            var deferred = $q.defer();
            Event.get({
                articleId: $route.current.params.eventid
              }, function(event) {
                deferred.resolve(event);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]

        },
      })
      .when('/event/edit/:eventid', {
        templateUrl: 'partials2/edit-event',
        controller: 'EventEditCtrl',
        title: 'Edit Event',
        resolve: {
          events: ['$q', '$route', 'Event', function($q, $route, Event) {
            var deferred = $q.defer();
            Event.get({
                articleId: $route.current.params.eventid
              }, function(event) {
                deferred.resolve(event);
              },
              function(err) {
                deferred.reject();
              });
            return deferred.promise;
          }]
        },
      })

    .when('/companies', {
      templateUrl: 'partials2/company-listing',
      title: 'Company Listing',
      controller: 'CompanyCtrl',
      resolve: {
        companys: ['$q', '$route', 'Company', function($q, $route,
          Company) {
          var deferred = $q.defer();
          Company.get(function(company) {
              deferred.resolve(company);
            },
            function(err) {
              deferred.reject();
            });
          return deferred.promise;
        }]
      },
    })

    .when('/add-company', {
      templateUrl: 'partials2/add-company',
      title: 'Add Company',
      controller: 'CompanyAddCtrl',
      authenticate: true,
      admin: true
    })

    .when('/company/edit/:companyid', {
      templateUrl: 'partials2/edit-company',
      title: 'Edit Company',
      controller: 'CompanyEditViewCtrl',
      authenticate: true,
      admin: true,
      resolve: {
        company: ['$q', '$route', 'Company', function($q, $route, Company) {
          var deferred = $q.defer();
          Company.get({
              companyId: $route.current.params.companyid
            }, function(company) {
              deferred.resolve(company);
            },
            function(err) {
              deferred.reject();
            });
          return deferred.promise;
        }]
      },
    })

    .when('/company/view/:companyid', {
      templateUrl: 'partials2/company-details',
      controller: 'CompanyEditViewCtrl',
      title: 'View Company',
      resolve: {
        company: ['$q', '$route', 'Company', function($q, $route, Company) {
          var deferred = $q.defer();
          Company.get({
              companyId: $route.current.params.companyid
            }, function(event) {
              deferred.resolve(event);
            },
            function(err) {
              deferred.reject();
            });
          return deferred.promise;
        }]

      },
    })

    .otherwise({
      redirectTo: '/404'
    });

    $locationProvider.html5Mode(true);
    // Intercept 401s and redirect you to login
    $httpProvider.interceptors.push(['$q', '$location', function($q,
      $location) {
      return {
        'responseError': function(response) {
          if (response.status === 401) {
            $location.path('/login');
            return $q.reject(response);
          } else {
            return $q.reject(response);
          }
        }
      };
    }]);
  })
  .run(function($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {

      $rootScope.appTitle = 'Connecting Indian money industry';
      if (next.title) {
        $rootScope.appTitle = next.title;
      }
      if ($location.path() !== '/login') {
        $rootScope.redirectPath = $location.path();
      }

      $rootScope.ogTitle = "PIN";
      $rootScope.ogDescription = "PIN Description";
      $rootScope.ogImage = "";
      $rootScope.ogUrl = "http://" + $location.host() + $location.path();

      if (next.authenticate == false && Auth.isLoggedIn()) {
        $location.path('/articles/01');
      }

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }


      if (next.admin && !Auth.isAdmin()) {
        $location.path('/home');
      }
    });

    $rootScope.$on('$routeChangeSuccess', function() {});

  });

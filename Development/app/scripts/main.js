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

.config(['$routeProvider','$locationProvider','$httpProvider',function($routeProvider, $locationProvider, $httpProvider) {
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
            articles: ['$q', '$route', 'Article','$http','$rootScope', function($q, $route,
            Article,$http,$rootScope) {
            var deferred = $q.defer();
            $http.get('/api/articles/url/'+$route.current.params.articleid)
            .success(function(article) {
               var articles={articles:article};
               $rootScope.ogTitle = articles.title; 
               deferred.resolve(articles);
            }).error(deferred.reject);

            // Article.get({
            //     articleId: $route.current.params.articleid
            //   }, function(article) {
            //     var articles={articles:article}
            //     deferred.resolve(articles);
            //   },
            //   function(err) {
            //     deferred.reject();
            //   });
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
      controller: 'UploadNewUsersCtrl',
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
.when('/unsubscribe', {
      templateUrl: 'partials2/notification',
      title: 'Notification',
      controller:'NotificationCtrl'
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
          events: ['$q', '$route', 'Event','$http','$rootScope',function($q, $route, Event,$http,$rootScope) {
            var deferred = $q.defer();
            $http.get('/api/events/url/'+$route.current.params.eventid)
            .success(function(article) {
               var articles={articles:article};
               $rootScope.ogTitle = articles.title; 
               deferred.resolve(articles);
            }).error(deferred.reject);
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
  }])
  .run(['$rootScope','$location','Auth',function($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function(event, next, current) {

      $rootScope.appTitle = 'Connecting Indian money industry';
      if (next.title) {
        $rootScope.appTitle = next.title;
      }
      if ($location.path() !== '/login') {
        $rootScope.redirectPath = $location.path();
      }

      $rootScope.ogTitle = 'Connecting Indian family offices';
      $rootScope.ogDescription = 'Networking and content to grow and protect wealth for Indian family offices and UHNI families, edited by Hansi Mehrotra, #LinkedInTopVoices';
      $rootScope.ogImage = '';
      $rootScope.ogUrl = 'http://' + $location.host() + $location.path();

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

  }]);

'use strict';

function ngGridFlexibleHeightPlugin (opts) {
  var self = this;
  self.grid = null;
  self.scope = null;
  self.init = function (scope, grid, services) {
    self.domUtilityService = services.DomUtilityService;
    self.grid = grid;
    self.scope = scope;
    var recalcHeightForData = function () { setTimeout(innerRecalcForData, 1); };
    var innerRecalcForData = function () {
      var gridId = self.grid.gridId;
      var footerPanelSel = '.' + gridId + ' .ngFooterPanel';
      var extraHeight = self.grid.$topPanel.height() + $(footerPanelSel).height();
      var naturalHeight = self.grid.$canvas.height() + 1;
      if (opts != null) {
        if (opts.minHeight != null && (naturalHeight + extraHeight) < opts.minHeight) {
          naturalHeight = opts.minHeight - extraHeight - 2;
        }
      }

      var newViewportHeight = naturalHeight + 3;
      if (!self.scope.baseViewportHeight || self.scope.baseViewportHeight !== newViewportHeight) {
        self.grid.$viewport.css('height', newViewportHeight +25+ 'px');
        self.grid.$root.css('height', (newViewportHeight + extraHeight) + 'px');
        self.scope.baseViewportHeight = newViewportHeight;
        self.domUtilityService.RebuildGrid(self.scope, self.grid);
      }
    };
    self.scope.catHashKeys = function () {
      var hash = '',
      idx;
      for (idx in self.scope.renderedRows) {
        hash += self.scope.renderedRows[idx].$$hashKey;
      }
      return hash;
    };
    self.scope.$watch('catHashKeys()', innerRecalcForData);
    self.scope.$watch(self.grid.config.data, recalcHeightForData);
  };
}

angular.module('pinApp')
.controller('AdminPanelCtrl', function($scope, User,Article,$http, $location, $window ,$modal, Auth, $timeout) {

$scope.viewArticle=function(articleId){
  window.open('/articles/view/'+articleId,'_blank');
};

$scope.editArticle=function(articleId){
  window.open('/articles/edit/'+articleId,'_blank');
};

$scope.addFamily=function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'familymodal.html',
      controller: 'FamilyCtrl',
      size: size
      
  });
};



$scope.updateBand=function(data,band){
   data.band=band;
   console.log(data);
   $http({ method: 'PUT', url: '/api/users/'+data._id,data:{'band':band}}).
      success(function (data, status, headers, config) {
            
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });
};

$scope.updateFamily=function(data,name){
   data.name=name;
   console.log(data);
   $http({ method: 'PUT', url: '/api/family/'+data._id,data:{'name':name}}).
      success(function (data, status, headers, config) {
            
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });
};

$scope.updateExpert=function(data,name){
   data.name=name;
   console.log(data);
   $http({ method: 'PUT', url: '/api/expert/'+data._id,data:{'name':name}}).
      success(function (data, status, headers, config) {
            
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });
};

$scope.userStatus=function(userId){
      var removeIndex = $scope.gridUserData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(userId);

  var setStatus= !$scope.gridUserData[removeIndex].status,
  messageline="";
  var popup=1;
  if(setStatus)
   {
    messageline="You are approving "+$scope.gridUserData[removeIndex].name+" a mail notification will be sent to  mail id "+$scope.gridUserData[removeIndex].email;
   }
  else
   {
    messageline="You are blocking "+$scope.gridUserData[removeIndex].name+" , email notification will be sent to him that , some problem in your account please contact admin";
    popup=0;
   }

  var yes=confirm(messageline);
  if(yes)
  {
      if(popup)
      {
        var modalInstance = $modal.open({
            templateUrl: 'familyoffice.html',
            controller: 'AssignRoleCtrl',
            resolve: {
                searchable: function () {
                    return $scope.gridUserData[removeIndex].searchable;
                },
                adminrole: function () {
                    return $scope.gridUserData[removeIndex].adminrole;
                },
                familyrole: function () {
                    return $scope.gridUserData[removeIndex].familyrole;
                },
                userid: function () {
                    return userId;
                },
                removeIndex: function () {
                    return removeIndex;
                },
                commentvisible: function () {
                    return $scope.gridUserData[removeIndex].commentvisible;
                },
                roletype: function () {
                    return $scope.gridUserData[removeIndex].company['roletype'];
                }
              }
        });

      }else{
        
        $http({ method: 'PUT', url: '/api/users/status/'+userId,data:{'status':setStatus}}).
            success(function (data, status, headers, config) {
               $scope.gridUserData[removeIndex].status=setStatus;   
            }).
            error(function (data, status, headers, config) {
              // ...
              // $scope.article={};
            });
      }   
  }
  else{

  }

};
$scope.articleStatus=function(articleId){
      var removeIndex = $scope.gridArticleData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(articleId);

  var setStatus= !$scope.gridArticleData[removeIndex].approve;
  $http({ method: 'PUT', url: '/api/articles/'+articleId,data:{'public':setStatus}}).
      success(function (data, status, headers, config) {
         $scope.gridArticleData[removeIndex].approve=setStatus;   
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });

};

$scope.eventStatus=function(eventId){
      var removeIndex = $scope.gridEventData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(eventId);

  var setStatus= !$scope.gridEventData[removeIndex].approve;
  $http({ method: 'PUT', url: '/api/events/'+eventId,data:{'public':setStatus}}).
      success(function (data, status, headers, config) {
         $scope.gridEventData[removeIndex].approve=setStatus;   
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });

};

$scope.companyStatus=function(eventId){
      var removeIndex = $scope.gridCompanyData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(eventId);

  var setStatus= !$scope.gridCompanyData[removeIndex].approve;
  $http({ method: 'PUT', url: '/api/companys/'+eventId,data:{'public':setStatus}}).
      success(function (data, status, headers, config) {
         $scope.gridCompanyData[removeIndex].approve=setStatus;   
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });

};

$scope.deleteCompany=function(articleId){
  var yes=confirm('Are you sure you want to delete this Company?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/companys/'+articleId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridCompanyData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(articleId);

      $scope.gridCompanyData.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

 };

$scope.deleteArticle=function(articleId){
  var yes=confirm('Are you sure you want to delete this Article?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/articles/'+articleId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridArticleData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(articleId);

      $scope.gridArticleData.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

 };


$scope.deleteFamily=function(familyId){
  var yes=confirm('Are you sure you want to delete this Family Name ?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/family/'+familyId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridFamilyData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(familyId);

      $scope.gridFamilyData.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

 };

$scope.deleteExpert=function(expertId){
  var yes=confirm('Are you sure you want to delete this Expert ?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/expert/'+expertId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridExpertData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(expertId);

      $scope.gridExpertData.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

 };

 $scope.deleteEvent=function(expertId){
  var yes=confirm('Are you sure you want to delete this Event ?');
  if(yes)
  {
    $http({
      method:'DELETE',
      url:'/api/events/'+expertId
    }).
    success(function (data,status,headers,config){
      var removeIndex = $scope.gridEventData
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(expertId);

      $scope.gridEventData.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

 };

 

 $scope.setSearch = function(search){
  $location.search(search);

  };

  $timeout(function() {
    $scope.mainPage = Object.keys($location.search())[0] || 'users';
    switch($scope.mainPage)
    {
      case 'users':
      $scope.gridUserData={};
      User.query(function(users){
        $scope.gridUserData=users.users;
      });
      break;

      case 'articles':
      $scope.gridArticleData={};
        $http({ method: 'GET', url: 'api/articles/basic' }).
          success(function (data, status, headers, config) {
             $scope.gridArticleData=data.articles;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;

     case 'family':
      $scope.gridFamilyData={};
        $http({ method: 'GET', url: 'api/family' }).
          success(function (data, status, headers, config) {
             $scope.gridFamilyData=data.familys;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;
     case 'expert':
      $scope.gridFamilyData={};
        $http({ method: 'GET', url: 'api/expert' }).
          success(function (data, status, headers, config) {
             $scope.gridExpertData=data.experts;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;

    case 'event':
      $scope.gridFamilyData={};
        $http({ method: 'GET', url: 'api/events/basic' }).
          success(function (data, status, headers, config) {
             $scope.gridEventData=data.articles;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;

  case 'company':
      $scope.gridFamilyData={};
        $http({ method: 'GET', url: 'api/companys/basic' }).
          success(function (data, status, headers, config) {
             $scope.gridCompanyData=data.company;
             
          }).
        error(function (data, status, headers, config) {

        });

       break;

      default: 
      break;
    }
  }, 0);

  $scope.filterOptions = {
    filterText: '',
    filterColumn: ''    };


  var editDeleteArticleTemplate = '<a ng-click="deleteArticle(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/articles/view/{{row.entity._id}}"  id="view"  class="btn btn-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/articles/edit/{{row.entity._id}}"  id="view"  class="btn btn-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

  $scope.articleData = { data: 'gridArticleData' ,
                        enableCellSelection: true,
                        enableRowSelection: false,
                         filterOptions: $scope.filterOptions,

                        // showGroupPanel: true ,
                        columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'title' ,displayName:'Title' },
                                    { field: 'author' ,displayName:'Author' },
                                    // { field: 'tags' ,displayName:'Tags' },
                                    { field: 'comments' ,displayName:'Comments' },
                                    { field: 'category' ,displayName:'Category' },
                                    { field: 'createdAt' ,displayName:'Created Date',cellTemplate:'<span> {{row.entity.createdAt|date:"dd-MMMM-yyyy"}}</span>' },
                                    { field: 'approve' ,displayName:'Approve',cellTemplate:'<span ng-if="row.entity.approve" class="label label-success" ng-click="articleStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="articleStatus(row.entity._id)">NOT APPROVED</span>'},
                                    { field: '',displayName:'Action', cellTemplate: editDeleteArticleTemplate, maxWidth: 100  }],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

  $scope.userData = { data: 'gridUserData' ,
                        // showGroupPanel: true ,
                         // enableCellSelection: true,
                         enableRowSelection: false,
                         filterOptions: $scope.filterOptions,
                         columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'firstname' ,displayName:'First Name' },
                                    { field: 'createdAt' ,displayName:'Created Date',cellTemplate:'<span> {{row.entity.createdAt|date:"dd-MMMM-yyyy"}}</span>' },
                                    { field: 'email' ,displayName:'Email' },
                                    // { field: 'band' ,displayName:'Band',cellTemplate : '<span ng-show="!row.entity.status" >{{ row.entity.band }}</span><span ng-show="row.entity.status"><input  type="text" ng-model="row.entity.band" ng-blur="updateBand(row.entity,row.entity.band)" ng-value="row.entity.band" /></span>'}, 
                                    { field: 'role' ,displayName:'Role'},
                                    { field: 'commentvisible' ,displayName:'Commentvisible'},
                                    { field: 'searchable' ,displayName:'Searchable'},
                                    { field: 'adminrole' ,displayName:'Adminrole'},
                                    { field: 'emailVerification' ,displayName:'EmailVerification',cellTemplate:'<span ng-if="row.entity.emailVerification" class="label label-success">Done</span><span ng-if="!row.entity.emailVerification" class="label label-danger" >Pending</span>' },
                                    { field: 'username' ,displayName:'Username' },
                                    { field: 'status' ,displayName:'Status',cellTemplate:'<span ng-if="row.entity.status" class="label label-success" >APPROVED</span><span ng-if="!row.entity.status" class="label label-danger" >NOT APPROVED</span>'},
                                    { field: 'action' ,displayName:'Action',cellTemplate:'<span ng-if="row.entity.status" class="btn btn-info" ng-click="userStatus(row.entity._id)">Block</span><span ng-if="!row.entity.status" class="btn btn-info" ng-click="userStatus(row.entity._id)">Approve</span> '}],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

  var editDeleteFamilyTemplate = '<a ng-click="deleteFamily(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip">Delete <i class="fa fa-trash-o"></i></a>';


 $scope.familyData = { data: 'gridFamilyData' ,
                        // showGroupPanel: true ,
                         // enableCellSelection: true,
                         enableRowSelection: false,
                         filterOptions: $scope.filterOptions,
                         columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'name' ,displayName:'Name',cellTemplate : '<input  type="text" ng-model="row.entity.name" ng-blur="updateFamily(row.entity,row.entity.name)" ng-value="row.entity.name" />' }],
                                    // { field: '',displayName:'Action', cellTemplate: editDeleteFamilyTemplate, maxWidth: 100  }],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };


  var editDeleteExpertTemplate = '<a ng-click="deleteExpert(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip">Delete <i class="fa fa-trash-o"></i></a><a ng-href="/expert/edit/{{row.entity._id}}"  id="view"  class="btn btn-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';


$scope.expertData = { data: 'gridExpertData' ,
// showGroupPanel: true ,
 // enableCellSelection: true,
 enableRowSelection: false,
 filterOptions: $scope.filterOptions,
 columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
             { field: 'media' ,displayName:'Profile',cellTemplate:'<img style="height:70px;width:70px;"ng-src="{{row.entity.media.path}}">'}, 
            { field: 'name' ,displayName:'Name',cellTemplate : '<input  type="text" ng-model="row.entity.name" ng-blur="updateExpert(row.entity,row.entity.name)" ng-value="row.entity.name" />' },
             { field: 'designation' ,displayName:'Designation'},
             { field: 'mail' ,displayName:'Mail'},
             { field: 'linkedin' ,displayName:'Linkedin'},
            { field: '',displayName:'Action', cellTemplate: editDeleteExpertTemplate, maxWidth: 100  }]
,
showFooter: true,
plugins: [new ngGridFlexibleHeightPlugin()]
};


 var editDeleteEventTemplate = '<a ng-click="deleteEvent(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/event/view/{{row.entity._id}}"  id="view"  class="btn btn-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/event/edit/{{row.entity._id}}"  id="view"  class="btn btn-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

  $scope.eventData = { data: 'gridEventData' ,
                        enableCellSelection: true,
                        enableRowSelection: false,
                         filterOptions: $scope.filterOptions,

                        // showGroupPanel: true ,
                        columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'title' ,displayName:'Title' },
                                    { field: 'author' ,displayName:'Author' },
                                    // { field: 'expert' ,displayName:'Expert' },
                                    // { field: 'comments' ,displayName:'Comments' },
                                    { field: 'category' ,displayName:'Category' },
                                    { field: 'eventdate' ,displayName:'Event Date',cellTemplate:'<span> {{row.entity.eventdate|date:"dd-MMMM-yyyy"}}</span>' },
                                    { field: 'approve' ,displayName:'Approve',cellTemplate:'<span ng-if="row.entity.approve" class="label label-success" ng-click="eventStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="eventStatus(row.entity._id)">NOT APPROVED</span>'},
                                    { field: '',displayName:'Action', cellTemplate: editDeleteEventTemplate, maxWidth: 100  }],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

 var editDeleteCompanyTemplate = '<a ng-click="deleteCompany(row.entity._id)"  id="delete"  class="btn btn-warning" data-toggle="tooltip"><i class="fa fa-trash-o"></i></a><a ng-href="/company/view/{{row.entity._id}}"  id="view"  class="btn btn-success" data-toggle="tooltip"><i class="fa fa-eye"></i></a><a ng-href="/company/edit/{{row.entity._id}}"  id="view"  class="btn btn-info" data-toggle="tooltip"><i class="fa fa-pencil"></i></a>';

  $scope.companyData = { data: 'gridCompanyData' ,
                        enableCellSelection: true,
                        enableRowSelection: false,
                        filterOptions: $scope.filterOptions,

                        // showGroupPanel: true ,
                        columnDefs: [{ field: '_id' ,displayName:'SN',cellTemplate:'<span> {{row.rowIndex+1}}</span>'},
                                    { field: 'title' ,displayName:'Title' },
                                    { field: 'firmsupertype' ,displayName:'SuperType' },
                                    { field: 'firmtype' ,displayName:'Type' },
                                    { field: 'firmsubtype' ,displayName:'Sub Type' },
                                    { field: 'createdAt' ,displayName:'Created Date',cellTemplate:'<span> {{row.entity.createdAt|date:"dd-MMMM-yyyy"}}</span>' },
                                    // { field: 'approve' ,displayName:'Approve',cellTemplate:'<span ng-if="row.entity.approve" class="label label-success" ng-click="companyStatus(row.entity._id)">APPROVED</span><span ng-if="!row.entity.approve" class="label label-danger" ng-click="copmanyStatus(row.entity._id)">NOT APPROVED</span>'},
                                    { field: '',displayName:'Action', cellTemplate: editDeleteCompanyTemplate, maxWidth: 100  }],
                        showFooter: true,
                        plugins: [new ngGridFlexibleHeightPlugin()]
                      };

                       
  

});

angular.module('pinApp')
.controller('FamilyCtrl', function ($scope, $modalInstance,$rootScope,$http,$location,$window,$controller,$route,$templateCache) {

 $.extend(this, $controller('AdminPanelCtrl', {$scope: $scope}));

$scope.family={};
  $scope.saveFamily = function () {
    var familyname=$("#familyname").val();
    if(familyname)
    {      
       var family={name: familyname};  

    $http({ method: 'POST', url: '/api/family/',data:family }).
    success(function (data, status, headers, config) {
          // ...
          
          $modalInstance.close();

          console.log(data);
          
          // $scope.gridFamilyData.push(data.family);
               var currentPageTemplate = $route.current.templateUrl;
                $templateCache.remove(currentPageTemplate);
                $route.reload();

          
          
          
          // $scope.form.$setPristine();
      
        $modalInstance.close();
          
        }).
    error(function (data, status, headers, config) {
      $scope.family={};
      $modalInstance.dismiss('cancel');
    });



    }else{

      alert('please fill family name');
    }

  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
});


angular.module('pinApp')
.controller('AssignRoleCtrl', function ($scope, $modalInstance,$rootScope,$http,$location,$window,$controller,searchable,adminrole,familyrole,userid,removeIndex,commentvisible,roletype,$templateCache,$route) {
  $scope.userupdate={
    familyrole:familyrole,
    searchable:searchable,
    adminrole:adminrole,
    commentvisible:commentvisible,
    roletype:roletype
  };

 $.extend(this, $controller('AdminPanelCtrl', {$scope: $scope}));

 $http({ method: 'GET', url: 'api/family' }).
    success(function (data, status, headers, config) {
       $scope.familys=data.familys;
    }).
 error(function (data, status, headers, config) {

  });


$scope.roletypes=[
    'CEO/business head',
    'Management',
    'Sales/Marketing',
    'Investment/Product',  
    'RM/client facing',
    'Investment Mgmt"',
    'Product Mgmt'
    ];  


  $scope.saveRole = function () {
          $http({ method: 'PUT', url: '/api/users/status/'+userid,data:{'status':1,adminrole:$scope.userupdate.adminrole,familyrole:$scope.userupdate.familyrole,searchable:$scope.userupdate.searchable,commentvisible:$scope.userupdate.commentvisible}}).
            success(function (data, status, headers, config) {
               $modalInstance.close();
               var currentPageTemplate = $route.current.templateUrl;
                $templateCache.remove(currentPageTemplate);
                $route.reload();

            }).
            error(function (data, status, headers, config) {
             $scope.userupdate={};
             $modalInstance.dismiss('cancel');
            });
      };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

});

'use strict';
angular.module('pinApp')
.controller('ArticleCtrl', ['$scope','Auth','$location','Article','$rootScope','$routeParams','$http','articles','$sce','$timeout','$filter',function ($scope,Auth,$location,Article,$rootScope,$routeParams,$http,articles,$sce,$timeout,$filter) {

  $scope.article={};
  $scope.descriptionLimit=80;
  $scope.titleLimit=45;
  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.numberOfPage=25;
  $scope.limit=12;
  $scope.category=['Grow','Protect','Manage','Give'];
  $scope.color={
    'Grow':
    {'caption':'caption',
    'colorclass':'greenbox',
    'image':'green-chat.jpg'
  },
  'Protect':
  {
    'caption':'caption-red',
    'colorclass':'redbox',
    'image':'red-chat.jpg'
  },
  'Manage':
  {
   'caption':'caption-aqua',
   'colorclass':'aquanbox',
    'image':'blue-chat.jpg'
 },
 'Give':
 { 'caption':'caption-pink',
 'colorclass':'pinkbox',
    'image':'purple-chat.jpg'
}
};

$scope.mmicategorysetting={
'Investments':
{
  'main-image':'investment-img.png',
  'icon-img':'investment-icon.jpg',
  'classname':'investment-iocn'
},
'WM/distribution':
{
  'main-image':'welath-img.png',
  'icon-img':'wealth.png',
  'classname':'wealth-iocn'
},
'Communication':
{
  'main-image':'communicationlarge-img.png',
  'icon-img':'cummunaction.png',
  'classname':'communication-iocn'
}
};



$scope.mmicategory=[
   {
    'name':'Investments',
    'sub': [
    {
      'name':'Traditional',
      'tags':['Equities','Fixed Interest','Real Estate', 'Cash','Global']
    },
    {
      'name':'Alternative',
      'tags':['Private Equity', 'Hedge Fund', 'Venture, Angel', 'Real Estate']
    },
    {
      'name':'Portfolios Construction',
      'tags':[]
    },
    {
      'name':'Markets',
      'tags':[]
    }
    ]
    },
  {
    'name':'WM/distribution',
    'sub':[
          {
          'name':'Wealth planning',
          'tags':['Trusts', 'Wills', 'Governance']
          },
          {
            'name':'Business issues',
            'tags':['Strategy', 'marketing', 'sales, operations']
          },
          {
            'name':'Advisory process',
            'tags':['Client onboarding', 'risk profiling','behavioural finance']
          }
        ]
   },
  {
    'name':'Communication',
    'sub': [
      {
      'name':'Investor comms',
      'tags':[]
       }
      ]
  }
  ];
 if(!$routeParams.articleid ){
    $scope.selectcategory=$location.search() && $location.search().mmisubcategory ? $location.search().mmisubcategory:'';
    setTimeout(function(){
      $("#sel1").val($scope.selectcategory);
    },300);
   $scope.$watch('selectcategory',function(newValue,oldvalue) {
    if(!$location.search() || $location.search() && $location.search().mmisubcategory !== newValue){
       $location.path('/home').search({mmisubcategory:newValue});
    }
  });
  }
$scope.articles=articles.articles;
$scope.pageno=articles.current;
$scope.total=articles.total;
if($scope.articles.youtubeurl){
    $scope.articleyoutubeurl = $sce.trustAsResourceUrl($scope.articles.youtubeurl);
}


$scope.loadMore = function(){
$scope.startLoading=true;
  var query={
              limit : $scope.limit,
              pageno: $scope.pageno+1
            };
    Article.get(query, function(articles) {
      $.each(articles.articles,function(i,article){
        article.description = $sce.trustAsHtml($filter('htmlToPlaintext')($filter('limitTo')(article.description, $scope.descriptionLimit)));

        $scope.exceptonearticle.push(article);

      })
      $scope.pageno=articles.current;
      $scope.total=articles.total;
      $scope.startLoading=false;

      // $scope.pageno=
    },
    function(err) {
    });
};

// articles=articles.articles;
$scope.exceptonearticle=angular.copy(articles.articles);
if( Object.prototype.toString.call( $scope.exceptonearticle ) === '[object Array]' ) {
  var removeIndex=0;
     removeIndex = $scope.exceptonearticle
    .map(function(item)
    {
      return item.mmibanner;
    })
    .indexOf(true);

  if(removeIndex <= 0)
   {
      $scope.exceptonearticle.splice(0, 1);
      $scope.bannerArticle=articles.articles[0];

   }
   else
   {
        $scope.mainlist=$scope.exceptonearticle.splice(removeIndex,1);
        $scope.bannerArticle=articles.articles[removeIndex];

   }

}

for(var i = 0; i < $scope.exceptonearticle.length; i++){

    // $scope.exceptonearticle[i].title = $sce.trustAsHtml($filter('limitTo')($scope.exceptonearticle[i].title, $scope.titleLimit));
    $scope.exceptonearticle[i].description = $sce.trustAsHtml($filter('htmlToPlaintext')($filter('limitTo')($scope.exceptonearticle[i].description, $scope.descriptionLimit)));

}

$scope.rightnav="right-nav.html";

setTimeout(function(){
  // $('.post-box').hover(
  //   function(){
  //           $(this).find('.caption, .caption-red, .caption-pink, .caption-aqua').slideDown(250); //.fadeIn(250)
  //         },
  //         function(){
  //           $(this).find('.caption, .caption-red, .caption-pink, .caption-aqua').slideUp(250); //.fadeOut(205)
  //         });

  $(".filterArticle li").find("a").click(function(){

    var filter = $(this).data("filter");
    $("#article-container").find(".article-post").fadeOut(205);
    $("#article-container").find(filter).fadeIn(205);

  });
},1000);


$scope.comments=$scope.articles.scomments  || [];
if($location.path()=="/articles/view/"+articles.articles._id && articles.articles.thumblemedia )
{

  $scope.config=
  {
    'sources': [
    {src: $sce.trustAsResourceUrl('http://moneymanagementindia.net//'+articles.articles.media.path), type: 'video/mp4'}
    ],
    'theme': 'bower_components/videogular-themes-default/videogular.css',
    'plugins': {
      'poster': 'http://moneymanagementindia.net//'+articles.articles.thumblemedia.path
    }
  };

}

$scope.getLatest=function(){

  $http({ method: 'GET', url: 'api/articles?limit=5&pageno=01' }).
  success(function (data, status, headers, config) {

    $scope.latestcomments=data.articles;

  }).
  error(function (data, status, headers, config) {

  });

};

// $scope.getLatest();


$scope.deleteComment=function(commentId){

  var yes=confirm('Are you sure you want to delete this Comment?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/comments/'+$scope.articles._id+"/"+commentId
    }).
    success(function (data,status,headers,config){
      $scope.deleteStatus=1;

      var removeIndex = $scope.comments
      .map(function(item)
      {
        return item._id;
      })
      .indexOf(commentId);

      $scope.comments.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

};


$scope.addComment=function(form){

 if(form.$valid)
 {
    var comment={ user: $rootScope.currentUser._id ,username:$rootScope.currentUser.username, post: $scope.article.comment};

    $http({ method: 'POST', url: '/api/comments/'+$scope.articles._id,data:comment }).
    success(function (data, status, headers, config) {
          // ...
          console.log(data);
          comment.posted=new Date();
          comment._id=data.scomments[data.scomments.length-1]._id;

          $scope.comments.push({ user:{ _id: $rootScope.currentUser._id,fullname:$rootScope.currentUser.fullname,following:$rootScope.currentUser.following },username:$rootScope.currentUser.username, post: $scope.article.comment,posted : new Date()});

          $scope.article={};

          // $scope.form.$setPristine();

        }).
    error(function (data, status, headers, config) {
      $scope.article={};
    });
  }

};

$scope.editComment=function(form,commentId,editcomment,key){
if(form.$valid)
 {
  var comment={ post: editcomment,username:$rootScope.currentUser.username,user:$rootScope.currentUser._id};

    $http({ method: 'PUT', url: '/api/comments/'+$scope.articles._id+'/'+commentId,data:comment}).
    success(function (data, status, headers, config) {
          // $scope.form.$setPristine();

          var removeIndex = $scope.comments
          .map(function(item)
          {
            return item._id;
          })
          .indexOf(commentId);

          $scope.comments[removeIndex].post= editcomment;
          // $scope.editcomment_id=0;
          // $scope.article={};

        $timeout(function(){

           angular.element("#"+key+"-a").trigger("click");

        },200);

        }).
    error(function (data, status, headers, config) {
      // $scope.article={};
      alert("there is something technical problem please try after some time");
    });
}
};

$scope.numberOfPages = function(){
    // return Math.ceil($scope.articles.length/$scope.pageSize);
  };

  // $scope.$on('$routeUpdate', function(){
  //   $scope.currentPage = parseInt($routeParams.pageno) - 1;
  // });

$scope.changePage = function(){
  $location.path('/articles/'+$scope.currentPage+1);
};

  // if($routeParams.pageno){
  //   if($routeParams.pageno > $scope.numberOfPages()){
  //     $location.search({'page' : $scope.numberOfPages()});
  //   }
  //   else if($routeParams.pageno < 1){
  //     $location.search({'page' : 1});
  //   }
  //   $scope.currentPage = parseInt($routeParams.pageno) - 1;
  // }
  // else{
  //   $scope.changePage();
  // }

  $scope.navigation_control= function(page_no){
    $scope.currentPage = page_no;
    $scope.changePage();
  };

  $scope.checkcommitstatus=function(userid,following){

    if(following)
    {
      var removeIndex = following
      .map(function(item)
      {
        return item.user;
      })
      .indexOf(userid);

      if(removeIndex != -1)
      {
        return following[removeIndex].status;
      }else{
        return  false;
      }

    }
    else
    {

      return 0;
    }


  };

}]);

angular.module('pinApp')
.controller('ArticleSearchCtrl', ['$scope','$http','$sce','$upload','$timeout','$routeParams','$filter',function ($scope,$http,$sce,$upload,$timeout,$routeParams,$filter) {


  $scope.searchterm=$routeParams.search;
  $scope.articleload=0;
  $scope.descriptionLimit=80;


$scope.mmicategorysetting={
'Investments':
{
  'main-image':'investment-img.png',
  'icon-img':'investment-icon.jpg',
  'classname':'investment-iocn'
},

'WM/distribution':
{
  'main-image':'welath-img.png',
  'icon-img':'wealth.png',
  'classname':'wealth-iocn'
},

'Communication':
{
  'main-image':'communicationlarge-img.png',
  'icon-img':'cummunaction.png',
  'classname':'communication-iocn'
}

};

$http({ method: 'GET', url: '/api/articles/search/'+$routeParams.search}).
        success(function (data, status, headers, config) {
          
          $scope.articleload=1;
          $.each(data.articles,function(i,article){
           article.description = $sce.trustAsHtml($filter('htmlToPlaintext')($filter('limitTo')(article.description, $scope.descriptionLimit)));
           });
          $scope.articles=data.articles;
        })
        .error(function (data, status, headers, config) {
        
      });

}]);


angular.module('pinApp')
.controller('ArticleViewEditCtrl', ['$scope','Auth','$location','$rootScope','$routeParams','article','$sce','$http','$upload','$timeout',function ($scope,Auth,$location,$rootScope,$routeParams,article,$sce,$http,$upload,$timeout) {
  $scope.category=['Grow','Protect','Manage','Give'];
  $scope.article=article;

  $scope.article.tags="";
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
$scope.mmicategorysetting={
'Investments':
{
  'main-image':'investment-img.png',
  'icon-img':'investment-icon.jpg'
},

'WM/distribution':
{
  'main-image':'welath-img.png',
  'icon-img':'wealth.png'
},

'Communication':
{
  'main-image':'communicationlarge-img.png',
  'icon-img':'cummunaction.png'
}

};

if($location.path()=="/articles/edit/"+article._id && article.media)
{

  $scope.config=
  {
    'sources': [
    {src: $sce.trustAsResourceUrl('../'+article.media.path), type: 'video/mp4'}
    ],
    'theme': 'bower_components/videogular-themes-default/videogular.css',
    'plugins': {
      'poster': 'http://www.videogular.com/assets/images/videogular.png'
    }
  };

}

$scope.removeMedia=function(){
  var remove=confirm("Are you sure you want to remove this Media");
  if(remove)
  {

    $http({ method: 'PUT', url: '/api/articles/removemedia/'+$scope.article._id}).
      success(function (data, status, headers, config) {
        $scope.article.media="";

      })
      .error(function (data, status, headers, config) {

      alert('There is something technical problem.Please try after some time.');

      });
 };

};

$scope.uploadPic = function(files) {
    $scope.formUpload = true;
    if ($scope.mainFIle[0] !== null) {
      generateThumbAndUpload($scope.mainFIle[0])
    }
  };

  function generateThumbAndUpload(file) {
    $scope.errorMsg = null;
    $scope.generateThumb(file);
    uploadUsing$upload(file);

  }

  function uploadUsing$upload(file) {

    $scope.mainData={
        author:$rootScope.currentUser._id,


    };

    var original=$scope.article.tags;
    // $scope.article.tags=[];
    // for (var t = 0; t < original.length; t++) {
    //   $scope.article.tags[t] = original[t].text;
    // }

    $scope.articleput={

      title:$scope.article.title,
      description:$scope.article.description,
      category:$scope.article.category

    };


    file.upload = $upload.upload({
      url: '/api/articles/'+article._id,
      method: 'PUT',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.articleput,
      file: file
    });

    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response);
        $location.path('/articles/view/'+$scope.article._id);
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
        $location.path('/articles/view/'+$scope.article._id);
      });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }


  $scope.generateThumb = function(file) {
    if (file !== null) {
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              file.dataUrl = e.target.result;
            });
          };
        });
      }
    }
  };

   $scope.setFiles = function(element) {
    $scope.filearticle=1;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      // console.log('files:', element.files);
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;
            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.files = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.files.push(element.files[i]);
      }
      $scope.progressVisible = false;
    });
  };

  //update
  $scope.updateArticle=function(form){
    if(form.$valid)
    {
      $scope.article.author=$rootScope.currentUser._id;
      console.log($scope.article.tags);
      console.log($scope.article);
      // var original=$scope.article.tags;
      // for (var t = 0; t < original.length; t++) {
      //   $scope.article.tags[t] = original[t].text;
      // }
      $scope.articleDone=1;
      $scope.form.$setPristine();
      $http({ method: 'PUT', url: '/api/articles/'+$scope.article._id,data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        $location.path('/articles/view/'+$scope.article._id);
        $scope.updateStatus=1;

      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.article={};
      });
    }
  };

  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

  $scope.remove=function(form){
    var yes=confirm('Are you sure you want to delete this Article?');
    if(yes)
    {
      $http({
        method:"DELETE",
        url:'/api/articles/'+$scope.article._id
      }).
      success(function (data,status,headers,config){
        $scope.form.$setPristine();
        $scope.deleteStatus=1;
      })
      .error(function (data,status,headers,config){

      });
    }
  };
}]);

angular.module('pinApp')
.controller('ArticleAddCtrl',['$scope','Auth','$location','$rootScope','$routeParams','$http','$upload','$timeout', function ($scope,Auth,$location,$rootScope,$routeParams,$http,$upload,$timeout) {
  $scope.category=['Grow','Protect','Manage','Give'];

  $scope.article={};
  $scope.preview=0;
  $scope.article.category=$scope.category[0];
  // $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

$scope.template=function(templateno){
$scope.article.title="Set your Title Name";
$scope.article.description="<p>Sed ut perspiciatis unde omnis iste natu error luptatem accusantium. dolorem laudantm, totam reaperiam, eaqu psa aeab illo inventore veriquasi architecto beatae vitae dicta sunt explicabo.</p>"+

"<p>Lorem ipsum dolor it amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco oris nisi ut aliquipommodo consequat.</p>"+

"<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"+

"<b>berspiciatis unde omnis </b>"+

"<p>Iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non Numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>"+

"<b> At vero eos et accusamus</b>"+

"<p>Etusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod “Maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.” Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>"+

"<b>Commodo Consequat</b>"+

"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugia</p>";
$scope.article.tags=['tag1','tag2'];
};
  $scope.uploadPic = function(files) {
    $scope.formUpload = true;
    if ($scope.mainFIle[0] !== null) {
      generateThumbAndUpload($scope.mainFIle[0])
    }
  };

  function generateThumbAndUpload(file) {
    $scope.errorMsg = null;
    $scope.generateThumb(file);
    uploadUsing$upload(file);

  }

  function uploadUsing$upload(file) {

    $scope.article.author= $rootScope.currentUser._id;

    var original=$scope.article.tags;
    // $scope.article.tags=[];
    // for (var t = 0; t < original.length; t++) {
    //   $scope.article.tags[t] = original[t].text;
    // }

    file.upload = $upload.upload({
      url: '/api/articles',
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.article,
      file: file
    });

    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response);
        // $location.path('articles/view/'+response.data.article._id);
        file.result = response.data;
         if($rootScope.currentUser.role == 'admin')
        {

            $location.path('/admin').search({ 'articles':1});

        }
        else{
            $location.path('/notification').search({ 'type':'article'});

        }

        $scope.article={};
        $scope.articleDone=1;
        $scope.articleResponse=response.data;
        $scope.form.$setPristine();
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
      $scope.article={};
       if($rootScope.currentUser.role == 'admin')
        {

            $location.path('/admin').search({ 'articles':1});

        }
        else{
            $location.path('/notification').search({ 'type':'article'});

        }
      $scope.articleDone=1;
      $scope.articleResponse=response.data;
      // $location.path('articles/view/'+response.data.article._id);
      $scope.form.$setPristine();

    });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }


  $scope.generateThumb = function(file) {
    if (file !== null) {
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              file.dataUrl = e.target.result;
            });
          };
        });
      }
    }
  };

  $scope.setFiles = function(element) {
    $scope.filearticle=1;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;

            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.files = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.files.push(element.files[i]);
      }
      $scope.progressVisible = false;
    });
  };

  $scope.saveArticle=function(form){
    //     var str = "abc'sddf khdfkjdf dflkfdlkfd fdkjfdk test#s";
    // alert(str.replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-"));


    if(form.$valid)
    {
      // var formData = new FormData();
      // formData.append("file", $scope.article.file);
      // console.log(formData);

      $scope.article.author=$rootScope.currentUser._id;
       // var original=$scope.article.tags;
       //  $scope.article.tags=[];
       //  for (var t = 0; t < original.length; t++) {
       //    $scope.article.tags[t] = original[t].text;
       //   }
      $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/articles',data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        // console.log(data);
        if($rootScope.currentUser.role == 'admin')
        {

            $location.path('/admin').search({ 'articles':1});

        }
        else{
            $location.path('/notification').search({ 'type':'article'});
        }

        $scope.article={};
        $scope.articleDone=1;
        $scope.articleResponse=data;

      }).
      error(function (data, status, headers, config) {
        // ...
        $scope.article={};
      });
    }

  };

  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

}]);

'use strict';

angular.module('pinApp')
.controller('CompanyCtrl', ['$scope','$rootScope','companys',function ($scope,$rootScope,companys) {

$scope.companys=companys.copmanys;
$scope.search={
  title:'',
  firmtype:''
};
var str = "abcdefghijklmnopqrstuvwxyz";
$scope.alphabet = str.toUpperCase().split("");

$scope.activeLetter = '';
$scope.searchStart=false;


$scope.activateLetter = function(letter) {
  $scope.search.title ='';
  $scope.search.firmtype='';
  $scope.activeLetter = letter;
  $scope.searchStart=true;
}

$scope.setSearchSubType=function(){
  $scope.search.title ='';
  $scope.activeLetter = '';
  $scope.searchStart=true;
}

$scope.setSearchTitle=function(){
  $scope.search.firmtype='';
  $scope.activeLetter = '';
  $scope.searchStart=true;
}

// $scope.setSearchTitle();

$scope.companyStructure={
      'WM':{
          'Multi-family office':[1,2,3,4,5],
          'Private Bank':[1,2,3,4,5],
          'Retail Bank':[1,2,3,4,5],
          'Private Client Firm':[1,2,3,4,5],
          'IFA':[1,2,3,4,5],
          'IFA platform':[1,2,3],
          'Securities firm':[1,2,3,4,5]
      },
      'Foreign portfolio investor':{
          'Consultants':[1,2,3,4,5],
          'FII - pension':[1,2,3,4,5],
          'FII - SWF':[1,2,3,4,5],
          'FII - insurance':[1,2,3,4,5],
          'FII - endowment':[1,2,3,4,5],
          'FII - fund-of-funds':[1,2,3,4,5],
          'Family office':[1,2,3,4,5],
      },
      'Regulator':{
          'Regulator':[1,2,3,4,5]
      },
      'Service provider':{
          'Tax/Accounting':[1,2,3],
          'Legal':[1,2,3],
          'Technology':[1,2,3],
          'Education':[1,2,3],
          'Trust company':[1,2,3],
          'Consulting':[1,2,3],
          'Research/Investment consulting/data provider':[1,2,3],
          'Media':[1,2,3],
          'Philanthropic/NGO':[1,2,3],
          'Securities exchange':[1,2,3],
          'Custody':[1,2,3,4],
          'Recruitment':[1,2,3,4]
      },
      'Product provider':{
          'Asset Management Company':[1,2,3,6,7],
          'Alternative Investment Fund Manager':[1,2,3,6,7],
          'Portfolio Management Service Provider':[1,2,3,6,7],
          'Investment Bank':[1,2,3,6,7],
          'Non-bank financial institution':[1,2,3,6,7],
          'Insurance Company':[1,2,3,4,6,7],

      },
      'Industry':{
        'Association':[1,2,3,4]
      }
};
}]);

angular.module('pinApp')
.controller('EventViewCtrl', ['$scope','$http','$timeout','$compile','$upload','$location','$rootScope','events',function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope,events) {

  $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
  $scope.events=events;
  var addresspickerMap= $( "#addresspicker_map" ).addresspicker({
      regionBias: "in",
      language: "in",
      mapOptions: {
        zoom: events.location.zoom,
        center: new google.maps.LatLng(events.location.lat, events.location.lng),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
       elements: {
        map:      "#map"
      }
    });

    var gmarker = addresspickerMap.addresspicker( "marker");
    gmarker.setVisible(true);
    addresspickerMap.addresspicker( "updatePosition");

    $scope.registerUserInEvent=function(){
      $scope.events.serviceregistered.push($rootScope.currentUser._id);

    var user={ user: $rootScope.currentUser._id};

    $http({ method: 'PUT', url: '/api/events/register/'+events._id,data:user }).
    success(function (data, status, headers, config) {

        }).
    error(function (data, status, headers, config) {
      $scope.article={};
    });
  };



}]);

angular.module('pinApp')
.controller('CompanyEditViewCtrl',['$scope','$http','$timeout','$compile','$upload','$location','$rootScope','company', function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope,company) {

  $scope.article={};
  $scope.article=company;
  $scope.article.addresstimes=[];

  $scope.services=['Wealth management','Investment advisory',  'Investment execution','Wealth planning','Financial planning','Tax','Audit','Legal','IT product','IT consulting','Educational certifications','Educational training','Trade body','Self-regulation','Trust set-up','Trusteeship','Trust administration','Consulting - management/HR','Consulting - investment','Media outlet','Media agent','Media content','Philanthropy advice','Philanthropy execution','Asset management - mutual fund','Asset management - institutional','Asset management - managed account','Asset management - alternatives','Asset management - structured product','Lending/credit','Fiduciary','Regulation setting','Regulation enforcement','Securities exchange','Administration platform','BPO/KPO'];


   // toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(servicename) {
    var idx = $scope.article.services.indexOf(servicename);

    // is currently selected
    if (idx > -1) {
      $scope.article.services.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.article.services.push(servicename);
    }
  };




  $scope.companyStructure={
    'Buy':{
        'WM':{
            'Multi-family office':[1,2,3,4,5],
            'Private Bank':[1,2,3,4,5],
            'Retail Bank':[1,2,3,4,5],
            'Private Client Firm':[1,2,3,4,5],
            'IFA':[1,2,3,4,5],
            'IFA platform':[1,2,3],
            'Securities firm':[1,2,3,4,5]
        },
        'Foreign portfolio investor':{
            'Consultants':[1,2,3,4,5],
            'FII - pension':[1,2,3,4,5],
            'FII - SWF':[1,2,3,4,5],
            'FII - insurance':[1,2,3,4,5],
            'FII - endowment':[1,2,3,4,5],
            'FII - fund-of-funds':[1,2,3,4,5],
            'Family office':[1,2,3,4,5],
        },
        'Regulator':{
            'Regulator':[1,2,3,4,5]
        },
        'Industry':{
          'Association':[1,2,3,4]
        }

    },
    'Sell':{
        'Service provider':{
            'Tax/Accounting':[1,2,3],
            'Legal':[1,2,3],
            'Technology':[1,2,3],
            'Education':[1,2,3],
            'Association':[1,2,3],
            'Trust company':[1,2,3],
            'Consulting':[1,2,3],
            'Research/Investment consulting/data provider':[1,2,3],
            'Media':[1,2,3],
            'Philanthropic/NGO':[1,2,3],
            'Securities exchange':[1,2,3],
            'Custody':[1,2,3,4],
            'Recruitment':[1,2,3,4]
        },
        'Product provider':{
            'Asset Management Company':[1,2,3,6,7],
            'Alternative Investment Fund Manager':[1,2,3,6,7],
            'Portfolio Management Service Provider':[1,2,3,6,7],
            'Investment Bank':[1,2,3,6,7],
            'Non-bank financial institution':[1,2,3,6,7],
            'Insurance Company':[1,2,3,4,6,7],

        },
        'Industry':{
          'Association':[1,2,3,4]
        }
    }
};

  for (var i = 0; i < company.address.length; i++) {

      $scope.article.addresstimes.push('val'+i);
  };


    $scope.removeaddress=function(key)
    {

      $scope.article.addresstimes.splice(key, 1);
      $scope.article.address.splice(key, 1);

    };



     $scope.addAddress=function(){

      $scope.article.address.push({
             street: '',
             city:'',
             state:'',
             country:'',
             pin:'',
             phone:'',
             main: false
          });
      $scope.article.addresstimes.push(new Date());


    };

$scope.setscope=function(){


};



  //update
  $scope.updateArticle=function(form){
    $scope.article_put={
      title:$scope.article.title,
      description:$scope.article.description,
      organization:$scope.article.organization,
      address:$scope.article.address,
      url:$scope.article.url,
      firmsupertype:$scope.article.firmsupertype,
      firmtype:$scope.article.firmtype,
      firmsubtype:$scope.article.firmsubtype,
      services:$scope.article.services,
      notes:$scope.article.notes,
      roletype:$scope.companyStructure[$scope.article.firmsupertype][$scope.article.firmtype][$scope.article.firmsubtype]

      // public:$scope.article.public
    };

    if(form.$valid)
    {
      $http({ method: 'PUT', url: '/api/companys/'+$scope.article._id,data:$scope.article_put }).
      success(function (data, status, headers, config) {
        // ...
        $location.path('/company/view/'+data.company._id);


      }).
      error(function (data, status, headers, config) {
          alert('Oh Oh :(.  There is some technical problem please try after some time .');

      });
    }
  };

  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

  $scope.remove=function(form){
    var yes=confirm('Are you sure you want to delete this Expert?');
    if(yes)
    {
      $http({
        method:"DELETE",
        url:'/api/events/'+$scope.expert._id
      }).
      success(function (data,status,headers,config){
        $scope.form.$setPristine();
        $scope.deleteStatus=1;
      })
      .error(function (data,status,headers,config){

      });
    }
  };

  $scope.changemain=function(passkey){


    angular.forEach($scope.article.address, function(value, key) {
      $scope.article.address[key].main=false;
    });

    $scope.article.address[passkey].main=true;


  };

}]);

angular.module('pinApp')
.controller('CompanyAddCtrl',['$scope','$http','$timeout','$compile','$upload','$location','$rootScope', function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope) {

$scope.article={};
$scope.article.addresstimes=[1];
$scope.article.address=[{
             street: '',
             city:'',
             state:'',
             country:'',
             pin:'',
             phone:'',
             main: false
          }];

$scope.services=['Wealth management','Investment advisory',  'Investment execution','Wealth planning','Financial planning','Tax','Audit','Legal','IT product','IT consulting','Educational certifications','Educational training','Trade body','Self-regulation','Trust set-up','Trusteeship','Trust administration','Consulting - management/HR','Consulting - investment','Media outlet','Media agent','Media content','Philanthropy advice','Philanthropy execution','Asset management - mutual fund','Asset management - institutional','Asset management - managed account','Asset management - alternatives','Asset management - structured product','Lending/credit','Fiduciary','Regulation setting','Regulation enforcement','Securities exchange','Administration platform','BPO/KPO'];

  $scope.article.services=[];

   // toggle selection for a given fruit by name
  $scope.toggleSelection = function toggleSelection(servicename) {
    var idx = $scope.article.services.indexOf(servicename);

    // is currently selected
    if (idx > -1) {
      $scope.article.services.splice(idx, 1);
    }

    // is newly selected
    else {
      $scope.article.services.push(servicename);
    }
  };



$scope.template=function(templateno){$scope.article={};
$scope.article.title="Set your Event Title Name";
$scope.article.description="<p>Sed ut perspiciatis unde omnis iste natu error luptatem accusantium. dolorem laudantm, totam reaperiam, eaqu psa aeab illo inventore veriquasi architecto beatae vitae dicta sunt explicabo.</p>"+

"<p>Lorem ipsum dolor it amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco oris nisi ut aliquipommodo consequat.</p>"+

"<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>"+

"<b>berspiciatis unde omnis </b>"+

"<p>Iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non Numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>"+

"<b> At vero eos et accusamus</b>"+

"<p>Etusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod “Maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.” Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>"+

"<b>Commodo Consequat</b>"+

"<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugia</p>";



};

$scope.companyStructure={
    'Buy':{
        'WM':{
            'Multi-family office':[1,2,3,4,5],
            'Private Bank':[1,2,3,4,5],
            'Retail Bank':[1,2,3,4,5],
            'Private Client Firm':[1,2,3,4,5],
            'IFA':[1,2,3,4,5],
            'IFA platform':[1,2,3],
            'Securities firm':[1,2,3,4,5]
        },
        'Foreign portfolio investor':{
            'Consultants':[1,2,3,4,5],
            'FII - pension':[1,2,3,4,5],
            'FII - SWF':[1,2,3,4,5],
            'FII - insurance':[1,2,3,4,5],
            'FII - endowment':[1,2,3,4,5],
            'FII - fund-of-funds':[1,2,3,4,5],
            'Family office':[1,2,3,4,5],
        },
        'Regulator':{
            'Regulator':[1,2,3,4,5]
        },
        'Industry':{
          'Association':[1,2,3,4]
        }

    },
    'Sell':{
        'Service provider':{
            'Tax/Accounting':[1,2,3],
            'Legal':[1,2,3],
            'Technology':[1,2,3],
            'Education':[1,2,3],
            'Association':[1,2,3],
            'Trust company':[1,2,3],
            'Consulting':[1,2,3],
            'Research/Investment consulting/data provider':[1,2,3],
            'Media':[1,2,3],
            'Philanthropic/NGO':[1,2,3],
            'Securities exchange':[1,2,3],
            'Custody':[1,2,3,4],
            'Recruitment':[1,2,3,4]
        },
        'Product provider':{
            'Asset Management Company':[1,2,3,6,7],
            'Alternative Investment Fund Manager':[1,2,3,6,7],
            'Portfolio Management Service Provider':[1,2,3,6,7],
            'Investment Bank':[1,2,3,6,7],
            'Non-bank financial institution':[1,2,3,6,7],
            'Insurance Company':[1,2,3,4,6,7],

        },
        'Industry':{
          'Association':[1,2,3,4]
        }
    }
};


  $scope.saveArticle=function(form){
    //     var str = "abc'sddf khdfkjdf dflkfdlkfd fdkjfdk test#s";
    // alert(str.replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-"));


    if(form.$valid)
    {
      // var formData = new FormData();
      // formData.append("file", $scope.article.file);
      // console.log(formData);

      $scope.setscope();

      // $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/companys',data:$scope.article }).
      success(function (data, status, headers, config) {

        // console.log(data);

        if($rootScope.currentUser.role == 'admin')
        {

            $location.path('/company/view/'+data.company._id);

        }


      }).
      error(function (data, status, headers, config) {
        // ...
        $scope.article={};
      });
    }


  };

    $scope.addAddress=function(){

      $scope.article.address.push({
             street: '',
             city:'',
             state:'',
             country:'',
             pin:'',
             phone:'',
             main: false
          });
      $scope.article.addresstimes.push(new Date());


    };

    $scope.removeaddress=function(key)
    {

      $scope.article.addresstimes.splice(key, 1);
      $scope.article.address.splice(key, 1);

    };


$scope.reset=function(form){
    $scope.form.$setPristine();
  };

$scope.setscope=function(){
  $scope.article.author=$rootScope.currentUser._id;
  $scope.article.roletype=$scope.companyStructure[$scope.article.firmsupertype][$scope.article.firmtype][$scope.article.firmsubtype];
  };

  $scope.changemain=function(passkey){


    angular.forEach($scope.article.address, function(value, key) {
      $scope.article.address[key].main=false;
    });

    $scope.article.address[passkey].main=true;


  };


}]);

'use strict';

angular.module('pinApp')
.controller('ConnectCtrl', ['$scope','$rootScope','$http',function ($scope,$rootScope,$http) {
  $scope.connect={};

  $scope.searchFriends=function(form){
    if(form.$valid)
    {
      $scope.searchactive=0;
      $http({ method: 'GET', url: '/api/users/search/'+$scope.connect.search }).
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
    }

  };

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

}]);

'use strict';

angular.module('pinApp')
  .controller('EventListCtrl', ['$scope','$rootScope','events',function($scope, $rootScope, events) {
    // angular.forEach(events, function(eventname, key) {
    //   var currentdate = new Date();
    //   //
    //   // if (new Date(eventname.eventdate) < new Date(currentdate)) {
    //   //   events.splice(key, 1);
    //   //   console.log(key);
    //   // }
    //
    // });
    $scope.events = events;

  }]);

angular.module('pinApp')
  .controller('EventViewCtrl', ['$scope','$http','$timeout','$compile','$upload','$location','$rootScope','events',function($scope, $http, $timeout, $compile,
    $upload, $location, $rootScope, events) {
    $timeout(function() {

      $('.post-box').hover(
        function() {
          $(this).find(
            '.caption, .caption-red, .caption-pink, .caption-aqua').slideDown(
            250); //.fadeIn(250)
        },
        function() {
          $(this).find(
            '.caption, .caption-red, .caption-pink, .caption-aqua').slideUp(
            250); //.fadeOut(205)
        }
      );
    }, 500);


    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI ==
      null || FileAPI.html5 != false);

    $scope.events = events;


    var addresspickerMap = $("#addresspicker_map").addresspicker({
      regionBias: "in",
      language: "in",
      mapOptions: {
        zoom: events.location.zoom,
        center: new google.maps.LatLng(events.location.lat, events.location
          .lng),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      elements: {
        map: "#map"
      }
    });

    var gmarker = addresspickerMap.addresspicker("marker");
    gmarker.setVisible(true);
    addresspickerMap.addresspicker("updatePosition");

    $scope.registerUserInEvent = function() {
      $scope.events.serviceregistered.push($rootScope.currentUser._id);

      var user = {
        user: $rootScope.currentUser._id
      };

      $http({
        method: 'PUT',
        url: '/api/events/register/' + events._id,
        data: user
      }).
      success(function(data, status, headers, config) {

      }).
      error(function(data, status, headers, config) {
        $scope.article = {};
      });
    };



  }]);

angular.module('pinApp')
  .controller('EventEditCtrl', ['$scope','$http','$timeout','$compile','$upload','$location','$rootScope','events',function($scope, $http, $timeout, $compile,
    $upload, $location, $rootScope, events) {

    $scope.category = ['Grow', 'Protect', 'Manage', 'Give'];
    $scope.article = events;

    $scope.loadExpert = function($query) {
      return $http.get('/api/expert/basic', {
        cache: true
      }).then(function(response) {
        var experts = response.data.experts;
        return experts.filter(function(expert) {
          return expert.name.toLowerCase().indexOf($query.toLowerCase()) !=
            -1;
        });
      });
    };

    $scope.clear = function() {
      $scope.article.eventdate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };



    var addresspickerMap = $("#addresspicker_map").addresspicker({
      regionBias: "in",
      language: "in",
      updateCallback: showCallback,
      mapOptions: {
        zoom: $scope.article.location.zoom,
        center: new google.maps.LatLng($scope.article.location.lat,
          $scope.article.location.lng),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      elements: {
        map: "#map",
        lat: "#lat",
        lng: "#lng",
        street_number: '#street_number',
        route: '#route',
        locality: '#locality',
        sublocality: '#sublocality',
        administrative_area_level_2: '#district',
        administrative_area_level_1: '#state',
        country: '#country',
        postal_code: '#postalcode',
        type: '#type'
      }
    });

    var gmarker = addresspickerMap.addresspicker("marker");
    gmarker.setVisible(true);
    addresspickerMap.addresspicker("updatePosition");

    $('#reverseGeocode').change(function() {
      $("#addresspicker_map").addresspicker("option", "reverseGeocode", (
        $(this).val() === 'true'));
    });

    function showCallback(geocodeResult, parsedGeocodeResult) {
      $('#callback_result').text(JSON.stringify(parsedGeocodeResult, null, 4));
    }
    // Update zoom field
    var map = $("#addresspicker_map").addresspicker("map");
    google.maps.event.addListener(map, 'idle', function() {
      $('#zoom').val(map.getZoom());
    });
    $scope.setscopeval = function() {
      $('#locality').val($scope.article.location.locality);
      $('#sublocality').val($scope.article.location.sublocality);
      $('#district').val($scope.article.location.district);
      $('#state').val($scope.article.location.state);
      $('#country').val($scope.article.location.country);
      $('#postalcode').val($scope.article.location.postalcode);
      $('#lat').val($scope.article.location.lat);
      $('#lng').val($scope.article.location.lng);
      $('#zoom').val($scope.article.location.zoom);

    };
    $scope.setscopeval();

    $scope.setscope = function() {

      var original = $scope.article.expert;
      $scope.article_put.expert = [];
      for (var t = 0; t < original.length; t++) {
        $scope.article_put.expert[t] = {
          name: original[t].name,
          user: original[t]._id,
          flag: original[t].flag,
          designation: original[t].designation
        };
      }


      $scope.article_put.location.locality = $('#locality').val();
      $scope.article_put.location.sublocality = $('#sublocality').val();
      $scope.article_put.location.district = $('#district').val();
      $scope.article_put.location.state = $('#state').val();
      $scope.article_put.location.country = $('#country').val();
      $scope.article_put.location.postalcode = $('#postalcode').val();
      $scope.article_put.location.lat = $('#lat').val();
      $scope.article_put.location.lng = $('#lng').val();
      $scope.article_put.location.zoom = $('#zoom').val();
    };


    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI ==
      null || FileAPI.html5 != false);

    $scope.removeMedia = function() {
      var remove = confirm(
        "Are you sure you want to remove Event Banner Image");
      if (remove) {

        $http({
          method: 'PUT',
          url: '/api/events/removemedia/' + $scope.article._id
        }).
        success(function(data, status, headers, config) {
            $scope.article.media = "";

          })
          .error(function(data, status, headers, config) {

            alert(
              'There is something technical problem.Please try after some time.'
            );

          });
      }

    };
    $scope.uploadPic = function(files) {
      $scope.formUpload = true;
      if ($scope.mainFIle[0] !== null) {
        generateThumbAndUpload($scope.mainFIle[0])
      }
    };

    function generateThumbAndUpload(file) {
      $scope.errorMsg = null;
      $scope.generateThumb(file);
      uploadUsing$upload(file);

    }

    function uploadUsing$upload(file) {
      $scope.article_put = {
        title: $scope.article.title,
        agenda: $scope.article.agenda,
        bannertext: $scope.article.bannertext,
        category: $scope.article.category,
        location: {
          address: $scope.article.location.address
        },
        eventdate: $scope.article.eventdate

      };

      $scope.setscope();

      file.upload = $upload.upload({
        url: '/api/events/' + events._id,
        method: 'PUT',
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        data: $scope.article_put,
        file: file
      });

      file.upload.then(function(response) {
        $timeout(function() {
          console.log(response);
          $location.path('/event/view/' + response.data.article._id);
        });
      }, function(response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
        $location.path('/event/view/' + response.data.article._id);
      });

      file.upload.progress(function(evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      file.upload.xhr(function(xhr) {
        // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
      });
    }


    $scope.generateThumb = function(file) {
      if (file !== null) {
        if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 ||
            file.type.indexOf('video') > -1)) {
          $timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
              $timeout(function() {
                file.dataUrl = e.target.result;
              });
            };
          });
        }
      }
    };

    $scope.setFiles = function(element) {
      $scope.filearticle = 1;
      var file = element.files[0];
      $scope.$apply(function($scope) {
        // console.log('files:', element.files);
        if ($scope.fileReaderSupported && (file.type.indexOf('image') >
            -1 || file.type.indexOf('video') > -1)) {
          $timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
              $timeout(function() {
                element.files[0].dataUrl = e.target.result;
                $scope.mainFIle = element.files;
              });
            };
          });
        }
        // Turn the FileList object into an Array
        $scope.files = [];
        for (var i = 0; i < element.files.length; i++) {
          $scope.files.push(element.files[i]);
        }
        $scope.progressVisible = false;
      });
    };

    //update
    $scope.updateArticle = function(form) {
      $scope.article_put = {
        title: $scope.article.title,
        agenda: $scope.article.agenda,
        bannertext: $scope.article.bannertext,
        category: $scope.article.category,
        location: {
          address: $scope.article.location.address
        },
        eventdate: $scope.article.eventdate
      };
      $scope.setscope();
      if (form.$valid) {
        $http({
          method: 'PUT',
          url: '/api/events/' + $scope.article._id,
          data: $scope.article_put
        }).
        success(function(data, status, headers, config) {
          // ...
          $location.path('/event/view/' + data.article._id);


        }).
        error(function(data, status, headers, config) {
          alert(
            'Oh Oh :(.  There is some technical problem please try after some time .'
          );

        });
      }
    };

    $scope.reset = function(form) {
      $scope.form.$setPristine();
    };

    $scope.remove = function(form) {
      var yes = confirm('Are you sure you want to delete this Expert?');
      if (yes) {
        $http({
          method: "DELETE",
          url: '/api/events/' + $scope.expert._id
        }).
        success(function(data, status, headers, config) {
            $scope.form.$setPristine();
            $scope.deleteStatus = 1;
          })
          .error(function(data, status, headers, config) {

          });
      }
    };

  }]);

angular.module('pinApp')
  .controller('EventCtrl', ['$scope','$http','$timeout','$compile','$upload','$location','$rootScope',function($scope, $http, $timeout, $compile, $upload,
    $location, $rootScope) {


    $scope.category = ['Grow', 'Protect', 'Manage', 'Give'];
    $scope.article = {
      location: {}
    };

    $scope.article.category = $scope.category[0];
    $scope.article.expert = [];

    $scope.template = function(templateno) {
      $scope.article.title = "Set your Event Title Name";
      $scope.article.agenda =
        "<p>Sed ut perspiciatis unde omnis iste natu error luptatem accusantium. dolorem laudantm, totam reaperiam, eaqu psa aeab illo inventore veriquasi architecto beatae vitae dicta sunt explicabo.</p>" +

        "<p>Lorem ipsum dolor it amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco oris nisi ut aliquipommodo consequat.</p>" +

        "<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>" +

        "<b>berspiciatis unde omnis </b>" +

        "<p>Iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non Numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.</p>" +

        "<b> At vero eos et accusamus</b>" +

        "<p>Etusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod “Maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.” Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.</p>" +

        "<b>Commodo Consequat</b>" +

        "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugia</p>";

      $scope.article.bannertext =
        "<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugia</p>";

      $scope.article.eventdate = new Date();
      // $( "#addresspicker_map" ).val('Mumbai, Maharashtra, India');


    };

    $scope.loadExpert = function($query) {
      return $http.get('/api/expert/basic', {
        cache: true
      }).then(function(response) {
        var experts = response.data.experts;
        return experts.filter(function(expert) {
          return expert.name.toLowerCase().indexOf($query.toLowerCase()) !=
            -1;
        });
      });
    };

    $scope.today = function() {
      $scope.article.eventdate = new Date();
    };
    // $scope.today();

    $scope.clear = function() {
      $scope.article.eventdate = null;
    };

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    var addresspickerMap = $("#addresspicker_map").addresspicker({
      regionBias: "in",
      language: "in",
      updateCallback: showCallback,
      mapOptions: {
        zoom: 4,
        center: new google.maps.LatLng(19.0759837, 72.87765590000004),
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      },
      elements: {
        map: "#map",
        lat: "#lat",
        lng: "#lng",
        street_number: '#street_number',
        route: '#route',
        locality: '#locality',
        sublocality: '#sublocality',
        administrative_area_level_2: '#district',
        administrative_area_level_1: '#state',
        country: '#country',
        postal_code: '#postalcode',
        type: '#type'
      }
    });

    var gmarker = addresspickerMap.addresspicker("marker");
    gmarker.setVisible(true);
    addresspickerMap.addresspicker("updatePosition");

    $('#reverseGeocode').change(function() {
      $("#addresspicker_map").addresspicker("option", "reverseGeocode", (
        $(this).val() === 'true'));
    });

    function showCallback(geocodeResult, parsedGeocodeResult) {
      $('#callback_result').text(JSON.stringify(parsedGeocodeResult, null, 4));
    }
    // Update zoom field
    var map = $("#addresspicker_map").addresspicker("map");
    google.maps.event.addListener(map, 'idle', function() {
      $('#zoom').val(map.getZoom());
    });


    $scope.usingFlash = FileAPI && FileAPI.upload != null;
    $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI ==
      null || FileAPI.html5 != false);


    $scope.uploadPic = function(files) {
      $scope.formUpload = true;
      if ($scope.mainFIle[0] !== null) {
        generateThumbAndUpload($scope.mainFIle[0])
      }
    };

    function generateThumbAndUpload(file) {
      $scope.errorMsg = null;
      $scope.generateThumb(file);
      uploadUsing$upload(file);

    }

    function uploadUsing$upload(file) {

      $scope.setscope();
      file.upload = $upload.upload({
        url: '/api/events',
        method: 'POST',
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        data: $scope.article,
        file: file
      });

      file.upload.then(function(response) {
        $timeout(function() {
          console.log(response);
          // $location.path('expert/view/'+response.data.article._id);
          file.result = response.data;
          if ($rootScope.currentUser.role == 'admin') {

            $location.path('/event/view/' + response.data.article._id);

          }

          $scope.expert = {};

        });
      }, function(response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
        $scope.expert = {};
        if ($rootScope.currentUser.role == 'admin') {

          $location.path('/event/view/' + response.data.article._id);

        }

        $scope.articleDone = 1;
        $scope.articleResponse = response.data;
        // $location.path('expert/view/'+response.data.article._id);
        $scope.form.$setPristine();

      });

      file.upload.progress(function(evt) {
        // Math.min is to fix IE which reports 200% sometimes
        file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });

      file.upload.xhr(function(xhr) {
        // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
      });
    }


    $scope.generateThumb = function(file) {
      if (file !== null) {
        if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 ||
            file.type.indexOf('video') > -1)) {
          $timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
              $timeout(function() {
                file.dataUrl = e.target.result;
              });
            };
          });
        }
      }
    };

    $scope.setFiles = function(element) {
      $scope.filearticle = 1;
      var file = element.files[0];
      $scope.$apply(function($scope) {
        console.log('files:', element.files);
        if ($scope.fileReaderSupported && (file.type.indexOf('image') >
            -1 || file.type.indexOf('video') > -1)) {
          $timeout(function() {
            var fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = function(e) {
              $timeout(function() {
                element.files[0].dataUrl = e.target.result;
                $scope.mainFIle = element.files;

              });
            };
          });
        }
        // Turn the FileList object into an Array
        $scope.files = [];
        for (var i = 0; i < element.files.length; i++) {
          $scope.files.push(element.files[i]);
        }
        $scope.progressVisible = false;
      });
    };

    $scope.saveArticle = function(form) {
      //     var str = "abc'sddf khdfkjdf dflkfdlkfd fdkjfdk test#s";
      // alert(str.replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-"));


      if (form.$valid) {
        // var formData = new FormData();
        // formData.append("file", $scope.article.file);
        // console.log(formData);

        $scope.setscope();
        // $scope.form.$setPristine();
        $http({
          method: 'POST',
          url: '/api/events',
          data: $scope.article
        }).
        success(function(data, status, headers, config) {

          // console.log(data);

          if ($rootScope.currentUser.role == 'admin') {

            $location.path('/event/view/' + data.article._id);

          }


        }).
        error(function(data, status, headers, config) {
          // ...
          $scope.article = {};
        });
      }

    };

    $scope.reset = function(form) {
      $scope.form.$setPristine();
    };

    $scope.setscope = function() {
      $scope.article.author = $rootScope.currentUser._id;
      var original = $scope.article.expert;
      $scope.article.expert = [];
      for (var t = 0; t < original.length; t++) {
        $scope.article.expert[t] = {
          name: original[t].name,
          user: original[t]._id,
          flag: original[t].flag,
          designation: original[t].designation
        };
      }


      $scope.article.location.locality = $('#locality').val();
      $scope.article.location.sublocality = $('#sublocality').val();
      $scope.article.location.district = $('#district').val();
      $scope.article.location.state = $('#state').val();
      $scope.article.location.country = $('#country').val();
      $scope.article.location.postalcode = $('#postalcode').val();
      $scope.article.location.lat = $('#lat').val();
      $scope.article.location.lng = $('#lng').val();
      $scope.article.location.zoom = $('#zoom').val();
    };

  }]);

'use strict';

angular.module('pinApp')
.controller('ExpertEditViewCtrl', ['$scope','$http','$timeout','$compile','$upload','$location','$rootScope','expert',function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope,expert) {

   $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
  $scope.expert=expert;

  $scope.removeMedia=function(){
  var remove=confirm("Are you sure you want to remove Profile Pic");
  if(remove)
  {

    $http({ method: 'PUT', url: '/api/expert/removemedia/'+$scope.expert._id}).
      success(function (data, status, headers, config) {
        $scope.expert.media="";
      
      })
      .error(function (data, status, headers, config) {
      
      alert('There is something technical problem.Please try after some time.');
      
      });
 }

};
$scope.uploadPic = function(files) {
    $scope.formUpload = true;
    if ($scope.mainFIle[0] !== null) {
      generateThumbAndUpload($scope.mainFIle[0])
    }
  };
  
  function generateThumbAndUpload(file) {
    $scope.errorMsg = null;
    $scope.generateThumb(file);
    uploadUsing$upload(file);
    
  }

  function uploadUsing$upload(file) {



    $scope.expertput={

      name:$scope.expert.name,
      designation:$scope.expert.designation,
      linkedin:$scope.expert.linkedin,
      mail:$scope.expert.mail

    };


    file.upload = $upload.upload({
      url: '/api/expert/'+expert._id,
      method: 'PUT',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.expertput,
      file: file
    });

    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response);
        $location.path('/admin').search({'expert':1});
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
        $location.path('/admin').search({'expert':1});
      });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }


  $scope.generateThumb = function(file) {
    if (file !== null) {
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              file.dataUrl = e.target.result;
            });
          };
        });
      }
    }
  };
  
   $scope.setFiles = function(element) {
    $scope.filearticle=1;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      // console.log('files:', element.files);
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;
            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.files = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.files.push(element.files[i]);
      }
      $scope.progressVisible = false;
    });
  };

  //update
  $scope.updateArticle=function(form){
    if(form.$valid)
    {
      $http({ method: 'PUT', url: '/api/expert/'+$scope.expert._id,data:$scope.expert }).
      success(function (data, status, headers, config) {
        // ...
        $location.path('/admin').search({'expert':1});
        
        
      }).
      error(function (data, status, headers, config) {
        // ...
        // $scope.expert={};
      });
    }
  };
  
  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

  $scope.remove=function(form){
    var yes=confirm('Are you sure you want to delete this Expert?');
    if(yes)
    {
      $http({
        method:"DELETE",
        url:'/api/expert/'+$scope.expert._id
      }).
      success(function (data,status,headers,config){
        $scope.form.$setPristine();
        $scope.deleteStatus=1;
      })
      .error(function (data,status,headers,config){

      });
    }
  };

}]);

angular.module('pinApp')
.controller('ExpertCtrl', ['$scope','$http','$timeout','$compile','$upload','$location','$rootScope',function ($scope, $http, $timeout, $compile, $upload,$location,$rootScope) {

  $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);


$scope.uploadPic = function(files) {
    $scope.formUpload = true;
    if ($scope.mainFIle[0] !== null) {
      generateThumbAndUpload($scope.mainFIle[0])
    }
  };
  
  function generateThumbAndUpload(file) {
    $scope.errorMsg = null;
    $scope.generateThumb(file);
    uploadUsing$upload(file);
    
  }

  function uploadUsing$upload(file) {

    
    
    file.upload = $upload.upload({
      url: '/api/expert',
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.expert,
      file: file
    });

    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response);
        // $location.path('expert/view/'+response.data.article._id);
        file.result = response.data;
        if($rootScope.currentUser.role == 'admin')
        {
        
            $location.path('/admin').search({ 'expert':1});
        
        }
       
        $scope.expert={};
        
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
         $scope.expert={};
       if($rootScope.currentUser.role == 'admin')
        {
        
            $location.path('/admin').search({ 'expert':1});
        
        }

      $scope.articleDone=1;
      $scope.articleResponse=response.data;
      // $location.path('expert/view/'+response.data.article._id);
      $scope.form.$setPristine();

    });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }


  $scope.generateThumb = function(file) {
    if (file !== null) {
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              file.dataUrl = e.target.result;
            });
          };
        });
      }
    }
  };

  $scope.setFiles = function(element) {
    $scope.filearticle=1;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported && (file.type.indexOf('image') > -1 || file.type.indexOf('video') > -1)) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;
              
            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.files = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.files.push(element.files[i]);
      }
      $scope.progressVisible = false;
    });
  };

  $scope.saveArticle=function(form){
    //     var str = "abc'sddf khdfkjdf dflkfdlkfd fdkjfdk test#s";
    // alert(str.replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-"));


    if(form.$valid)
    {
      // var formData = new FormData();
      // formData.append("file", $scope.article.file);
      // console.log(formData);
      
      $scope.article.author=$rootScope.currentUser._id;
       // var original=$scope.article.tags;
       //  $scope.article.tags=[];
       //  for (var t = 0; t < original.length; t++) {
       //    $scope.article.tags[t] = original[t].text;
       //   }
      $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/expert',data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        // console.log(data);
        if($rootScope.currentUser.role == 'admin')
        {
        
            $location.path('/admin').search({ 'expert':1});
        
        }
       
        
      }).
      error(function (data, status, headers, config) {
        // ...
        $scope.article={};
      });
    }

  };

  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

}]);

'use strict';

angular.module('pinApp')
	.controller('FooterCtrl', ['$scope','$rootScope','$location',function($scope,$rootScope,$location){

		// active menu option
		$scope.isActive = function(route) {
	      return $location.path() === route;
	  };



}]);
'use strict';

angular.module('pinApp')
  .controller('ForgotCtrl', ['$scope','Auth',function ($scope, Auth) {
    $scope.email = {};
    $scope.errors = {};
    $scope.success = false;
    $scope.submitDisabled = false;
    $scope.forgotPassword = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        $scope.submitDisabled = true;
        Auth.resetPassword({
          email: $scope.email
        })
        .then(function() {
          $scope.success = true;
        })
        .catch(function(err) {
          $scope.errors.other = err.data;
          $scope.submitDisabled = false;
        }); 
      }     
    };
  }]);

'use strict';

angular.module('pinApp')
  .controller('LoginCtrl', ['$scope','Auth','$location','$rootScope',function ($scope, Auth,$location, $rootScope) {
    $scope.user = {};
    $scope.errors = {};
    $rootScope.changeFooterNishant = 1;
    console.log(Object.keys($location.search())[0]);
    $scope.facebookLogin = Auth.facebookLogin;
    $scope.linkedinLogin = Auth.linkedinLogin;
    
    $scope.registerStatus = Object.keys($location.search())[0] || 'test';
    $scope.errormessage=$location.search()[$scope.registerStatus] || '';
    $scope.field=Object.keys($location.search())[1] || 'field';
    

    $scope.login = function(form) {

      $scope.submitted = true;
      if(form.$valid) {
        Auth.login({
          // I really hate doing this, I hope Angular JS guys and FF guys can solve this issue.
          email: document.getElementById('username').value,   // Doing this becuase of Firefox issue of autofill
          password: document.getElementById('password').value // not trigerring Angular JS update. FFBug ID: 950510
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
  }]);

'use strict';

angular.module('pinApp')
	.controller('NavbarCtrl', ['$scope','$location','$rootScope','Auth','$http','$modal','$sce','$filter', function($scope,$location,$rootScope,Auth,$http,$modal,$sce,$filter){
$scope.descriptionLimit=200;
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


$scope.mmicategorysetting={
'Investments':
{
  'main-image':'investment-img.png',
  'icon-img':'investment-icon.jpg',
  'classname':'investment-iocn'
},

'WM/distribution':
{
  'main-image':'welath-img.png',
  'icon-img':'wealth.png',
  'classname':'wealth-iocn'
},

'Communication':
{
  'main-image':'communicationlarge-img.png',
  'icon-img':'cummunaction.png',
  'classname':'communication-iocn'
}

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

      angular.forEach(data.articles,function(eventname,key){
      var currentdate=new Date();
      if(new Date(eventname.eventdate) < new Date(currentdate)) 
        delete data.articles[key]; 
    });
      
      $scope.pineventlist=data.articles;
      
    })

    .error(function (data,status,headers,config){

    });



  };

  $scope.getDiscussionslist=function(){
    $scope.eventlist=[];
     $http({
      method:"GET",
      url:'api/discussions'
    }).
    success(function (data,status,headers,config){

      $scope.pindiscussionslist=data.discussion;

    })

    .error(function (data,status,headers,config){

    });



  };

  $scope.getHansiArticle=function(){
    $scope.eventlist=[];
     $http({
      method:"GET",
      url:'api/hansiarticles'
    }).
    success(function (data,status,headers,config){

     
      $.each(data.articles,function(i,article){
           article.description = $sce.trustAsHtml($filter('htmlToPlaintext')($filter('limitTo')(article.description, $scope.descriptionLimit)));
           });
      $scope.hansiArticles=data.articles;
    })

    .error(function (data,status,headers,config){

    });



  };

  $scope.getHansiArticle();

  $scope.searcharticle=function(form)
  {

   if(form.$valid)
      {
       $location.path('/articles/search/'+$scope.search);

      }

  };

$scope.getEventslist();  
$scope.getDiscussionslist();
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
          
        if ($rootScope.redirectPath && $rootScope.redirectPath !== '/register') {
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
  .controller('NavLoginCtrl', ['$scope','Auth','$location','$rootScope','$modalInstance',function ($scope, Auth,$location, $rootScope,$modalInstance) {
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
  }]);

'use strict';

angular.module('pinApp')
  .controller('NishantCtrl',['$scope','$location','$rootScope','$http', function ($scope, $location,$rootScope ,$http) {
    // $scope.user = {};
    $scope.errors = {};

     $scope.nishant = function(form) {
      $scope.submitted = true;
  
      if(form.$valid) {
      	console.log( $scope.user);
        $http.post('api/nishant', $scope.user)
        .success(function(data, status, headers, config){

          $scope.status=data.status;

        })
        .error(function(data, status, headers, config){

        });


      }
    };

  }]);

'use strict';

angular.module('pinApp')
.controller('NotificationCtrl', ['$scope','$location','$rootScope','Auth','$routeParams','$http', function($scope,$location,$rootScope,Auth,$routeParams,$http){

	$scope.type=$routeParams.type;
if($routeParams.email && $routeParams.token){
  $scope.type='unsubcribe';   
  $http({ method: 'PUT', url: '/api/users/'+$routeParams.token,data:{'unsubcribe':true}}).
    success(function (data, status, headers, config) {
    }).
  error(function (data, status, headers, config) {
      // ...
      // $scope.article={};
    });


}
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
'use strict';

angular.module('pinApp')
  .controller('RecoverCtrl', ['$scope','Auth','$routeParams',function ($scope, Auth, $routeParams) {
    $scope.submitted = false;
    $scope.success = false;
    $scope.token = $routeParams.token;
    $scope.id = $routeParams.id;
    $scope.errors = {};
    $scope.recover = function(form) {
      $scope.submitted = true;
      if (form.$valid && $scope.password === $scope.Rpassword  ) {
        Auth.recoverPassword({
          _id : $scope.id,
          newPassword : $scope.password,
          token : $scope.token
        })
       .then(function() {
         $scope.success = true;
       })
       .catch(function (err) {
         $scope.errors[err.data] = true;;
       });
      }
    };
  }]);
    


'use strict';

angular.module('pinApp')
  .controller('RegisterCtrl',['$scope','$location','$rootScope','Auth','$http', function ($scope, $location,$rootScope ,Auth,$http) {

   $scope.roletypes=[
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
      'city':'',
      'country':'India'
    },
    companyname:{
      title:'',
      address:[{
        'street':'',
        'city':'',
        'state':'',
        'country':'',
        'pin':'',
        'phone':''
      }]
    }
    };
    var precountry=$scope.user.address.country; 

    $scope.checkcountry=function(){
       if(precountry !== $scope.user.address.country)
       {
        precountry = $scope.user.address.country;
        $scope.user.address.city="";

       }

    };

      $http({ method: 'GET', url: 'api/companys/register' }).
          success(function (data, status, headers, config) {
             $scope.companies=data.company;
             
          }).
        error(function (data, status, headers, config) {

        });

     
     $scope.changeaddress=function(){

      if ($scope.user.company && $scope.user.company !== 'add-new') {
        var removeIndex = $scope.companies
          .map(function(item) {
            return item._id;
          })
          .indexOf($scope.user.company);

        $scope.companyaddress = $scope.companies[removeIndex].address;
        $scope.selectroletypes = $scope.companies[removeIndex].roletype;
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
          lastname: $scope.user.lastname,
          firstname:  $scope.user.firstname,
          username:  $scope.user.username,
          alias: $scope.user.alias,
          address: $scope.user.address,
          email: $scope.user.email,
          phone: $scope.user.phone,
          adminrole: $scope.user.adminrole,
          // notes: $scope.user.notes,
          companyname: $scope.user.companyname,
          // notes: $scope.user.notes,
          interests: $scope.user.interests,
          // other: $scope.user.other,
          password:$scope.user.password,
          company:$scope.user.company,
          companyaddress:$scope.user.companyaddress,
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


  

'use strict';

angular.module('pinApp')
.controller('SocketCtrl', ['$log','$scope','nickName','$rootScope','$location','$http','$timeout',function ($log, $scope, nickName,$rootScope,$location,$http,$timeout) {
  if($rootScope.currentUser)
  {
    nickName=$rootScope.currentUser.firstname;
  }

$scope.color={
    'Investments':
    {'caption':'caption',
    'colorclass':'greenbox',
    'image':'green-chat.jpg'
  },
  'WM/distribution':
  {
    'caption':'caption-red',
    'colorclass':'redbox',
    'image':'red-chat.jpg'
  },
  'Communication':
  {
   'caption':'caption-aqua',
   'colorclass':'aquanbox',
    'image':'blue-chat.jpg'
 },
 'Give':
 { 'caption':'caption-pink',
 'colorclass':'pinkbox',
    'image':'purple-chat.jpg'
}
};
 
  $scope.currentDate=new Date().getTime();

 
 $scope.category=['Grow','Protect','Manage','Give'];


  $scope.topicnames=[
   {
    'name':'Investments',
    'sub': [
    {
      'name':'Traditional',
      'tags':['Equities','Fixed Interest','Real Estate', 'Cash','Global']
    },
    {
      'name':'Alternative',
      'tags':['Private Equity', 'Hedge Fund', 'Venture, Angel', 'Real Estate']
    },
    {
      'name':'Portfolios Construction',
      'tags':[]
    },
    {  
      'name':'Markets',
      'tags':[]
    }
    ]
    },
  {
    'name':'WM/distribution',
    'sub':[
          {
          'name':'Wealth planning',
          'tags':['Trusts', 'Wills', 'Governance']
          },
          {
            'name':'Business issues',
            'tags':['Strategy', 'marketing', 'sales, operations']
          },
          {
            'name':'Advisory process',
            'tags':['Client onboarding', 'risk profiling','behavioural finance']
          }
        ]
   },
  {
    'name':'Communication',
    'sub': [
      {
      'name':'Investor comms',
      'tags':[]
       }
      ]
  }
  ];


    $scope.changetopic=function(){

     var removeIndex = $scope.topicnames
      .map(function(item)
      { 
        return item.name;
      })
      .indexOf($scope.chat.topic);

      $scope.subtopicnames=$scope.topicnames[removeIndex].sub;
      // $scope.article.mmitags=$scope.topicnames[removeIndex].sub;

  };

    $scope.changelookuptopic=function(){

     var removeIndex = $scope.topicnames
      .map(function(item)
      { 
        return item.name;
      })
      .indexOf($scope.search.topic);

      $scope.subtopicnames=$scope.topicnames[removeIndex].sub;
      // $scope.article.mmitags=$scope.topicnames[removeIndex].sub;

  };


 
 $scope.article={};
 $scope.chat={};
 if($location.search()['cid'])
 {
 $scope.chatid=$location.search()['cid'];
 $scope.chat={cid : $scope.chatid};
 $http({ method: 'GET', url: '/api/discussions/'+$location.search()['cid'] }).
      success(function (data, status, headers, config) {
        $scope.discussion=data.discussion[0];
        $scope.comments=$scope.discussion.scomments;

      })

      
      .error(function (data, status, headers, config) {
          $scope.chatid='nochat';
      });
 }else{

  $scope.chatid=$location.search()['cid'] || 'nochat';
   $http({ method: 'GET', url: '/api/discussions' }).
      success(function (data, status, headers, config) {
        $scope.chatlist=data.discussion;
      })
      
      .error(function (data, status, headers, config) {
        // $location.path('/chat-start').search('cid',$scope.chatid);
        
      });


 }

 



$scope.deleteComment=function(commentId){

  var yes=confirm('Are you sure you want to delete this Comment?');
  if(yes)
  {
    $http({
      method:"DELETE",
      url:'/api/discussion-comments/'+$scope.discussion._id+"/"+commentId
    }).
    success(function (data,status,headers,config){
      $scope.deleteStatus=1;

      var removeIndex = $scope.discussion.scomments
      .map(function(item)
      { 
        return item._id;
      })
      .indexOf(commentId);

      $scope.discussion.scomments.splice(removeIndex, 1);

    })
    .error(function (data,status,headers,config){

    });
  }

};


$scope.addComment=function(form){

 if(form.$valid)
 {
  
    var comment={ user: $rootScope.currentUser._id ,username:$rootScope.currentUser.firstname, post: $scope.article.comment};  

    $http({ method: 'POST', url: '/api/discussion-comments/'+$scope.discussion._id,data:comment }).
    success(function (data, status, headers, config) {
          // ...
          console.log(data);
          comment.posted=new Date();
          comment._id=data.scomments[data.scomments.length-1]._id;

          $scope.discussion.scomments.push(comment);
          
          $scope.article={};
          // 
          // $scope.form.$setPristine();
          
        }).
    error(function (data, status, headers, config) {
      $scope.article={};
    });
  }


};

$scope.editComment=function(form,commentId,editcomment,key){
if(form.$valid)
 {
  var comment={ post: editcomment,username:$rootScope.currentUser.firstname,user:$rootScope.currentUser._id};  

    $http({ method: 'PUT', url: '/api/discussion-comments/'+$scope.discussion._id+'/'+commentId,data:comment}).
    success(function (data, status, headers, config) {
          // $scope.form.$setPristine();

          var removeIndex = $scope.discussion.scomments
          .map(function(item)
          { 
            return item._id;
          })
          .indexOf(commentId);

          $scope.discussion.scomments[removeIndex].post= editcomment;
          // $scope.editcomment_id=0;
          // $scope.article={};
        
        $timeout(function(){
       
           angular.element("#"+key+"-a").trigger("click");
         
        },200);
          
        }).
    error(function (data, status, headers, config) {
      // $scope.article={};
      alert("there is something technical problem please try after some time");
    });
}
};

  $scope.chatDetail = function(form) {
    $scope.submitted = true;
    if(form.$valid) {
    $scope.forsubmit=1;
      $scope.chat.scomments=[{ user: $rootScope.currentUser._id,
               username:$rootScope.currentUser.firstname,
               post: $scope.chat.comment               
             }];
      $scope.chat.cid=new Date().getTime();       
      $scope.chat.authormmi=$rootScope.currentUser._id;
      $http({ method: 'POST', url: '/api/discussions',data:$scope.chat }).
      success(function (data, status, headers, config) {
       // $location.path('/discussion-start').search('cid',$scope.chatid);
        $scope.forsubmit=0;
        $scope.chatlist.push($scope.chat);
        $scope.form.$setPristine();
        // $scope.lastid=$scope.chat.cid;
        $scope.chat={};
        $scope.creatediscussion=1;
      })
      .error(function (data, status, headers, config) {
        // $location.path('/chat-start').search('cid',$scope.chatid);
        $scope.forsubmit=0;
      });

    }
  };

  $scope.nickName = nickName;
  $scope.messageLog = 'Ready to chat!';
  $scope.sendMessage = function() {
  

    // var match = $scope.message.match('^\/nick (.*)');

    // if (angular.isDefined(match) && angular.isArray(match) && match.length === 2) {
    //   var oldNick = nickName;
    //   nickName = match[1];
    //   $scope.message = '';
    //   $scope.messageLog = ew Date(), 
    //                   nickName, 'nickname changed - from ' + 
    //                     oldNick + ' to ' + nickName + '!') + $scope.messageLog;
    //   $scope.nickName = nickName;
    // }

    // $log.debug('sending message', $scope.message);
    // chatSocket.emit('message', nickName, $scope.message);
    // $scope.message = '';

  };

  // $scope.$on('socket:broadcast', function(event, data) {
    
  //   $log.debug('got a message', event.name);
  //   if (!data.payload) {
  //     $log.error('invalid message', 'event', event, 'data', JSON.stringify(data));
  //     return;
  //   }else{
  //     // save in db with 
  //     // userid:$rootScope.currentUser._id
  //     // data.payload

  //   }

  //   $scope.$apply(function() {
  //     $scope.messageLog = ew Date(), data.source, data.payload) + $scope.messageLog;
  //   });
  // });
}]);

'use strict';

angular.module('pinApp')
.controller('UploadCompanyCtrl', ['$scope','$rootScope','$http','$route','$timeout','$upload',function ($scope,$rootScope,$http,$route,$timeout,$upload ) {
  $scope.article={};
  $scope.loaddata=0;

  $scope.companyStructure={
    'Buy':{
        'WM':{
            'Multi-family office':[1,2,3,4,5],
            'Private Bank':[1,2,3,4,5],
            'Retail Bank':[1,2,3,4,5],
            'Private Client Firm':[1,2,3,4,5],
            'IFA':[1,2,3,4,5],
            'IFA platform':[1,2,3],
            'Securities firm':[1,2,3,4,5]
        },
        'Foreign portfolio investor':{
            'Consultants':[1,2,3,4,5],
            'FII - pension':[1,2,3,4,5],
            'FII - SWF':[1,2,3,4,5],
            'FII - insurance':[1,2,3,4,5],
            'FII - endowment':[1,2,3,4,5],
            'FII - fund-of-funds':[1,2,3,4,5],
            'Family office':[1,2,3,4,5],
        },
        'Regulator':{
            'Regulator':[1,2,3,4,5]
        },
        'Industry':{
          'Association':[1,2,3,4]
        }
        
    },
    'Sell':{
        'Service provider':{
            'Tax/Accounting':[1,2,3],
            'Legal':[1,2,3],
            'Technology':[1,2,3],
            'Education':[1,2,3],
            'Association':[1,2,3],
            'Trust company':[1,2,3],
            'Consulting':[1,2,3],
            'Research/Investment consulting/data provider':[1,2,3],
            'Media':[1,2,3],
            'Philanthropic/NGO':[1,2,3],
            'Securities exchange':[1,2,3],
            'Custody':[1,2,3,4],
            'Recruitment':[1,2,3,4]
        },
        'Product provider':{
            'Asset Management Company':[1,2,3,6,7],
            'Alternative Investment Fund Manager':[1,2,3,6,7],
            'Portfolio Management Service Provider':[1,2,3,6,7],
            'Investment Bank':[1,2,3,6,7],
            'Non-bank financial institution':[1,2,3,6,7],
            'Insurance Company':[1,2,3,4,6,7],

        },
        'Industry':{
          'Association':[1,2,3,4]
        }
    }
};

  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

  $scope.companies=[];

$scope.uploadPic = function(files) {


    $scope.formUpload = true;
    
    if ($scope.mainFIle[0] !== null) {
       generateThumbAndUpload($scope.mainFIle[0]);
    }



  };
  
  function generateThumbAndUpload(file) {
    $scope.errorMsg = null;
    //$scope.generateThumb(file);
    uploadUsing$upload(file);
    
  }

  function uploadUsing$upload(file) {
    var mainfiles=[];
      mainfiles[0]=file; 
    
    file.upload = $upload.upload({
      url: '/api/companys/upload',
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.article,
      file: mainfiles
    });

    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response);
        // $location.path('articles/view/'+output.companies[i].response.data.article._id);
        file.result = response.data;
        $scope.articleDone=1;
        startparsing();
      });
    }, function(response) {
      if (response.status > 0)
      $scope.errorMsg = response.status + ': ' + response.data;
      $scope.article={};
      $scope.articleDone=1;
      startparsing();
     
    });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }


  $scope.generateThumb = function(file) {
    if (file !== null) {
      if ($scope.fileReaderSupported) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              file.dataUrl = e.target.result;
            });
          };
        });
      }
    }
  };

  $scope.setFiles = function(element) {
    $scope.filearticle=1;
    $scope.videoupload=0;
    $scope.imageupload=0;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported) {
        $timeout(function() {
          
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
             element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;
              $scope.loaddata=0;  
              
            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.files = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.files.push(element.files[i]);
      }
      $scope.progressVisible = false;
    });
  };

  $scope.setThumbleFiles = function(element) {
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported ) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
           //   element.files[0].dataUrl = e.target.result;
              $scope.thumbleFile=element.files;
              
            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.thumblefiles = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.thumblefiles.push(element.files[i]);
      }
      // $scope.progressVisible = false;
    });
  };


  $scope.uploadCompany=function(){

  angular.forEach($scope.companies, function(value, key) {
      // $scope.form.$setPristine();
      angular.forEach(value.address,function(address,key){
      if(address.street == '')
      {
          delete value.address[key];
      }
     });   


      $http({ method: 'POST', url: '/api/companys',data:value }).
      success(function (data, status, headers, config) {
        $scope.companies[key].status=1;
        // $scope.companies[key].address[0]['main']=1;
      }).
      error(function (data, status, headers, config) {
        // ...
        angular.forEach(data.errors,function(error, field){

          $scope.companies[key].error=error.message;

        });

      });
  });                   

    

  };



  // ----------------
  function to_csv(workbook) {
  var result = [];
  workbook.SheetNames.forEach(function(sheetName) {
    var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    if(csv.length > 0){
      result.push("SHEET: " + sheetName);
      result.push("");
      result.push(csv);
    }
  });
  return result.join("\n");
}

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  // console.log(result);
  return result;
}

function process_wb(wb) {
  var output = to_json(wb);
  // if(out.innerText === undefined) out.textContent = output;
  // else out.innerText = output;
  $scope.loaddata=1;
  if(typeof console !== 'undefined') 
    {
      console.log("output", new Date());
      console.log(output);
      var str="";
    if(output.companies && output.companies.length)
    {

$scope.companies=[];

    for (var i = 0; i < output.companies.length; i++) {
      
      var temp={
'title':output.companies[i].title,
'firmsupertype':output.companies[i].firmsupertype,
'firmtype':output.companies[i].firmtype,
'firmsubtype':output.companies[i].firmsubtype,
'services':(output.companies[i].services+ ",").split(","),
'roletype':$scope.companyStructure[output.companies[i].firmsupertype][output.companies[i].firmtype][output.companies[i].firmsubtype],

'address':[

{  
  'street':output.companies[i].office1street,
  'city':output.companies[i].office1city,
  'state':output.companies[i].office1state,
  'country':output.companies[i].office1country,
  'pin':output.companies[i].office1pin,
  'main':1,
  'phone':output.companies[i].office1phone
  }   
//  { 
//   'street':output.companies[i].office2street,
//    'city':output.companies[i].office2city,
//    'state':output.companies[i].office2state,
//    'country':output.companies[i].office2country,
//    'pin':output.companies[i].office2pin,
//    'main':output.companies[i].office2main,
//    'phone':output.companies[i].office2phone
//   },
//   {

//     'street':output.companies[i].office3street,
//     'city':output.companies[i].office3city,
//     'state':output.companies[i].office3state,
//     'country':output.companies[i].office3country,
//     'pin':output.companies[i].office3pin,
//     'main':output.companies[i].office3main,
//     'phone':output.companies[i].office3phone
//    },       
//   {
//   'street':output.companies[i].office4street,
//   'city':output.companies[i].office4city,
//   'state':output.companies[i].office4state,
//   'country':output.companies[i].office4country,
//   'pin':output.companies[i].office4pin,
//   'main':output.companies[i].office4main,
//   'phone':output.companies[i].office4phone
// }
  ],
        

  'pin':true,
  'money':true,
  'url':output.companies[i].url,
  'notes':output.companies[i].notes,
  'description':output.companies[i].description,
  'status':0


  };
  
     $scope.companies.push(temp);
 }
 $scope.setdata=1;
  $scope.loaddata=1;
}else{
   $scope.loaddata=1;
      $scope.setdatanotfound=1;
    }
     // out.innerText=str;
  }
}

var url = "uploads/companies.xlsx";

var oReq;
function startparsing()
{

if(window.XMLHttpRequest) oReq = new XMLHttpRequest();
else if(window.ActiveXObject) oReq = new ActiveXObject('MSXML2.XMLHTTP.3.0');
else throw "XHR unavailable for your browser";

// document.getElementById('fileurl').innerHTML = '<a href="' + url + '">Download file</a>';

oReq.open("GET", url, true);

if(typeof Uint8Array !== 'undefined') {
  oReq.responseType = "arraybuffer";
  oReq.onload = function(e) {
    if(typeof console !== 'undefined') console.log("onload", new Date());
    var arraybuffer = oReq.response;
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var wb = XLSX.read(arr.join(""), {type:"binary"});
    process_wb(wb);
  };
} else {
  oReq.setRequestHeader("Accept-Charset", "x-user-defined");  
  oReq.onreadystatechange = function() { if(oReq.readyState == 4 && oReq.status == 200) {
    var ff = convertResponseBodyToText(oReq.responseBody);
    if(typeof console !== 'undefined') console.log("onload", new Date());
    var wb = XLSX.read(ff, {type:"binary"});
    process_wb(wb);
  } };
}

oReq.send();
}


}]);

'use strict';

angular.module('pinApp')
.controller('UploadNewUsersCtrl', ['$scope','$rootScope','$http','$route','$timeout','$upload',function ($scope,$rootScope,$http,$route,$timeout,$upload ) {
  $scope.article={};
  $scope.loaddata=0;
   $scope.companyStructure={
    'Buy':{
        'WM':{
            'Multi-family office':[1,2,3,4,5],
            'Private Bank':[1,2,3,4,5],
            'Retail Bank':[1,2,3,4,5],
            'Private Client Firm':[1,2,3,4,5],
            'IFA':[1,2,3,4,5],
            'IFA platform':[1,2,3],
            'Securities firm':[1,2,3,4,5]
        },
        'Foreign portfolio investor':{
            'Consultants':[1,2,3,4,5],
            'FII - pension':[1,2,3,4,5],
            'FII - SWF':[1,2,3,4,5],
            'FII - insurance':[1,2,3,4,5],
            'FII - endowment':[1,2,3,4,5],
            'FII - fund-of-funds':[1,2,3,4,5],
            'Family office':[1,2,3,4,5],
        },
        'Regulator':{
            'Regulator':[1,2,3,4,5]
        },
        'Industry':{
          'Association':[1,2,3,4]
        }
        
    },
    'Sell':{
        'Service provider':{
            'Tax/Accounting':[1,2,3],
            'Legal':[1,2,3],
            'Technology':[1,2,3],
            'Education':[1,2,3],
            'Association':[1,2,3],
            'Trust company':[1,2,3],
            'Consulting':[1,2,3],
            'Research/Investment consulting/data provider':[1,2,3],
            'Media':[1,2,3],
            'Philanthropic/NGO':[1,2,3],
            'Securities exchange':[1,2,3],
            'Custody':[1,2,3,4],
            'Recruitment':[1,2,3,4]
        },
        'Product provider':{
            'Asset Management Company':[1,2,3,6,7],
            'Alternative Investment Fund Manager':[1,2,3,6,7],
            'Portfolio Management Service Provider':[1,2,3,6,7],
            'Investment Bank':[1,2,3,6,7],
            'Non-bank financial institution':[1,2,3,6,7],
            'Insurance Company':[1,2,3,4,6,7],

        },
        'Industry':{
          'Association':[1,2,3,4]
        }
    }
};

  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

  $scope.users=[];

$scope.uploadPic = function(files) {


    $scope.formUpload = true;
    
    if ($scope.mainFIle[0] !== null) {
       generateThumbAndUpload($scope.mainFIle[0]);
    }



  };
  
  function generateThumbAndUpload(file) {
    $scope.errorMsg = null;
    //$scope.generateThumb(file);
    uploadUsing$upload(file);
    
  }

  function uploadUsing$upload(file) {
    var mainfiles=[];
      mainfiles[0]=file; 
    
    file.upload = $upload.upload({
      url: '/api/users/upload',
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.article,
      file: mainfiles
    });

    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response);
        // $location.path('articles/view/'+output.Sheet1[i].response.data.article._id);
        file.result = response.data;
        $scope.articleDone=1;
        startparsing();
      });
    }, function(response) {
      if (response.status > 0)
      $scope.errorMsg = response.status + ': ' + response.data;
      $scope.article={};
      $scope.articleDone=1;
      startparsing();
     
    });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }


  $scope.generateThumb = function(file) {
    if (file !== null) {
      if ($scope.fileReaderSupported) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              file.dataUrl = e.target.result;
            });
          };
        });
      }
    }
  };

  $scope.setFiles = function(element) {
    $scope.filearticle=1;
    $scope.videoupload=0;
    $scope.imageupload=0;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported) {
        $timeout(function() {
          
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
             element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;
              $scope.loaddata=0;  
              
            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.files = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.files.push(element.files[i]);
      }
      $scope.progressVisible = false;
    });
  };

  $scope.setThumbleFiles = function(element) {
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported ) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
           //   element.files[0].dataUrl = e.target.result;
              $scope.thumbleFile=element.files;
              
            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.thumblefiles = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.thumblefiles.push(element.files[i]);
      }
      // $scope.progressVisible = false;
    });
  };


  $scope.uploadCompany=function(){

  angular.forEach($scope.users, function(value, key) {
      // $scope.form.$setPristine();
      setTimeout(function(){
        console.log($scope.users[key]);
        $http({ method: 'POST', url: '/api/users',data:value }).
      success(function (data, status, headers, config) {
        $scope.users[key].status=1;
      }).
      error(function (data, status, headers, config) {
        // ...
        angular.forEach(data.errors,function(error, field){

          $scope.users[key]['error'][field]=error.message;

        });

      });
    },1000);
  });                   

    

  };



  // ----------------
  function to_csv(workbook) {
  var result = [];
  workbook.SheetNames.forEach(function(sheetName) {
    var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    if(csv.length > 0){
      result.push("SHEET: " + sheetName);
      result.push("");
      result.push(csv);
    }
  });
  return result.join("\n");
}

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  // console.log(result);
  return result;
}

function process_wb(wb) {
  var output = to_json(wb);
  // if(out.innerText === undefined) out.textContent = output;
  // else out.innerText = output;
  $scope.loaddata=1;
  if(typeof console !== 'undefined') 
    {
      console.log("output", new Date());
      console.log(output);
      var str="";
    if(output.users && output.users.length)
    {

$scope.users=[];

    for (var i = 0; i < output.users.length; i++) {
      
      var temp={
  'company': output.users[i].company ? output.users[i].company :'add-new',
  'companyname':{'title':output.users[i].companyname},     
  'firstname':output.users[i].firstname,
  'lastname':output.users[i].lastname,
  'username':output.users[i].username || output.users[i].firstname,
  'email':output.users[i].email,
  'password':'test@123',
  'phone':output.users[i].phone,
  'custom_job':output.users[i].custtom_job_title,
  'address':  {  
    'city':output.users[i].city,
    'country':'India'
  },   
  'notes':'',
  'status':1,
  'emailVerification' : {
        "verified" : true
  },
  'createdAt':output.users[i].createdAt
   
  };

  // temp.companyname.title= (!output.users[i].company && output.companyname)  ? output.companyname :'';
   $scope.users.push(temp);
 }
 $scope.setdata=1;
  $scope.loaddata=1;
}else{
   $scope.loaddata=1;
      $scope.setdatanotfound=1;
    }
     // out.innerText=str;
  }
  console.log($scope.users);
}

var url = "uploads/users.xlsx";

var oReq;
function startparsing()
{

if(window.XMLHttpRequest) oReq = new XMLHttpRequest();
else if(window.ActiveXObject) oReq = new ActiveXObject('MSXML2.XMLHTTP.3.0');
else throw "XHR unavailable for your browser";

// document.getElementById('fileurl').innerHTML = '<a href="' + url + '">Download file</a>';

oReq.open("GET", url, true);

if(typeof Uint8Array !== 'undefined') {
  oReq.responseType = "arraybuffer";
  oReq.onload = function(e) {
    if(typeof console !== 'undefined') console.log("onload", new Date());
    var arraybuffer = oReq.response;
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var wb = XLSX.read(arr.join(""), {type:"binary"});
    process_wb(wb);
  };
} else {
  oReq.setRequestHeader("Accept-Charset", "x-user-defined");  
  oReq.onreadystatechange = function() { if(oReq.readyState == 4 && oReq.status == 200) {
    var ff = convertResponseBodyToText(oReq.responseBody);
    if(typeof console !== 'undefined') console.log("onload", new Date());
    var wb = XLSX.read(ff, {type:"binary"});
    process_wb(wb);
  } };
}

oReq.send();
}


}]);
'use strict';

angular.module('pinApp')
.controller('UploadUsersCtrl', ['$scope','$rootScope','$http','$route','$timeout','$upload',function ($scope,$rootScope,$http,$route,$timeout,$upload ) {
  $scope.article={};
  $scope.loaddata=0;
   $scope.companyStructure={
    'Buy':{
        'WM':{
            'Multi-family office':[1,2,3,4,5],
            'Private Bank':[1,2,3,4,5],
            'Retail Bank':[1,2,3,4,5],
            'Private Client Firm':[1,2,3,4,5],
            'IFA':[1,2,3,4,5],
            'IFA platform':[1,2,3],
            'Securities firm':[1,2,3,4,5]
        },
        'Foreign portfolio investor':{
            'Consultants':[1,2,3,4,5],
            'FII - pension':[1,2,3,4,5],
            'FII - SWF':[1,2,3,4,5],
            'FII - insurance':[1,2,3,4,5],
            'FII - endowment':[1,2,3,4,5],
            'FII - fund-of-funds':[1,2,3,4,5],
            'Family office':[1,2,3,4,5],
        },
        'Regulator':{
            'Regulator':[1,2,3,4,5]
        },
        'Industry':{
          'Association':[1,2,3,4]
        }
        
    },
    'Sell':{
        'Service provider':{
            'Tax/Accounting':[1,2,3],
            'Legal':[1,2,3],
            'Technology':[1,2,3],
            'Education':[1,2,3],
            'Association':[1,2,3],
            'Trust company':[1,2,3],
            'Consulting':[1,2,3],
            'Research/Investment consulting/data provider':[1,2,3],
            'Media':[1,2,3],
            'Philanthropic/NGO':[1,2,3],
            'Securities exchange':[1,2,3],
            'Custody':[1,2,3,4],
            'Recruitment':[1,2,3,4]
        },
        'Product provider':{
            'Asset Management Company':[1,2,3,6,7],
            'Alternative Investment Fund Manager':[1,2,3,6,7],
            'Portfolio Management Service Provider':[1,2,3,6,7],
            'Investment Bank':[1,2,3,6,7],
            'Non-bank financial institution':[1,2,3,6,7],
            'Insurance Company':[1,2,3,4,6,7],

        },
        'Industry':{
          'Association':[1,2,3,4]
        }
    }
};

  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

  $scope.users=[];

$scope.uploadPic = function(files) {


    $scope.formUpload = true;
    
    if ($scope.mainFIle[0] !== null) {
       generateThumbAndUpload($scope.mainFIle[0]);
    }



  };
  
  function generateThumbAndUpload(file) {
    $scope.errorMsg = null;
    //$scope.generateThumb(file);
    uploadUsing$upload(file);
    
  }

  function uploadUsing$upload(file) {
    var mainfiles=[];
      mainfiles[0]=file; 
    
    file.upload = $upload.upload({
      url: '/api/users/upload',
      method: 'POST',
      // headers: {
      //   'Content-Type': 'multipart/form-data'
      // },
      data:$scope.article,
      file: mainfiles
    });

    file.upload.then(function(response) {
      $timeout(function() {
        console.log(response);
        // $location.path('articles/view/'+output.Sheet1[i].response.data.article._id);
        file.result = response.data;
        $scope.articleDone=1;
        startparsing();
      });
    }, function(response) {
      if (response.status > 0)
      $scope.errorMsg = response.status + ': ' + response.data;
      $scope.article={};
      $scope.articleDone=1;
      startparsing();
     
    });

    file.upload.progress(function(evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });

    file.upload.xhr(function(xhr) {
      // xhr.upload.addEventListener('abort', function(){console.log('abort complete')}, false);
    });
  }


  $scope.generateThumb = function(file) {
    if (file !== null) {
      if ($scope.fileReaderSupported) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              file.dataUrl = e.target.result;
            });
          };
        });
      }
    }
  };

  $scope.setFiles = function(element) {
    $scope.filearticle=1;
    $scope.videoupload=0;
    $scope.imageupload=0;
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported) {
        $timeout(function() {
          
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
             element.files[0].dataUrl = e.target.result;
              $scope.mainFIle=element.files;
              $scope.loaddata=0;  
              
            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.files = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.files.push(element.files[i]);
      }
      $scope.progressVisible = false;
    });
  };

  $scope.setThumbleFiles = function(element) {
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported ) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
           //   element.files[0].dataUrl = e.target.result;
              $scope.thumbleFile=element.files;
              
            });
          };
        });
      }
      // Turn the FileList object into an Array
      $scope.thumblefiles = [];
      for (var i = 0; i < element.files.length; i++) {
        $scope.thumblefiles.push(element.files[i]);
      }
      // $scope.progressVisible = false;
    });
  };


  $scope.uploadCompany=function(){

  angular.forEach($scope.users, function(value, key) {
      // $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/users',data:value }).
      success(function (data, status, headers, config) {
        $scope.users[key].status=1;
      }).
      error(function (data, status, headers, config) {
        // ...
        angular.forEach(data.errors,function(error, field){

          $scope.users[key]['error'][field]=error.message;

        });

      });
  });                   

    

  };



  // ----------------
  function to_csv(workbook) {
  var result = [];
  workbook.SheetNames.forEach(function(sheetName) {
    var csv = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName]);
    if(csv.length > 0){
      result.push("SHEET: " + sheetName);
      result.push("");
      result.push(csv);
    }
  });
  return result.join("\n");
}

function to_json(workbook) {
  var result = {};
  workbook.SheetNames.forEach(function(sheetName) {
    var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    if(roa.length > 0){
      result[sheetName] = roa;
    }
  });
  // console.log(result);
  return result;
}

function process_wb(wb) {
  var output = to_json(wb);
  // if(out.innerText === undefined) out.textContent = output;
  // else out.innerText = output;
  $scope.loaddata=1;
  if(typeof console !== 'undefined') 
    {
      console.log("output", new Date());
      console.log(output);
      var str="";
    if(output.Sheet1 && output.Sheet1.length)
    {

$scope.users=[];

    for (var i = 0; i < output.Sheet1.length; i++) {
      
      var temp={
  'firstname':output.Sheet1[i].firstname,
  'lastname':output.Sheet1[i].lastname,
  'username':output.Sheet1[i].username,
  'email':output.Sheet1[i].email,
  'password':output.Sheet1[i].password,
  'band':output.Sheet1[i].band,
  'phone':output.Sheet1[i].phone,
  'address':  {  
    'street':output.Sheet1[i].addressstreet,
    'city':output.Sheet1[i].addresscity,
    'country':output.Sheet1[i].addresscountry
  },   
  'notes':output.Sheet1[i].notes,
  'status':0,
  'error':{}
  
  };
  
     $scope.users.push(temp);
 }
 $scope.setdata=1;
  $scope.loaddata=1;
}else{
   $scope.loaddata=1;
      $scope.setdatanotfound=1;
    }
     // out.innerText=str;
  }
}

var url = "uploads/users.xlsx";

var oReq;
function startparsing()
{

if(window.XMLHttpRequest) oReq = new XMLHttpRequest();
else if(window.ActiveXObject) oReq = new ActiveXObject('MSXML2.XMLHTTP.3.0');
else throw "XHR unavailable for your browser";

// document.getElementById('fileurl').innerHTML = '<a href="' + url + '">Download file</a>';

oReq.open("GET", url, true);

if(typeof Uint8Array !== 'undefined') {
  oReq.responseType = "arraybuffer";
  oReq.onload = function(e) {
    if(typeof console !== 'undefined') console.log("onload", new Date());
    var arraybuffer = oReq.response;
    var data = new Uint8Array(arraybuffer);
    var arr = new Array();
    for(var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
    var wb = XLSX.read(arr.join(""), {type:"binary"});
    process_wb(wb);
  };
} else {
  oReq.setRequestHeader("Accept-Charset", "x-user-defined");  
  oReq.onreadystatechange = function() { if(oReq.readyState == 4 && oReq.status == 200) {
    var ff = convertResponseBodyToText(oReq.responseBody);
    if(typeof console !== 'undefined') console.log("onload", new Date());
    var wb = XLSX.read(ff, {type:"binary"});
    process_wb(wb);
  } };
}

oReq.send();
}


}]);
'use strict';
// filter to show raw HTML
angular.module('pinApp')
  .filter('rawHtml', ['$sce', function($sce) {
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  }]);

angular.module('pinApp')
  .filter('reverse', function() {
    return function(items) {
      return items.slice().reverse();
    };
  });


/**
 * filter by this we
 * can do searching with start
 * with alphabatical
 */

angular.module('pinApp')
  .filter('startsWithLetter', function() {
    return function(items, letter) {

      var filtered = [];
      var letterMatch = new RegExp(letter, 'i');
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (letterMatch.test(item.title.substring(0, 1))) {
          filtered.push(item);
        }
      }
      return filtered;
    };
  });

//convert html as text
angular.module('pinApp').
filter('htmlToPlaintext', function() {
  return function(text) {
    return String(text).replace(/<[^>]+>/gm, '');
  };
});
/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 */
angular.module('pinApp').filter('unique', function() {

  return function(items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(
        items)) {
      var hashCheck = {},
        newItems = [];

      var extractValueToCompare = function(item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function(item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]),
              extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
});

'use strict';

angular.module('pinApp')

  /**
   * Removes server error when user updates input
   */
  .directive('mongooseError', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          return ngModel.$setValidity('mongoose', true);
        });
      }
    };
  });

angular
.module('pinApp')
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

angular
.module('pinApp')
.directive('validateEmail', function() {
  var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});

angular.module('pinApp').directive('validationMessage', function () {
        return {
            restrict: 'A',
            priority: 1000,
            require: '^validationTooltip',
            link: function (scope, element, attr, ctrl) {
                ctrl.$addExpression(attr.ngIf || true);
            }
        }
    });

angular.module('pinApp').directive('validationTooltip', ['$timeout',function ($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            require: '^form',
            scope: {},
            template: '<span class="label label-danger span1" ng-show="errorCount > 0">hover to show err</span>',
            controller: function ($scope) {
                var expressions = [];
                $scope.errorCount = 0;
                
                this.$addExpression = function (expr) {
                    expressions.push(expr);
                }
                $scope.$watch(function () {
                    var count = 0;
                    angular.forEach(expressions, function (expr) {
                        if ($scope.$eval(expr)) {
                            ++count;
                        }
                    });
                    return count;

                }, function (newVal) {
                    $scope.errorCount = newVal;
                });

            },
            link: function (scope, element, attr, formController, transcludeFn) {
                scope.$form = formController;

                transcludeFn(scope, function (clone) {
                    var badge = element.find('.label');
                    var tooltip = angular.element('<div class="validationMessageTemplate tooltip-danger" />');
                    tooltip.append(clone);
                    element.append(tooltip);
                    $timeout(function () {
                        scope.$field = formController[attr.target];
                        badge.tooltip({
                            placement: 'right',
                            html: true,
                            title: clone
                        });

                    });
                });
            }

        }
    }]);

'use strict';

angular.module('pinApp')
  .factory('Article', ['$resource',function ($resource) {
    return $resource('/api/articles/:articleId', {articleId: '@_id'},
                     {
                       'save': {method: 'POST', params:{articleId: ''}},
                       'update': {method: 'PUT'},
                       'fresh': {
                         method: 'GET', 
                         params:{articleId: 'new'}
                       }
                     }
                    );
  }]);

'use strict';

angular.module('pinApp')
  .factory('Auth', ['$location','$rootScope','Session','User','$cookieStore','$window',function Auth($location, $rootScope, Session, User, $cookieStore, $window) {
    
    // Get currentUser from cookie
    $rootScope.currentUser = $cookieStore.get('user') || null;
    $cookieStore.remove('user');

    return {
      facebookLogin: function() {
        $window.location.href = '/api/session/facebook/?redirectPath='+($rootScope.redirectPath||'');
      },

      linkedinLogin:function() {
        $window.location.href = '/api/session/linkedin/?redirectPath='+($rootScope.redirectPath||'');
      },
      /**
       * Authenticate user
       * 
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}            
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        
        return Session.save({
          email: user.email,
          password: user.password
        }, function(user) {
          $rootScope.currentUser = user;
          return cb();
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Unauthenticate user
       * 
       * @param  {Function} callback - optional
       * @return {Promise}           
       */
      logout: function(callback) {
        var cb = callback || angular.noop;

        return Session.delete(function() {
            $rootScope.currentUser = null;
            return cb();
          },
          function(err) {
            return cb(err);
          }).$promise;
      },

      /**
        * 
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}            
       */
 
      createUser: function(user, callback) {
        var cb = callback || angular.noop;
        return User.save(user,
          function(user) {
            return cb(user);
          },
          function(err) {
            return cb(err);
          }).$promise;
      },

      resetPassword: function(user) {
        return User.resetPassword(user).$promise;
      },
      resendEmailVerification: function(user) {
        return User.resendEmailVerification(user).$promise;
      },
      recoverPassword: function(user) {
        return User.recoverPassword({
          _id: user._id,
          newPassword: user.newPassword,
          token: user.token
        }).$promise;
      },

      /**
       * Change password
       * 
       * @param  {String}   oldPassword 
       * @param  {String}   newPassword 
       * @param  {Function} callback    - optional
       * @return {Promise}              
       */
      changePassword: function(_id, oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({
          _id: _id,
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       * 
       * @return {Object} user
       */
      currentUser: function() {
        return User.get();
      },

      /**
       * Simple check to see if a user is logged in
       * 
       * @return {Boolean}
       */
      isLoggedIn: function() {
        var user = $rootScope.currentUser;
        return !!user;
      },
      /**
       * Simple check to see if a user is logged in
       * 
       * @return {Boolean}
       */
      isAdmin: function() {
        if($rootScope.currentUser && $rootScope.currentUser.role == 'admin'){
          return true;
        }else{
          return false;
        }
      },

      checkUsername:function(username,callback){
        var cb = callback || angular.noop;
        return User.checkUsername({
          username:username.username},
          function(user) {
            return cb(user);
          },
          function(err) {
            return cb(err);
          }).$promise;
      },
    };
  }]);

'use strict';

angular.module('pinApp')
  .factory('Company', ['$resource',function ($resource) {
    return $resource('/api/companys/:companyId', {articleId: '@_id'},
                     {
                       'save': {method: 'POST', params:{companyId: ''}},
                       'update': {method: 'PUT'},
                       'fresh': {
                         method: 'GET', 
                         params:{articleId: 'new'}
                       }
                     }
                    );
  }]);

'use strict';

angular.module('pinApp')
  .factory('Event', ['$resource',function ($resource) {
    return $resource('/api/events/:articleId', {articleId: '@_id'},
                     {
                       'save': {method: 'POST', params:{articleId: ''}},
                       'update': {method: 'PUT'},
                       'fresh': {
                         method: 'GET', 
                         params:{articleId: 'new'}
                       }
                     }
                    );
  }]);

'use strict';

angular.module('pinApp')
  .factory('Expert', ['$resource',function ($resource) {
    return $resource('/api/expert/:expertId', {articleId: '@_id'},
                     {
                       'save': {method: 'POST', params:{articleId: ''}},
                       'update': {method: 'PUT'},
                       'fresh': {
                         method: 'GET', 
                         params:{expertId: 'new'}
                       }
                     }
                    );
  }]);

'use strict';

angular.module('pinApp')
  .value('messageFormatter', function(date, nick, message) {
    return date.toLocaleTimeString() + ' - ' + 
           nick + ' - ' + 
           message + '\n';
    
  });

'use strict';

angular.module('pinApp')
  .factory('Session', ['$resource',function ($resource) {
    return $resource('/api/session/');
  }]);

'use strict';

angular.module('pinApp')
  .factory('User', ['$resource',function ($resource) {
    return $resource('/api/users/:id', {id: '@_id'}, 
    { //parameters default
      update: {
        method: 'PUT',
      },
      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      },
      query:{
        method: 'GET',
        params: ''
      },
      changePassword: {
        method: 'PUT',
        url: '/api/users/:id/password'
      },
      resetPassword : {
        method: 'POST',
        url: '/api/users/forgot'
      },
      recoverPassword : {
        method: 'POST',
        url : '/api/users/:id/recover'
      },
      resendEmailVerification : {
        method: 'POST',
        url : '/api/users/resend'
      },
      
      sales:{
        method: 'GET',
        url: '/api/users/:id/sales'
      },
      
      all:{
        method: 'GET',
        url: '/api/users/sales/all'
      },
      checkUsername:{
        method:'GET',
        url: '/api/users/checkusername/:username'

      },
      
	});
  }]);

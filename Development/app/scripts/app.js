'use strict';
function adjust_window_code(){
	// if(window.location.pathname == '/register' || window.location.pathname=='/who-is-this-site-for' ||window.location.pathname == '/what-we-do' ||window.location.pathname=='/who-we-are'|| window.location.pathname=='/home'  )
 //  {
 //    // $("footer#footer-bg").css("position","relative").css("bottom","");
 //    $("footer#footer-bg").css("position","absolute").css("bottom",0);
 //  }
 //  else{

 //  $("#container_div").css("min-height",function(){return $(window).height() - $("nav").height() -$("footer").height();})
 //  } 

 if ($("footer").length){

  var append_footer=$("footer").html();
  if (append_footer){
    alert(append_footer);
    $("footer").html("");
    $("#container_div").html(append_footer + $("#container_div").html());
    alert(1);
  }
    //$("#container_div").html(append_footer);
  }

  // }
}
function adjust_window(){
	adjust_window_code();
	// setTimeout(function(){
		
	// },1000);
setTimeout(function(){
  adjust_window_code();
},100);

setTimeout(function(){
  adjust_window_code();
},3000);

}
// var tooltipToggle = angular.module('pinApp').Directives.TooltipToggle.directiveSettings();
// var popoverToggle = angular.module('pinApp').Directives.TooltipToggle.directiveSettings('popover');

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
// .directive(tooltipToggle.directiveName, tooltipToggle.directive)
// .config(tooltipToggle.directiveConfig)
// .directive(popoverToggle.directiveName, popoverToggle.directive)
// .config(popoverToggle.directiveConfig)
.value('nickName', 'anonymous')
.config(function( $compileProvider ) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(http|https|ftp|file|blob):|data:image\//);
})
.config(['$tooltipProvider', function($tooltipProvider){
  $tooltipProvider.setTriggers({
    'mouseenter': 'mouseleave',
    'click': 'click',
    'focus': 'blur',
    'never': 'mouseleave' // <- This ensures the tooltip will go away on mouseleave
  });
}])

.config(function ($routeProvider, $locationProvider, $httpProvider) {
  $routeProvider
  .when('/home', {
    templateUrl: 'partials2/main',
    authenticate: false

  })
  .when('/', {
    templateUrl: 'partials2/main',
    authenticate: false

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
    controller:'SocketCtrl',
    authenticate: true
  })
  .when('/discussion-start', {
    templateUrl: 'partials2/discussion-start',
    controller:'SocketCtrl',
    authenticate: true
  })
  .when('/discussion-detail', {
    templateUrl: 'partials2/chat-detail',
    controller:'SocketCtrl',
    authenticate: true
  })
  .when('/discussion-listing', {
    templateUrl: 'partials2/chat-listing',
    controller: 'SocketCtrl',
    title: 'Chat Listing',
    authenticate: true
  })
  .when('/connect', {
    templateUrl: 'partials2/connect'
  })
  .when('/content-id', {
    templateUrl: 'partials2/content-id'
  })
  .when('/login', {
    templateUrl: 'partials2/login',
    controller:'LoginCtrl',
    authenticate: false
  })
  .when('/register', {
    templateUrl: 'partials2/register',
    controller:'RegisterCtrl',
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

    },
    authenticate: true
  })
  .when('/post-article', {
    templateUrl: 'partials2/post-article',
    controller:'ArticleAddCtrl',
    authenticate: true

  })
  .when('/share', {
    templateUrl: 'partials2/share',
    controller:'ArticleAddCtrl',
    authenticate: true

  })
  .when('/meet', {
    templateUrl: 'partials2/meet',
    authenticate: true

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

    },
    authenticate: true
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
    },
    authenticate: true    
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

.otherwise({
    redirectTo: '/404'
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
.run(function ($rootScope, $location, Auth) {
    // var cartIndex = localStorage.cartIndex;
    // var currentIndex = 3;
    // if (!cartIndex || !(parseInt(cartIndex) >= currentIndex)) {
    //   delete localStorage.cart
    //   localStorage.cartIndex = String(currentIndex);
    // }

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next, current) {

      $rootScope.appTitle = 'PIN';
      if (next.title) {
        $rootScope.appTitle = next.title;
      }
      if ($location.path() !== '/login') {
        $rootScope.redirectPath = $location.path();
      }

      $rootScope.ogTitle = "PIN";
      $rootScope.ogDescription = "PIN Description";
      $rootScope.ogImage = "";
      $rootScope.ogUrl =  "http://"+$location.host()+$location.path();

      if (next.  authenticate == false && Auth.isLoggedIn()) {
        $location.path('/articles/01');
      }

      if (next.  authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }

      
       if (next.  admin && !Auth.isAdmin()) {
          $location.path('/home');
        }

// setTimeout(function(){
//   var bodyHeight = $("body").height();
//   var vwptHeight = $(window).height();
//   var navHeight=$("nav").height();
//   var footerHeight=$("footer").height();
//   var containerHeight=$("#container_div").height();
  
//   // alert(vwptHeight+"--"+bodyHeight+"--"+navHeight+"--"+footerHeight+"--"+containerHeight);
//   // console.log($("footer#footer-bg"));
  
//   if (vwptHeight-footerHeight-navHeight >= containerHeight) {
//       $("footer#footer-bg").css("position","absolute").css("bottom",0);
//     }else{
//       $("footer#footer-bg").css("position","relative").css("bottom","");
//     }
    
//   },1000);

    });
  
    $rootScope.$on('$routeChangeSuccess', function () {
    	// adjust_window()
    	// $(window).resize(
    	// 		function(){
    	// 			adjust_window();
 
    	// 		}
    	

    	// );
    });
  
  });
// .constant('scalingFactor', {tshirt: 12, laptop:6.7478, poster:10.844, canvas: 10.844});
//  $(document).ready(function(){
//  setTimeout(function(){
//   var bodyHeight = $("body").height();
//   var vwptHeight = $(window).height();
//   var navHeight=$("nav").height();
//   var footerHeight=$("footer").height();
//   // alert(vwptHeight+"--"+bodyHeight+"--"+navHeight+"--"+footerHeight);
//   // console.log($("footer#footer-bg"));
//   if (vwptHeight-footerHeight > bodyHeight) {
//     $("footer#footer-bg").css("position","absolute").css("bottom",0);
//   }else{
//     $("footer#footer-bg").css("position","relative").css("bottom","");
//   }
//   },100);
// });
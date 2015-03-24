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
    controller:'SocketCtrl',
    authenticate: true
  })
  .when('/chat-listing', {
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
.when('/settings', {
templateUrl: 'partials2/settings',
// controller: 'SettingsCtrl',
title: 'Settings'
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
      


  setTimeout(function(){
//  var bodyHeight = $("body").height();
//  var vwptHeight = $(window).height();
//  var navHeight=$("nav").height();// header 
//  var footerHeight=$("footer").height();
  //login | noon login g\footerrr
  // alert(vwptHeight+"--"+bodyHeight+"--"+navHeight+"--"+footerHeight);
  // console.log($("footer#footer-bg"));
  
  //$("footer#footer-bg").css("position","relative").css("bottom","");
//  if (vwptHeight-footerHeight > bodyHeight) {
//    //$("footer#footer-bg").css("position","absolute").css("bottom",0);
//  }else{
//    //$("footer#footer-bg").css("position","relative").css("bottom","");
//  }
/*  if ($("#container_div").height() < $("body").height())
		$("#container_div").height(
				$("body").height()-$("footer").height()
				+$("#navbar").height()
			) 
 */ 
  
   
//	  var myWidth = 0, myHeight = 0;
//	  if( typeof( window.innerWidth ) == 'number' ) {
//	    //Non-IE
//	    myWidth = window.innerWidth;
//	    myHeight = window.innerHeight;
//	  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
//	    //IE 6+ in 'standards compliant mode'
//	    myWidth = document.documentElement.clientWidth;
//	    myHeight = document.documentElement.clientHeight;
//	  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
//	    //IE 4 compatible
//	    myWidth = document.body.clientWidth;
//	    myHeight = document.body.clientHeight;
//	  }
//	  $("#container_div").height(myHeight - $("nav").height() - $("footer").height())
	 //;  //772
	 //  //78
	 // //91
	 ////548
	 
	 //min_height=
	 alert(1);
	 console.log($("body").height()); //772  +153
	 console.log($("nav").height()); //78
	 console.log($("footer").height());//91
	 console.log($("#container_div").height());//548
	 console.log(window.outerHeight);//1000   -25
	 console.log(screen.height);//1024    - 50

	 $("#container_div").css("min-height",function(){return 975 - $("nav").height() -2*$("footer").height();})
	 
	 
 
  
  
  },5000);
    });
  
    $rootScope.$on('$routeChangeSuccess', function () {
       // var footerHeight = 0,
       //     footerTop = 0,
       //     $footer = $("#footer-bg");
           
       // positionFooter();
       
       // function positionFooter() {
       
       //          footerHeight = $footer.height();
       //          footerTop = ($(window).scrollTop()+$(window).height()-footerHeight)+"px";
       
       //         if ( ($(document.body).height()+footerHeight) < $(window).height()) {
       //             $footer.css({
       //                  position: "absolute"
       //             }).animate({
       //                  top: footerTop
       //             })
       //         } else {
       //             $footer.css({
       //                  position: "static"
       //             })
       //         }
               
       // }

       // $(window)
       //         .scroll(positionFooter)
       //         .resize(positionFooter);
     




    });
  
  });
// .constant('scalingFactor', {tshirt: 12, laptop:6.7478, poster:10.844, canvas: 10.844});
 $(document).ready(function(){
 setTimeout(function(){
  var bodyHeight = $("body").height();
  var vwptHeight = $(window).height();
  var navHeight=$("nav").height();
  var footerHeight=$("footer").height();
  // alert(vwptHeight+"--"+bodyHeight+"--"+navHeight+"--"+footerHeight);
  // console.log($("footer#footer-bg"));
  if (vwptHeight-footerHeight > bodyHeight) {
    $("footer#footer-bg").css("position","absolute").css("bottom",0);
  }else{
    $("footer#footer-bg").css("position","relative").css("bottom","");
  }
  },100);
});
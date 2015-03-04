'use strict';
angular.module('pinApp')
.controller('ArticleCtrl', function ($scope, Auth,$location, $rootScope,$routeParams,$http,articles) {
  $scope.article={};
  console.log(articles);
  $scope.articles=articles;
  $scope.descriptionLimit=100;
  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.numberOfPage=25;
  $scope.numberOfPages = function(){
    // return Math.ceil($scope.articles.length/$scope.pageSize);                
  };

  $scope.$on('$routeUpdate', function(){
      $scope.currentPage = parseInt($routeParams.pageno) - 1;    
  });

  $scope.changePage = function(){
    $location.path('/articles/'+$scope.currentPage+1);
  };

  if($routeParams.pageno){      
    if($routeParams.pageno > $scope.numberOfPages()){
        $location.search({'page' : $scope.numberOfPages()});
    }
    else if($routeParams.pageno < 1){
      $location.search({'page' : 1});
    }
    $scope.currentPage = parseInt($routeParams.pageno) - 1;
  }
  else{
    $scope.changePage();
  }
  $scope.navigation_control= function(page_no){
    $scope.currentPage = page_no;
    $scope.changePage(); 
  };

  $scope.reset=function(form){
    $scope.form.$setPristine();
  };


  console.log($routeParams.pageno);

  $scope.saveArticle=function(form){
    
    if(form.$valid)
    {
      $scope.article.author=$rootScope.currentUser._id;
      console.log($scope.article.tags);
      console.log($scope.article);
      var original=$scope.article.tags;
      for (var t = 0; t < original.length; t++) {
        $scope.article.tags[t] = original[t].text;
      }
      $scope.articleDone=1;
      $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/articles',data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        $scope.article={};

      }).
      error(function (data, status, headers, config) {
        // ...
        $scope.article={};
      });


    }


  };
  $scope.updateArticle=function(form){
    
    if(form.$valid)
    {
      $scope.article.author=$rootScope.currentUser._id;
      console.log($scope.article.tags);
      console.log($scope.article);
      var original=$scope.article.tags;
      for (var t = 0; t < original.length; t++) {
        $scope.article.tags[t] = original[t].text;
      }
      $scope.articleDone=1;
      $scope.form.$setPristine();
      $http({ method: 'PUT', url: '/api/articles/'+$scope.articles[0]._id,data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        $scope.article={};
      }).
      error(function (data, status, headers, config) {
        // ...
        $scope.article={};
      });


    }


  };
  $scope.editArticle=function(form){
    
    if(form.$valid)
    {
      $scope.article.author=$rootScope.currentUser._id;
      console.log($scope.article.tags);
      console.log($scope.article);
      var original=$scope.article.tags;
      for (var t = 0; t < original.length; t++) {
        $scope.article.tags[t] = original[t].text;
      }
      $scope.articleDone=1;
      $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/articles',data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        $scope.article={};
      }).
      error(function (data, status, headers, config) {
        // ...
        $scope.article={};
      });


    }


  };

  });

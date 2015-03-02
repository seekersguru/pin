'use strict';
angular.module('pinApp')
.controller('ArticleCtrl', function ($scope, Auth,$location, $rootScope,$http) {
  $scope.article={};
  $scope.reset=function(form){
    $scope.form.$setPristine();
  };

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

  });

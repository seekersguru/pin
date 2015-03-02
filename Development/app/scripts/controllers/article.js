'use strict';
angular.module('pinApp')
.controller('ArticleCtrl', function ($scope, Auth,$location, $rootScope) {
  $scope.saveArticle=function(form){
    if(form.$valid)
    {

      console.log($scope.article);

    }


  };

  });

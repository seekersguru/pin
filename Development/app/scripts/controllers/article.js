'use strict';
angular.module('pinApp')
.controller('ArticleCtrl', function ($scope,Auth,$location,$rootScope,$routeParams,$http,articles) {
  $scope.article={};
  $scope.articles=articles;
  $scope.descriptionLimit=100;
  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.numberOfPage=25;

  $scope.comments=articles.comments;
  
  $scope.addComment=function(form){
    
     if(form.$valid)
    {
      var comment={ user: $rootScope.currentUser._id , post: $scope.article.comment};  

      $http({ method: 'POST', url: '/api/comments/'+articles._id,data:comment }).
      success(function (data, status, headers, config) {
        // ...
        comment.posted=new Date(); 
        $scope.comments.push(comment);
        
        $scope.article={};
        
        $scope.form.$setPristine();
        
      }).
      error(function (data, status, headers, config) {
        $scope.article={};
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

});

angular.module('pinApp')
.controller('ArticleViewEditCtrl', function ($scope,Auth,$location,$rootScope,$routeParams,$http,article) {
  
  $scope.article=article;
  
  $scope.saveArticle=function(form){
    //     var str = "abc'sddf khdfkjdf dflkfdlkfd fdkjfdk test#s";
    // alert(str.replace(/[^a-zA-Z ]/g, "").replace(/ /g,"-"));
    if(form.$valid)
    {
      $scope.article.author=$rootScope.currentUser._id;
      console.log($scope.article.tags);
      console.log($scope.article);
      var original=$scope.article.tags;
      for (var t = 0; t < original.length; t++) {
        $scope.article.tags[t] = original[t].text;
      }
      $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/articles',data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        console.log(data);
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
  //update
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
      $http({ method: 'PUT', url: '/api/articles/'+$scope.article._id,data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
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
});

angular.module('pinApp')
.controller('ArticleAddCtrl', function ($scope,Auth,$location,$rootScope,$routeParams,$http,$upload,$timeout) {
  
  $scope.article={};
  // $scope.usingFlash = FileAPI && FileAPI.upload != null;
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
    
    $scope.article.author= $rootScope.currentUser._id;
    
    var original=$scope.article.tags;
    $scope.article.tags=[];
      for (var t = 0; t < original.length; t++) {
        $scope.article.tags[t] = original[t].text;
      }

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
        file.result = response.data;
        $scope.article={};
        $scope.articleDone=1;
        $scope.articleResponse=response.data;
        $scope.form.$setPristine();
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
        $scope.article={};
        $scope.articleDone=1;
        $scope.articleResponse=response.data;
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
      if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
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
    var file=element.files[0];
    $scope.$apply(function($scope) {
      console.log('files:', element.files);
      if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
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
      var original=$scope.article.tags;
      for (var t = 0; t < original.length; t++) {
        $scope.article.tags[t] = original[t].text;
      }
      $scope.form.$setPristine();
      $http({ method: 'POST', url: '/api/articles',data:$scope.article }).
      success(function (data, status, headers, config) {
        // ...
        console.log(data);
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

});

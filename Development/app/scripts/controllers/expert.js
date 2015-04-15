'use strict';

angular.module('pinApp')
.controller('ExpertCtrl', function ($scope, $http, $timeout, $compile, $upload) {

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
      url: '/api/articles',
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
        // $location.path('articles/view/'+response.data.article._id);
        file.result = response.data;
        if($rootScope.currentUser.role == 'admin')
        {
        
            $location.path('/admin').search({ 'family':1});
        
        }
       
        $scope.expert={};
        
      });
    }, function(response) {
      if (response.status > 0)
        $scope.errorMsg = response.status + ': ' + response.data;
         $scope.expert={};
       if($rootScope.currentUser.role == 'admin')
        {
        
            $location.path('/admin').search({ 'articles':1});
        
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

});

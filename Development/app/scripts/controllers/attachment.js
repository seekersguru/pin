'use strict';
angular.module('pinApp')
  .controller('AttachmentCtrl', function($scope, $http, $timeout, $compile, $upload,
    $location, $rootScope) {

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
        url: '/api/attachments',
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
          $location.path('/admin').search({'attachments':''});
          $scope.expert = {};

        });
      }, function(response) {
        if (response.status > 0)
          $scope.errorMsg = response.status + ': ' + response.data;
          $scope.expert = {};
          $location.path('/admin').search({'attachments':''});
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
    };

    $scope.setFiles = function(element) {
      $scope.filearticle = 1;
      var file = element.files[0];
      $scope.$apply(function($scope) {
        console.log('files:', element.files);
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
          url: '/api/attachments',
          data: $scope.article
        }).
        success(function(data, status, headers, config) {
           $location.path('/admin').search({'attachments':''});
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
    };

  });

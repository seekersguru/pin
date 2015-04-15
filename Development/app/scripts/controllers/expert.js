'use strict';

angular.module('pinApp')
.controller('ExpertCtrl', function ($scope, $http, $timeout, $compile, $upload) {

  $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);


$scope.$watch('files', function(files) {
    $scope.formUpload = false;
    if (files != null) {
      for (var i = 0; i < files.length; i++) {
        $scope.errorMsg = null;
        (function(file) {
          generateThumbAndUpload(file);
        })(files[i]);
      }
    }
  });
  

$scope.generateThumb = function(file) {
    if (file != null) {
      if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
        $timeout(function() {
          var fileReader = new FileReader();
          fileReader.readAsDataURL(file);
          fileReader.onload = function(e) {
            $timeout(function() {
              file.dataUrl = e.target.result;
            });
          }
        });
      }
    }
  };

});

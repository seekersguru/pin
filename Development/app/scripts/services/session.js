'use strict';

angular.module('pinApp')
  .factory('Session', ['$resource',function ($resource) {
    return $resource('/api/session/');
  }]);

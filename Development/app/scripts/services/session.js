'use strict';

angular.module('pinApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });

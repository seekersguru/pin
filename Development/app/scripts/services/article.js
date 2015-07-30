'use strict';

angular.module('pinApp')
  .factory('Article', function ($resource) {
    return $resource('/api/articles/:articleId', {articleId: '@_id',category:'@_name'},
                     {
                       'save': {method: 'POST', params:{articleId: ''}},
                       'update': {method: 'PUT'},
                       'fresh': {
                         method: 'GET',
                         params:{articleId: 'new'}
                       },
                       'bycategory': {
                         method: 'GET',
                         params:{category: 'new'}
                       }
                     }
                    );
  });

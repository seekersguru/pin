'use strict';

angular.module('pinApp')
  .factory('Expert', ['$resource',function ($resource) {
    return $resource('/api/expert/:expertId', {articleId: '@_id'},
                     {
                       'save': {method: 'POST', params:{articleId: ''}},
                       'update': {method: 'PUT'},
                       'fresh': {
                         method: 'GET', 
                         params:{expertId: 'new'}
                       }
                     }
                    );
  }]);

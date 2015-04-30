'use strict';

angular.module('pinApp')
  .factory('Company', function ($resource) {
    return $resource('/api/companys/:companyId', {articleId: '@_id'},
                     {
                       'save': {method: 'POST', params:{companyId: ''}},
                       'update': {method: 'PUT'},
                       'fresh': {
                         method: 'GET', 
                         params:{articleId: 'new'}
                       }
                     }
                    );
  });

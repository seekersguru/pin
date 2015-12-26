'use strict';
// filter to show raw HTML
angular.module('pinApp')
.filter('rawHtml', ['$sce', function($sce){
  return function(val) {
    return $sce.trustAsHtml(val);
  };
}]);

angular.module('pinApp')
.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

angular.module('pinApp').
  filter('htmlToPlaintext', function() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
  }
);

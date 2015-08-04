'use strict';
// filter to show raw HTML
angular.module('pinApp')
  .filter('rawHtml', ['$sce', function($sce) {
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


/**
 * filter by this we
 * can do searching with start
 * with alphabatical
 */

angular.module('pinApp')
  .filter('startsWithLetter', function() {
    return function(items, letter) {

      var filtered = [];
      var letterMatch = new RegExp(letter, 'i');
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (letterMatch.test(item.title.substring(0, 1))) {
          filtered.push(item);
        }
      }
      return filtered;
    };
  });

//convert html as text
angular.module('pinApp').
filter('htmlToPlaintext', function() {
  return function(text) {
    return String(text).replace(/<[^>]+>/gm, '');
  };
});
/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 */
angular.module('pinApp').filter('unique', function() {

  return function(items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(
        items)) {
      var hashCheck = {},
        newItems = [];

      var extractValueToCompare = function(item) {
        if (angular.isObject(item) && angular.isString(filterOn)) {
          return item[filterOn];
        } else {
          return item;
        }
      };

      angular.forEach(items, function(item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]),
              extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
});

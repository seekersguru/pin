'use strict';

angular.module('pinApp')

  /**
   * Removes server error when user updates input
   */
  .directive('mongooseError', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          return ngModel.$setValidity('mongoose', true);
        });
      }
    };
  });

angular
.module('pinApp')
.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);

angular
.module('pinApp')
.directive('validateEmail', function() {
  var EMAIL_REGEXP = /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;

  return {
    require: 'ngModel',
    restrict: '',
    link: function(scope, elm, attrs, ctrl) {
      // only apply the validator if ngModel is present and Angular has added the email validator
      if (ctrl && ctrl.$validators.email) {

        // this will overwrite the default Angular email validator
        ctrl.$validators.email = function(modelValue) {
          return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
        };
      }
    }
  };
});

angular.module('pinApp').directive('validationMessage', function () {
        return {
            restrict: 'A',
            priority: 1000,
            require: '^validationTooltip',
            link: function (scope, element, attr, ctrl) {
                ctrl.$addExpression(attr.ngIf || true);
            }
        }
    });

angular.module('pinApp').directive('validationTooltip', function ($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            require: '^form',
            scope: {},
            template: '<span class="label label-danger span1" ng-show="errorCount > 0">hover to show err</span>',
            controller: function ($scope) {
                var expressions = [];
                $scope.errorCount = 0;
                
                this.$addExpression = function (expr) {
                    expressions.push(expr);
                }
                $scope.$watch(function () {
                    var count = 0;
                    angular.forEach(expressions, function (expr) {
                        if ($scope.$eval(expr)) {
                            ++count;
                        }
                    });
                    return count;

                }, function (newVal) {
                    $scope.errorCount = newVal;
                });

            },
            link: function (scope, element, attr, formController, transcludeFn) {
                scope.$form = formController;

                transcludeFn(scope, function (clone) {
                    var badge = element.find('.label');
                    var tooltip = angular.element('<div class="validationMessageTemplate tooltip-danger" />');
                    tooltip.append(clone);
                    element.append(tooltip);
                    $timeout(function () {
                        scope.$field = formController[attr.target];
                        badge.tooltip({
                            placement: 'right',
                            html: true,
                            title: clone
                        });

                    });
                });
            }

        }
    });

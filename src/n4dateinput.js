"use strict";

;
(function(ng) {
  ng
    .module('n4DateInput', [])
    .directive('n4DateInput', [
      '$filter',
      function($filter) {
        return {
          require: 'ngModel',
          restrict: 'EAC',
          replace: true,
          template: '<input type="text">',
          link: function(scope, element, attrs, controller) {
            var formatValue = function(value) {
                if (!value) {
                  return '';
                }

                var numbers, regexp, date,
                  returnValue = function(dateValue) {
                    return isNaN(dateValue) ? '' : $filter('date')(dateValue, 'dd/MM/yyyy');
                  };

                if (value instanceof Date) {
                  return returnValue(value);
                }

                numbers = value.replace(/\D/gi, '');

                regexp = new RegExp('^(\\d{2})(\\d{2})(\\d{2})$', 'gi');
                if (regexp.test(numbers)) {
                  date = new Date(numbers.replace(regexp, '$2/$1/' + (attrs.century || '20') + '$3'));
                  return returnValue(date);
                }

                regexp = new RegExp('^(\\d{2})(\\d{2})(\\d{4})$', 'gi');
                if (regexp.test(numbers)) {
                  date = new Date(numbers.replace(regexp, '$2/$1/$3'));
                  return returnValue(date);
                }

                regexp = new RegExp('^\\w{3} \\w{3} \\d{1,2} \\d{4} .*$', 'gi');
                if (regexp.test(value)) {
                  return returnValue(new Date(value));
                }

                return value;
              },
              parseValue = function(value) {
                var formattedValue = formatValue(value),
                  regexp = new RegExp('^(\\d{2})/(\\d{2})/(\\d{4})$', 'gi');

                return regexp.test(formattedValue) ? new Date(formattedValue.replace(regexp, '$2/$1/$3')) : null;
              };

            if (!element.attr('placeholder')) {
              element.attr('placeholder', '00/00/0000');
            }
            element.attr('maxlength', 10);

            controller.$formatters.push(formatValue);
            controller.$parsers.push(parseValue);
          }
        };
      }
    ]);
}(angular))

import angular from 'angular';

(function() {
    'use strict';

    angular
        .module('app')
        .filter('titlecase', titlecase)
        .filter('handleStatus', handleStatus)
        .filter('handleGlyphicon', handleGlyphicon)
        .filter('handleSpan', handleSpan)
        .filter('handleInvoiceStatus', handleInvoiceStatus)
        .filter('displaynone', displaynone)
        .filter('displayurlimg', displayurlimg)
        .filter('cut', cut)
        .filter('handlefetch', handlefetch)
        .filter('handleplural', handleplural)
        .filter('convertMonthNameToNumber', convertMonthNameToNumber)
        .filter('filterTree', filterTree)
        .filter('filterBranch', filterBranch)
        .filter('filterTreeAttributeFields', filterTreeAttributeFields)
        .filter('applyValue', applyValue)
        .filter('parse', parse)
        .filter('filterTrimEmptyNull', filterTrimEmptyNull)
        .filter('filterAttributes', filterAttributes)
        .filter('filterMultipleAttributes', filterMultipleAttributes)
        .filter('hasTag', hasTag)
        .filter('passwordMeter', passwordMeter)
        .filter('passwordText', passwordText)
        .filter('passwordClass', passwordClass)
        .filter('handleAttributesDisplay', handleAttributesDisplay)
        .filter('handleAttributesDisplayParent', handleAttributesDisplayParent)
        .filter('limitHtml', limitHtml)
        .filter('bytes', bytes)
        .filter('epochToDate', epochToDate)
        .filter('middleInitial', middleInitial)
        .filter('convertPcc', convertPcc)
        .filter('handleThreshold', handleThreshold)
        .filter('handleStores', handleStores)
        .filter('handlePccDisplay', handlePccDisplay);

    function handlefetch($sce) {
        return function(input, text, text_muted) {
            if (typeof text_muted == 'undefined') text_muted = true;

            var input_state = input
                ? 'fa fa-spinner fa-pulse'
                : !input ? '' : '';
            var input_text = input_state
                ? ' Loading ' + text
                : !input_state ? 'No ' + text + ' Found' : '';

            var att =
                "<em ng-class=\"{'text-muted': " +
                text_muted +
                '}"><i class="' +
                input_state +
                '"></i>' +
                input_text +
                '</em>';
            return $sce.trustAsHtml(att);
        };
    }

    function titlecase() {
        return function(input) {
            if (input == null) return '';
            else
                return input
                    .replace(/_/g, ' ')
                    .replace(/\w\S*/g, function(txt) {
                        return (
                            txt.charAt(0).toUpperCase() +
                            txt.substr(1).toLowerCase()
                        );
                    });
        };
    }

    function handleStatus($sce) {
        return function(input) {
            var class_status =
                input == 'APPROVED' || input == 'ACTIVE'
                    ? 'success'
                    : input == 'PENDING'
                      ? 'primary'
                      : input == 'BANNED'
                        ? 'warning'
                        : input == 'DISAPPROVED' || input == 'DEACTIVATED'
                          ? 'danger'
                          : 'danger';

            var att =
                '<span class="label label-' +
                class_status +
                '">' +
                input +
                '</span>';
            return $sce.trustAsHtml(att);
        };
    }

    function handleGlyphicon($sce) {
        return function(input) {
            var input_state = input
                ? 'glyphicon glyphicon-ok text-success'
                : !input
                  ? 'glyphicon glyphicon-remove text-danger'
                  : 'glyphicon glyphicon-remove text-danger';

            var att = '<span class="' + input_state + '"></span>';
            return $sce.trustAsHtml(att);
        };
    }

    function handleSpan($sce) {
        return function(input) {
            var input_state = input
                ? 'label label-info'
                : !input ? 'label label-success' : 'label label-danger';
            var input_text = input ? 'Yes' : !input ? 'No' : 'No';

            var att =
                '<span class="' + input_state + '">' + input_text + '</span>';
            return $sce.trustAsHtml(att);
        };
    }

    function handleInvoiceStatus($sce) {
        return function(input) {
            var input_state =
                input == 1
                    ? 'PENDING'
                    : input == 2 ? 'PAID' : input == 3 ? 'CANCELLED' : '';

            return input_state;
        };
    }

    function displaynone($sce) {
        return function(input, pre, sup) {
            return $sce.trustAsHtml(
                input || input === 0
                    ? (pre ? pre : '') + input + (sup ? sup : '')
                    : "<span class='text-italic low-opacity'>None</span>"
            );
        };
    }

    function displayurlimg($sce) {
        return function(input) {
            return $sce.trustAsHtml(
                input
                    ? "<img class='img-repsonsive double-border'  style='width:100%' src='" +
                      input +
                      "' class='responsive' />"
                    : ''
            );
        };
    }

    function cut() {
        return function(value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    if (
                        value.charAt(lastspace - 1) == '.' ||
                        value.charAt(lastspace - 1) == ','
                    ) {
                        lastspace = lastspace - 1;
                    }
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || ' …');
        };
    }

    function handleplural() {
        return function(input, sup) {
            var plural = sup.toUpperCase();

            if (input > 1)
                if (plural.slice(-2) == 'Y')
                    plural = plural.slice(0, -1) + 'IES';
                else if (plural.slice(-1) == 'S') plural = plural + 'ES';
                else if (plural.slice(-1) != 'S') plural = plural + 'S';

            return plural;
        };
    }

    function convertMonthNameToNumber() {
        return function(monthName) {
            var myDate = new Date(monthName + ' 1, 2000');
            var monthDigit = myDate.getMonth();
            return isNaN(monthDigit) ? 0 : monthDigit + 1;
        };
    }

    function filterTree() {
        return function(items, objSearch, field_name) {
            var filtered = [];
            var recursiveFilter = function(items, objSearch, field_name) {
                for (var name in objSearch) {
                    var property_name = name;
                    var valueSearch = objSearch[name];
                }

                angular.forEach(items, function(item) {
                    if (item[property_name] == valueSearch) {
                        filtered.push(item);
                    }
                    if (
                        angular.isArray(item[field_name]) &&
                        item[field_name].length > 0
                    ) {
                        recursiveFilter(
                            item[field_name],
                            objSearch,
                            field_name
                        );
                    }
                });
            };
            recursiveFilter(items, objSearch, field_name);
            return filtered;
        };
    }

    function filterBranch($filter) {
        return function(items, objSearch, field_name) {
            var filtered = [];
            var return_f = [];
            var recursiveFilter = function(
                return_f,
                property_name,
                valueSearch
            ) {
                var return_e = $filter('filterTree')(
                    items,
                    { [property_name]: return_f.parentId },
                    field_name
                )[0];
                if (return_e) {
                    delete return_e[field_name];
                    filtered.unshift(return_e);
                }

                if (return_f.parentId)
                    recursiveFilter(return_e, property_name, valueSearch);
            };

            for (var name in objSearch) {
                var property_name = name;
                var valueSearch = objSearch[name];
            }

            if (valueSearch) {
                return_f = $filter('filterTree')(
                    items,
                    { [property_name]: valueSearch },
                    field_name
                )[0];
                if (!return_f) {
                    return_f = $filter('filterTree')(
                        items,
                        { [property_name]: parseInt(valueSearch) },
                        field_name
                    )[0];
                }

                delete return_f[field_name];
                filtered.unshift(return_f);
                recursiveFilter(return_f, property_name, valueSearch);
            }

            return filtered;
        };
    }

    function filterTreeAttributeFields($filter) {
        return function(items, field_names, childrenProperty) {
            var recursiveFilter = function(
                items,
                field_names,
                childrenProperty
            ) {
                angular.forEach(items, function(item) {
                    //console.log(item);
                    for (var f in field_names) {
                        var field_name_val = field_names[f];
                        item[f] = $filter('filterAttributes')(
                            item,
                            field_name_val
                        ).value;
                    }

                    recursiveFilter(
                        item[childrenProperty],
                        field_names,
                        childrenProperty
                    );
                });
            };
            recursiveFilter(items, field_names, childrenProperty);

            return items;
        };
    }

    function applyValue() {
        return function(input, pre, sup) {
            if (pre == 'useInLayeredNavigation') {
                var output =
                    input === 0
                        ? 'No'
                        : input === 1
                          ? 'Filterable (with results)'
                          : input === 2 ? 'Filterable (no results)' : 'No';
                return output;
            } else if (pre == 'isActive') {
                var output =
                    input === 0
                        ? 'Inactive'
                        : input === 1 ? 'Active' : 'Inactive';
                return output;
            } else {
                var output = input === 0 ? 'No' : input === 1 ? 'Yes' : sup;
                return output;
            }
        };
    }

    function parse($parse) {
        return function(expression, scope) {
            return $parse(expression)(scope);
        };
    }

    function filterTrimEmptyNull() {
        return function(test_array) {
            var index = -1,
                arr_length = test_array ? test_array.length : 0,
                resIndex = -1,
                result = [];

            while (++index < arr_length) {
                var value = test_array[index];

                if (value) {
                    result[++resIndex] = value;
                }
            }

            return result;
        };
    }

    function filterAttributes($filter) {
        return function(
            item,
            value,
            propertyParentNameAttribute,
            propertyChildNameAttribute
        ) {
            if (typeof propertyParentNameAttribute == 'undefined') {
                propertyParentNameAttribute = 'attributes';
                if (typeof propertyChildNameAttribute == 'undefined')
                    propertyChildNameAttribute = 'attributeCode';
            }

            if (item) {
                var filtered = $filter('filter')(
                    item[propertyParentNameAttribute],
                    { [propertyChildNameAttribute]: value },
                    true
                );

                if (!filtered) {
                    return {};
                }

                if (filtered.length == 0) {
                    return {};
                }

                if (filtered) return filtered[0];
                else return filtered;
            }

            // if (filtered.length == 1)
            //     return filtered[0];
            // else if (filtered.length > 1)
            //     return filtered;
        };
    }

    function filterMultipleAttributes($filter) {
        return function(
            item,
            arrayValues,
            propertyParentNameAttribute,
            propertyChildNameAttribute
        ) {
            var filtered_object = {};
            var attrName = '';

            for (var i = 0; i < arrayValues.length; i++) {
                attrName = arrayValues[i];
                filtered_object[attrName] = $filter('filterAttributes')(
                    item,
                    attrName,
                    propertyParentNameAttribute,
                    propertyChildNameAttribute
                );
            }

            return filtered_object;
        };
    }

    function hasTag() {
        return function(items, property_name, value) {
            var filtered = [];
            angular.forEach(items, function(el) {
                if (
                    el[property_name] &&
                    (el[property_name].indexOf(value) > -1 ||
                        el[property_name].indexOf(value.toString()) > -1 ||
                        el[property_name].indexOf(parseInt(value)) > -1)
                ) {
                    filtered.push(el);
                }
            });
            return filtered;
        };
    }

    function passwordMeter($sce) {
        return function(password) {
            var tests = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^A-Z-0-9]/i];
            if (password == null) return 0;
            var strength = 0;
            if (password.strength < 6) return 0;
            for (var i in tests) if (tests[i].test(password)) strength++;
            return strength;
        };
    }

    function passwordText($sce) {
        return function(input) {
            var text;
            if (input <= 1) text = 'Weak';
            else if (input <= 2) text = 'Weak';
            else if (input == 3) text = 'Moderate';
            else if (input >= 4) text = 'Strong';
            return text;
        };
    }

    function passwordClass() {
        return function(input) {
            var class_status =
                input >= 4
                    ? 'success'
                    : input == 3 ? 'info' : input <= 1 ? 'warning' : 'warning';
            return class_status;
        };
    }

    function handleAttributesDisplay() {
        return function(data, attributeArrObjName) {
            if (!attributeArrObjName) attributeArrObjName = 'attributes';
            var attributeArrValuesName = attributeArrObjName + '_values';

            for (var i = 0; i < data.length; i++) {
                data[i][attributeArrValuesName] =
                    data[i][attributeArrValuesName] || {};
                data[i][attributeArrObjName] =
                    data[i][attributeArrObjName] || [];
                for (var a = 0; a < data[i][attributeArrObjName].length; a++) {
                    data[i][attributeArrValuesName][
                        data[i][attributeArrObjName][a].attributeCode
                    ] =
                        data[i][attributeArrObjName][a].value;
                }
            }
            return data;
        };
    }

    function handleAttributesDisplayParent() {
        return function(data, attributeArrObjName) {
            if (!attributeArrObjName) attributeArrObjName = 'attributes';
            for (var i = 0; i < data.length; i++) {
                data[i][attributeArrObjName] =
                    data[i][attributeArrObjName] || [];
                for (var a = 0; a < data[i][attributeArrObjName].length; a++) {
                    data[i][data[i][attributeArrObjName][a].attributeCode] =
                        data[i][attributeArrObjName][a].value;
                }
            }
            return data;
        };
    }

    function limitHtml() {
        return function(text, limit, char) {
            var changedString = String(text)
                .replace(/<[^>]+>/gm, '')
                .replace(/\n/g, ' ')
                .replace(/\r/g, ' ');
            var length = changedString.length;

            if (!char) char = '...';

            return changedString.length > limit
                ? changedString.substr(0, limit - 1) + ' ' + char
                : changedString;
        };
    }

    function bytes() {
        return function(bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (
                (bytes / Math.pow(1024, Math.floor(number))).toFixed(
                    precision
                ) +
                ' ' +
                units[number]
            );
        };
    }

    function epochToDate() {
        return function(int_num) {
            console.log(int_num);
            return new Date(int_num * 1000);
        };
    }

    function middleInitial() {
        return function(value) {
            value = value || '';
            var uppercase = value ? value[0].toUpperCase() : '';
            return uppercase ? uppercase + '.' : '';
        };
    }

    function convertPcc() {
        return function(value, pre) {
            var phone_value = value ? pre + value.substr(-10) : '';
            return phone_value;
        };
    }

    // for ashbringer only

    function handleThreshold() {
        return function(value) {
            var threshold = value > 0 ? '+' + value : '';
            return threshold;
        };
    }

    function handleStores($filter) {
        return function(value, data, key) {
            if (data)
                return $filter('filter')(data, { groupId: value }, true)[0][
                    key
                ];
        };
    }

    function handlePccDisplay ($sce) {
        return function (value, pre, suf) { 
            if (value) {
                return (value) ? pre + value.substr(-10) : '';
            } else {
                return $sce.trustAsHtml("<span class='text-italic low-opacity'>None</span>");
            }
        };
    } 

})();

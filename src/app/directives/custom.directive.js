import angular from 'angular';

(function() {
    'use strict';

    angular
        .module('app')
        .directive('uiSrefIf', uiSrefIf)
        .directive('compileTemplate', compileTemplate)
        .directive('ngModelForce', ngModelForce)
        // .directive('checkList', checkList)
        // .directive('checkListForce', checkListForce)
        .directive('outsideClick', outsideClick)
        .directive('attachNgModelToFormly', attachNgModelToFormly)
        .directive('compileHtml', compileHtml)
        .directive('removeHideData', removeHideData)
        .directive('complexTable', complexTable)
        .directive('resize', resize)
        .directive('dynamicForce', dynamicForce)
        .directive('toggleClass', toggleClass)
        .directive('toggleParentClass', toggleParentClass)
        .directive('resizeRemoveClass', resizeRemoveClass)
        .directive('accessibleForm', accessibleForm)
        .directive('ngMouseWheelUp', ngMouseWheelUp)
        .directive('ngMouseWheelDown', ngMouseWheelDown)
        .directive('compareTo', compareTo)
        .directive('zxPasswordMeter', zxPasswordMeter)
        .directive('toggleChoose', toggleChoose)
        .directive('img', img)
        .directive('anyOtherClick', anyOtherClick)
        .directive('maxSizeResponsive', maxSizeResponsive)
        .directive('form', formDirective)
        .directive('urlBlobDetails', urlBlobDetails)
        .directive('checkElementListener', checkElementListener)
        .directive('rzTickValue', rzTickValue)
        .directive('customValidationFunction', customValidationFunction);
    // .directive('mainImage', mainImage);

    // function uiSrefIf($compile) {
    //     return {
    //         link: function($scope, $element, $attrs) {
    //             var uiSrefVal = $attrs.uiSrefVal,
    //                 uiSrefIf = $attrs.uiSrefIf,
    //                 uiSrefNgBind = $attrs.uiSrefNgBind;

    //             $element.removeAttr('ui-sref-if');
    //             $element.removeAttr('ui-sref-val');

    //             $scope.$watch(
    //                 function() {
    //                     return $scope.$eval(uiSrefIf);
    //                 },
    //                 function(bool) {
    //                     if (bool) {
    //                         $element.attr('ui-sref', uiSrefVal);
    //                         $element.removeClass('no_style');
    //                     } else {
    //                         $element.attr('class', 'no_style');
    //                         $element.removeAttr('ui-sref');
    //                         $element.removeAttr('href');
    //                     }

    //                     if (uiSrefNgBind)
    //                         $element.attr(
    //                             'ng-bind-html',
    //                             uiSrefNgBind + ' | displaynone'
    //                         );

    //                     $compile($element)($scope);
    //                 }
    //             );
    //         }
    //     };
    // }

    function uiSrefIf($compile) {
        var directive = {
            restrict: 'A',
            link: linker
        };
        return directive;
        function linker(scope, elem, attrs) {
            elem.removeAttr('ui-sref-if');
            $compile(elem)(scope);
            scope.$watch(attrs.condition, function(bool) {
                if (bool) {
                    elem.attr('ui-sref', attrs.value);
                    elem.removeClass('no-link-decorate');
                } else {
                    elem.removeAttr('ui-sref');
                    elem.removeAttr('href');
                    elem.addClass('no-link-decorate');
                }
                $compile(elem)(scope);
            });
        }
    }

    function compileTemplate($compile, $parse, $sce) {
        return {
            link: function(scope, element, attr) {
                var parsed = $parse($sce.trustAsHtml(attr.ngBindHtml));
                function getStringValue() {
                    return (parsed(scope) || '').toString();
                }

                //Recompile if the template changes
                scope.$watch(getStringValue, function() {
                    $compile(element, null, -9999)(scope); //The -9999 makes it skip directives so that we do not recompile ourselves
                });
            }
        };
    }

    function ngModelForce($compile) {
        return {
            link: function($scope, $element, $attrs) {
                var ngmodelforce = $attrs.ngModelForce,
                    ngmodelobj = $attrs.ngModelObj,
                    ngmodelname = $attrs.ngModelName;
                $element.removeAttr('ng-model-force');
                $element.removeAttr('ng-model-obj');
                $element.removeAttr('ng-model-name');

                $scope.$watch(
                    function() {
                        return $scope.$eval(ngmodelforce);
                    },
                    function(bool) {
                        if (bool) {
                            var new_model = ngmodelobj + '.' + ngmodelname;
                            $element.attr('ng-model', new_model);
                        }
                        $compile($element)($scope);
                    }
                );
            }
        };
    }

    function dynamicForce($compile) {
        return {
            scope: {
                dynamicAttr: '@dynamicAttr',
                dynamicValue: '=dynamicValue'
            },
            link: function($scope, $element, $attrs) {
                var dynamicforce = $attrs.dynamicForce;

                $element.removeAttr('dynamic-force');
                $element.removeAttr('dynamic-attr');
                $element.removeAttr('dynamic-value');

                $scope.$watch(
                    function() {
                        return $scope.$eval(dynamicforce);
                    },
                    function(bool) {
                        if (bool) {
                            $element.attr(
                                $scope.dynamicAttr,
                                $scope.dynamicValue
                            );
                        }
                        $compile($element)($scope);
                    }
                );
            }
        };
    }

    // function checkListForce ($compile) {
    //      return {
    //         link: function($scope, $element, $attrs) {

    //             var checklistforce = $attrs.checkListForce,
    //                 checklistobj   = $attrs.checkListObj,
    //                 checklistname  = $attrs.checkListName;

    //             $element.removeAttr('check-list-force');
    //             $element.removeAttr('check-list-obj');
    //             $element.removeAttr('check-list-name');

    //             $scope.$watch(
    //                 function(){
    //                     return $scope.$eval(checklistforce);
    //                 },
    //                 function(bool) {
    //                     if (bool) {
    //                         var new_model = checklistobj + '.' + checklistname;
    //                         $element.attr('check-list', new_model);
    //                     }
    //                     $compile($element)($scope);
    //                 }
    //             );
    //         }
    //     };
    // }

    // function checkList() {
    //   return {
    //         scope: {
    //           list: '=checkList',
    //           value: '@'
    //         },
    //         link: function(scope, elem, attrs) {
    //           var handler = function(setup) {
    //             var checked = elem.prop('checked');
    //             if (typeof scope.list === 'undefined') scope.list = [];
    //             var index = scope.list.indexOf(scope.value);

    //             if (checked && index == -1) {
    //               if (setup) elem.prop('checked', false);
    //               else scope.list.push(scope.value);
    //             } else if (!checked && index != -1) {
    //               if (setup) elem.prop('checked', true);
    //               else scope.list.splice(index, 1);
    //             }

    //             if (scope.list.length==0) delete scope.list;
    //           };

    //           var setupHandler = handler.bind(null, true);
    //           var changeHandler = handler.bind(null, false);

    //           elem.on('change', function() {

    //             scope.$apply(changeHandler);
    //           });
    //           scope.$watch('list', setupHandler, true);
    //         }
    //   };
    // }

    function customBlur() {
        return {
            restrict: 'A',
            scope: {
                customBlur: '='
            },
            link: function(scope, element, attr) {
                element.on('click', function(event) {
                    var targetAttr = angular
                        .element(event.target)
                        .attr('custom-blur');

                    //.log(targetAttr);
                    if (typeof targetAttr !== 'undefined' && scope.customBlur) {
                        scope.$apply(function() {
                            scope.customBlur = false;
                        });
                    }
                });

                element.bind('blur', function() {
                    scope.$apply(attrs.uiBlur);
                    //console.log('blur');
                });
            }
        };
    }

    function anyOtherClick($document, $parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attr, controller) {
                var anyOtherClickFunction = $parse(attr.anyOtherClick);
                var documentClickHandler = function(event) {
                    var eventOutsideTarget =
                        element[0] !== event.target &&
                        0 === element.find(event.target).length;
                    if (eventOutsideTarget) {
                        scope.$apply(function() {
                            anyOtherClickFunction(scope, {});
                        });
                    }
                };

                $document.on('click', documentClickHandler);
                scope.$on('$destroy', function() {
                    $document.off('click', documentClickHandler);
                });
            }
        };
    }

    function outsideClick($document, $parse) {
        return {
            restrict: 'A',
            scope: {
                customBlur: '='
            },
            link: function(scope, element, attrs) {
                var scopeExpression = attrs.outsideClick;

                function elementClick(e) {
                    e.stopPropagation();
                    scope.$apply(function() {
                        scope.customBlur = true;
                    });
                }

                function documentClick(e) {
                    scope.$apply(function() {
                        scope.customBlur = false;
                    });
                }

                element.on('click', elementClick);
                $document.on('click', documentClick);

                // remove event handlers when directive is destroyed
                scope.$on('$destroy', function() {
                    element.off('click', elementClick);
                    $document.off('click', documentClick);
                });
            }
        };
    }

    function attachNgModelToFormly() {
        return {
            require: 'ngModel',
            link: function(scope, el, attrs, ngModelController) {
                scope.options.formControl = ngModelController;
                scope.fc = ngModelController;
            }
        };
    }

    function compileHtml($compile) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(
                    function() {
                        //console.log(attrs.compileHtml);
                        return scope.$eval(attrs.compileHtml);
                    },
                    function(value) {
                        element.html(value);
                        $compile(element.contents())(scope);
                    }
                );
            }
        };
    }

    function rzTickValue($compile, $interpolate) {
        return {
            restrict: 'C',
            link: function(scope, element, attrs) {
                var interHtml = $interpolate(element.text())(scope);
                element.html(interHtml);
                // scope.$watch(function () {
                //     //console.log(attrs.compileHtml);
                //     return scope.$eval(attrs.compileHtml);
                // }, function (value) {
                //     element.html(value);
                //     $compile(element.contents())(scope);
                // });
            }
        };
    }

    function removeHideData($compile) {
        return {
            restrict: 'A',
            scope: {
                ngIfCond: '=ngIfCond',
                ngIfExpressionText: '@ngIf',
                scopeData: '=scopeData',
                modelData: '=modelData'
            },
            link: function(scope, element, attrs) {
                scope.$watch('ngIfCond', function(value) {
                    if (!value) {
                        for (
                            let i = 0;
                            i < scope.scopeData.removeHideData.length;
                            i++
                        )
                            GLOBAL.getModel(
                                scope.modelData,
                                scope.scopeData.removeHideData[i],
                                '_delete_'
                            );

                        element.addClass('displaynone');
                    } else {
                        element.removeClass('displaynone');
                    }
                });
            }
        };
    }

    function complexTable() {
        return {
            restrict: 'EA',
            scope: {
                trClick: '&',
                goTo: '&',
                prev: '&',
                next: '&',
                updateRows: '&',
                applyFilters: '&',
                resetFilter: '&',
                searchFilter: '&',
                totalValue: '&',
                exportData: '&',
                options: '=options',
                vm: '=vm',
                // calendar
                disabled: '=disabled',
                fromDate: '&',
                toDate: '&'
            },
            template: require('./html/complex-table-directive.html'),
            controller: function($scope) {
                var viewWatch = $scope.$watch('vm.search', function(
                    currentValue,
                    oldValue
                ) {
                    if (currentValue && !oldValue) {
                        $scope.vm.search_old = angular.copy($scope.vm.search);
                        viewWatch(); // Stops the watch
                    }
                });

                $scope.reset = model => {
                    GLOBAL.getModel(
                        $scope,
                        model,
                        angular.copy($scope.vm.search_old)
                    );
                };
            }
        };
    }

    function resize($window) {
        return function(scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function() {
                return {
                    h: w[0].innerHeight,
                    w: w[0].innerWidth
                };
            };
            scope.$watch(
                scope.getWindowDimensions,
                function(newValue, oldValue) {
                    scope.windowHeight = newValue.h;
                    scope.windowWidth = newValue.w;

                    scope.style = function() {
                        return {
                            height: newValue.h - 100 + 'px',
                            width: newValue.w - 100 + 'px'
                        };
                    };
                },
                true
            );

            w.bind('resize', function() {
                scope.$apply();
            });
        };
    }

    function resizeRemoveClass($window) {
        return function(scope, element, attrs) {
            var w = angular.element($window);
            scope.getWindowDimensions = function() {
                return {
                    h: w[0].innerHeight,
                    w: w[0].innerWidth
                };
            };
            scope.$watch(
                scope.getWindowDimensions,
                function(newValue, oldValue) {
                    element.removeClass(attrs.resizeRemoveClass);
                },
                true
            );
        };
    }

    function toggleClass($window) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    element.toggleClass(attrs.toggleClass);
                });
            }
        };
    }

    function toggleParentClass($window, $document) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('click', function() {
                    var w = angular.element($window);
                    if (w[0].innerWidth < 768)
                        element.parent().toggleClass(attrs.toggleParentClass);
                });
            }
        };
    }

    function accessibleForm() {
        return {
            restrict: 'A',
            link: function(scope, elem) {
                // set up event handler on the form element
                elem.on('submit', function() {
                    // find the first invalid element
                    var firstInvalid = elem[0].querySelector('.ng-invalid');

                    // if we find one, set focus
                    if (firstInvalid) {
                        firstInvalid.focus();
                    }
                });
            }
        };
    }

    function ngMouseWheelUp() {
        return function(scope, element, attrs) {
            element.bind('DOMMouseScroll mousewheel onmousewheel', function(
                event
            ) {
                // cross-browser wheel delta
                event = window.event || event; // old IE support
                var delta = Math.max(
                    -1,
                    Math.min(1, event.wheelDelta || -event.detail)
                );

                if (delta > 0) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngMouseWheelUp);
                    });

                    // for IE
                    event.returnValue = false;
                    // for Chrome and Firefox
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                }
            });
        };
    }

    function ngMouseWheelDown() {
        return function(scope, element, attrs) {
            element.bind('DOMMouseScroll mousewheel onmousewheel', function(
                event
            ) {
                // cross-browser wheel delta
                event = window.event || event; // old IE support
                var delta = Math.max(
                    -1,
                    Math.min(1, event.wheelDelta || -event.detail)
                );

                if (delta < 0) {
                    scope.$apply(function() {
                        scope.$eval(attrs.ngMouseWheelDown);
                    });

                    // for IE
                    event.returnValue = false;
                    // for Chrome and Firefox
                    if (event.preventDefault) {
                        event.preventDefault();
                    }
                }
            });
        };
    }

    function compareTo() {
        return {
            require: 'ngModel',
            scope: {
                otherModelValue: '=compareTo'
            },
            link: function(scope, element, attributes, ngModel) {
                ngModel.$validators.compareTo = function(modelValue) {
                    return modelValue == scope.otherModelValue;
                };

                scope.$watch('otherModelValue', function() {
                    ngModel.$validate();
                });
            }
        };
    }

    function zxPasswordMeter() {
        return {
            scope: {
                value: '@',
                max: '@?'
            },
            template: `
                <uib-progressbar value="value" max="max" type="{{ type }}">
                    <span ng-class="{'text-black': value == 0}">{{ text | titlecase }}</span>
                </uib-progressbar>
            `,
            link: function(scope) {
                scope.type = 'danger';
                scope.max = !scope.max ? 100 : scope.max;
                scope.$watch('value', function(newValue) {
                    var strenghPercent = newValue / scope.max;

                    if (strenghPercent === 0) {
                        scope.text = 'Awful';
                    } else if (strenghPercent <= 0.25) {
                        scope.type = 'danger';
                        scope.text = 'Weak';
                    } else if (strenghPercent <= 0.5) {
                        scope.type = 'warning';
                        scope.text = 'Moderate';
                    } else if (strenghPercent <= 0.75) {
                        scope.type = 'warning';
                        scope.text = 'Strong';
                    } else {
                        scope.type = 'success';
                        scope.text = 'Perfect';
                    }
                });
            }
        };
    }

    function toggleChoose($timeout) {
        // Constants
        var TOGGLE_CLASS = 'active-attributes';
        var DEF_GROUPNAME = 'default';

        // Variables - Pivate;
        var groups = {};

        // DDO
        return {
            scope: {
                toggleModel: '=toggleModel',
                toggleClass: '@toggleClass'
            },
            restrict: 'A',
            link: togglePostLink
        };

        // Functions - Definitions
        function addElement(groupName, elem) {
            var list = groups[groupName] || (groups[groupName] = []);
            if (list.indexOf(elem) === -1) list.push(elem);
        }

        function removeElement(groupName, elem) {
            var list = groups[groupName] || [];
            var idx = list.indexOf(elem);
            if (idx !== -1) list.splice(idx, 1);
        }

        function setActive(groupName, elem, scope) {
            $timeout(function() {
                delete scope.toggleModel;

                elem.toggleClass(scope.toggleClass || TOGGLE_CLASS);
                angular.forEach(groups[groupName], function(el) {
                    if (!angular.equals(el, elem))
                        el.removeClass(scope.toggleClass || TOGGLE_CLASS);
                    else {
                        if (elem.hasClass(scope.toggleClass || TOGGLE_CLASS)) {
                            var data = elem[0].attributes.data;
                            if (data) scope.toggleModel = data.value;
                        }
                    }
                });

                scope.$digest();
            }, 10);
        }

        function togglePostLink(scope, elem, attrs) {
            var groupName = attrs.toggleChoose || DEF_GROUPNAME;
            addElement(groupName, elem);

            elem.on('click', onClick);
            scope.$on('$destroy', onDestroy);

            // Helpers
            function onClick() {
                setActive(groupName, elem, scope);
            }

            function onDestroy() {
                removeElement(groupName, elem);
            }
        }
    }

    function img($timeout) {
        return {
            restrict: 'E',
            link: function(scope, element, attrs) {
                // show an image-missing image

                // var DEFAULT_IMAGE = 'http://magento.codedisruptors.lan/pub/media/catalog/product/cache/image/e9c3970ab036de70892d86c6d221abfe/w/b/wb04-blue-0.jpg';

                element.bind('error', function() {
                    $timeout(function() {
                        var w = element.parent()[0].offsetWidth;
                        var h = w;
                        var url;
                        // using 20 here because it seems even a missing image will have ~18px width
                        // after this error function has been called
                        if (w <= 20) {
                            w = 100;
                        }
                        if (h <= 20) {
                            h = 100;
                        }

                        if (typeof DEFAULT_IMAGE == 'undefined')
                            url =
                                'http://placehold.it/' +
                                w +
                                'x' +
                                h +
                                '/cccccc/ffffff&text=No Image!';
                        else url = DEFAULT_IMAGE;

                        element.prop('src', url);
                        //element.css('border', 'double 3px #cccccc');
                    }, 200);
                });
            }
        };
    }

    function keepScroll() {
        return {
            controller: function($scope) {
                var element = null;

                this.setElement = function(el) {
                    element = el;
                };

                this.addItem = function(item) {
                    console.log('Adding item', item, item.clientHeight);
                    element.scrollTop =
                        element.scrollTop + item.clientHeight + 1;
                    //1px for margin from your css (surely it would be possible
                    // to make it more generic, rather then hard-coding the value)
                };
            },

            link: function(scope, el, attr, ctrl) {
                ctrl.setElement(el[0]);
            }
        };
    }

    function scrollItem() {
        return {
            require: '^keepScroll',
            link: function(scope, el, att, scrCtrl) {
                scrCtrl.addItem(el[0]);
            }
        };
    }

    function maxSizeResponsive($window) {
        return {
            restrict: 'A',
            scope: {
                maxSize: '='
            },
            link: function($scope, $element, $attrs) {
                var w = angular.element($window);

                function maxSizeChange() {
                    // Get window width
                    $scope.windowWidth = 'innerWidth' in window ? window.innerWidth : document.documentElement.offsetWidth;

                    // Change maxSize based on window width
                    if ($scope.windowWidth > 1000) {
                        $scope.maxSize = 10;
                    } else if ($scope.windowWidth > 800) {
                        $scope.maxSize = 8;
                    } else if ($scope.windowWidth > 600) {
                        $scope.maxSize = 5;
                    } else if ($scope.windowWidth > 400) {
                        $scope.maxSize = 2;
                    } else {
                        $scope.maxSize = 1;
                    }
                }

                maxSizeChange();

                w.on('resize', function() {
                    maxSizeChange();
                    $scope.$apply();
                });
            }
        };
    }

    function urlBlobDetails(Upload) {
        return {
            restrict: 'A',
            scope: {
                urlBlobDetails: '=',
                urlArrobject: '=',
                urlAttributesValues: '=',
                asyncValue: '='
            },
            link: function($scope, $element, $attrs) {
                var fileUrl = angular.copy($scope.urlBlobDetails);
                $scope.asyncValue = $scope.asyncValue || 0;
                var attributes_values = $scope.urlAttributesValues;

                /*****************************NEW CODE ************************************/

                if (typeof $scope.urlBlobDetails == 'string') {
                    var blob = {};

                    blob.isUpload = true;
                    blob.imgUrl = angular.copy($scope.urlBlobDetails);
                    // blob.label = gallery[index].label;

                    blob.image_role = [];
                    attributes_values.image = attributes_values.image || '';
                    attributes_values.small_image =
                        attributes_values.small_image || '';
                    attributes_values.thumbnail =
                        attributes_values.thumbnail || '';
                    attributes_values.swatch_image =
                        attributes_values.swatch_image || '';

                    if (attributes_values.image.trim() == blob.imgUrl)
                        blob.image_role.push('image');
                    if (attributes_values.small_image.trim() == blob.imgUrl)
                        blob.image_role.push('small_image');
                    if (attributes_values.thumbnail.trim() == blob.imgUrl)
                        blob.image_role.push('thumbnail');
                    if (attributes_values.swatch_image.trim() == blob.imgUrl)
                        blob.image_role.push('swatch_image');

                    $scope.urlBlobDetails = blob;

                    var index = $scope.urlArrobject.indexOf(blob.imgUrl);
                    $scope.urlArrobject[index] = blob;

                    Upload.urlToBlob(fileUrl).then(function(blobFile) {
                        blobFile =
                            new Blob([blobFile], { type: 'image' }) || {};
                        Upload.imageDimensions(blobFile).then(function(
                            dimensions
                        ) {
                            blob.$ngfWidth = dimensions.width;
                            blob.$ngfHeight = dimensions.height;
                            blob.size = blobFile.size;
                        });
                    });
                }

                /**************************************************************************/

                // $element.bind('load', function () {
                //     if (typeof $scope.urlBlobDetails == 'string') {
                //         Upload.urlToBlob($scope.urlBlobDetails).then(function(blob) {

                //             // Upload.resize(blob, { height : 200, quality: 0.9}).then(function(resizedFile){
                //             //     blob = resizedFile;

                //                     // var file = new File([blob], blob.$ngfName);
                //                 blob = new Blob([blob],{type:"image"});

                //                 blob.isUpload = true;
                //                 blob.imgUrl = angular.copy($scope.urlBlobDetails);
                //                 // blob.label = gallery[index].label;

                //                 blob.image_role=[];
                //                 attributes_values.image = attributes_values.image || '';
                //                 attributes_values.small_image = attributes_values.small_image || '';
                //                 attributes_values.thumbnail = attributes_values.thumbnail || '';
                //                 attributes_values.swatch_image = attributes_values.swatch_image || '';

                //                 if (attributes_values.image.trim() == blob.imgUrl) blob.image_role.push('image');
                //                 if (attributes_values.small_image.trim() == blob.imgUrl) blob.image_role.push('small_image');
                //                 if (attributes_values.thumbnail.trim() == blob.imgUrl) blob.image_role.push('thumbnail');
                //                 if (attributes_values.swatch_image.trim() == blob.imgUrl) blob.image_role.push('swatch_image');

                //                 $scope.urlBlobDetails = blob;

                //                 var index = $scope.urlArrobject.indexOf(blob.imgUrl);
                //                 $scope.urlArrobject[index] = blob;

                //                 Upload.imageDimensions(blob).then(function(dimensions){
                //                     blob.$ngfWidth = dimensions.width;
                //                     blob.$ngfHeight = dimensions.height;
                //                 });

                //             // });

                //         }).finally(function(){
                //             $scope.asyncValue = $scope.asyncValue + 1; //async to the product admin catalog
                //         });
                //     }
                // });

                $scope.asyncValue = $scope.asyncValue + 1;
            }
        };
    }

    // function mainImage(Upload){
    //     return {
    //         restrict: 'C',
    //         scope: {
    //             'ngSrc': '@',
    //         },
    //         link: function($scope, $element, $attrs) {

    //             $element.bind('load', function () {
    //                  console.log('ngggg',$scope.ngSrc);

    //                  Upload.urlToBlob($scope.urlBlobDetails).then(function(blob) {

    //                  }
    //             });

    //             // if (typeof $scope.urlBlobDetails == 'string') {
    //             //     Upload.urlToBlob($scope.urlBlobDetails).then(function(blob) {
    //             //         // var file = new File([blob], blob.$ngfName);
    //             //         blob = new Blob([blob],{type:"image"});

    //             //         blob.isUpload = true;
    //             //         blob.imgUrl = angular.copy($scope.urlBlobDetails);
    //             //         // blob.label = gallery[index].label;

    //             //         blob.image_role=[];
    //             //         attributes_values.image = attributes_values.image || '';
    //             //         attributes_values.small_image = attributes_values.small_image || '';
    //             //         attributes_values.thumbnail = attributes_values.thumbnail || '';
    //             //         attributes_values.swatch_image = attributes_values.swatch_image || '';

    //             //         if (attributes_values.image.trim() == blob.imgUrl) blob.image_role.push('image');
    //             //         if (attributes_values.small_image.trim() == blob.imgUrl) blob.image_role.push('small_image');
    //             //         if (attributes_values.thumbnail.trim() == blob.imgUrl) blob.image_role.push('thumbnail');
    //             //         if (attributes_values.swatch_image.trim() == blob.imgUrl) blob.image_role.push('swatch_image');

    //             //         $scope.urlBlobDetails = blob;

    //             //         var index = $scope.urlArrobject.indexOf(blob.imgUrl);
    //             //         $scope.urlArrobject[index] = blob;

    //             //         Upload.imageDimensions(blob).then(function(dimensions){
    //             //             blob.$ngfWidth = dimensions.width;
    //             //             blob.$ngfHeight = dimensions.height;
    //             //         });

    //             //         // Upload.resize(blob, { height : 10000}).then(function(resizedFile){
    //             //         //     $scope.urlBlobDetails = resizedFile;
    //             //         // });

    //             //     });
    //             // }

    //         }
    //     };
    // }

    function formDirective($parse) {
        return {
            require: 'form',
            restrict: 'E',
            link: function(scope, elem, attrs, form) {
                form.doSubmit = function() {
                    form.$setSubmitted();
                    return scope.$eval(attrs.ngSubmit);
                };
            }
        };
    }

    function checkElementListener($timeout) {
        return {
            scope: {
                ngModel: '=',
                ngModelText: '@ngModel',
                ce: '='
            },
            link: function(scope, elem, attrs) {
                $timeout(function() {
                    scope.$on('$destroy', function() {
                        if (!scope.ce) scope.ce = [];

                        if (typeof scope.ngModel != 'undefined')
                            scope.ce.push(scope.ngModelText);
                    });
                }, 400);

                elem.ready(function() {
                    $timeout(function() {
                        scope.$apply(function() {
                            // console.log(scope.ngModelText,scope.ngModel);
                            if (!scope.ce) scope.ce = [];

                            if (typeof scope.ngModel != 'undefined') {
                                var index = scope.ce.indexOf(scope.ngModelText);
                                // console.log(index);
                                if (index > -1) scope.ce.splice(index, 1);
                            }
                        });
                    }, 100);
                });
            }
        };
    }

    function customValidationFunction($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                valFunc: '&customValidationFunction',
                customValidError: '=',
                customErrorName: '@'
            },
            link: (scope, element, attrs, controller) => {
                const normalizedFunc = (modelValue, viewValue) => {
                    const $value = modelValue || viewValue;
                    var valF = scope.valFunc({
                        $value
                    });

                    var cond_value;
                    if (scope.customValidError) {
                        cond_value = angular.copy(!valF);
                        console.log(cond_value);
                        controller.$setValidity(
                            scope.customErrorName || 'customError',
                            cond_value
                        );
                        return cond_value;
                    } else {
                        cond_value = angular.copy(valF);
                        controller.$setValidity(
                            scope.customErrorName || 'customError',
                            cond_value
                        );
                        return cond_value;
                    }
                };
                controller.$validators.customValidationFunction = normalizedFunc;
            }
        };
    }
})();

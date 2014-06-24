'use strict';

var myApp = angular.module('BioinformaticsApp', [ 
    'ngRoute',
	'BioinformaticsApp.controllers',
    'BioinformaticsApp.services'
]);

myApp.config(['$httpProvider', function($httpProvider) {
	//http://better-inter.net/enabling-cors-in-angular-js/
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}])
.config( ['$compileProvider', function( $compileProvider ) {   
	//http://stackoverflow.com/questions/15606751/angular-changes-urls-to-unsafe-in-extension-page
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
    // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
}])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        // route for the home page
        .when('/', {
            templateUrl : 'html/home_partial.html',
            controller  : 'homeController'
        })
		.when('/melting_temps', {
			templateUrl : 'html/melting_temps_partial.html',
			controller  : 'tempsController'
		})
    	.when('/probe_design', {
    		templateUrl : 'html/probe_design_partial.html',
    		controller  : 'probeDesignController'
    	})
    	.when('/snp_search', {
    		templateUrl : 'html/snp_search_partial.html',
    		controller  : 'snpSearchController'
    	});
}])
.directive('fileModel', ['$parse', function ($parse) {
	// http://uncorkedstudios.com/blog/multipartformdata-file-upload-with-angularjs
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

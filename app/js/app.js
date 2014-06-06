'use strict';

var myApp = angular.module('MeltingTempApp', [ 
    'ngRoute',
	'MeltingTempApp.controllers',
    'MeltingTempApp.services'
]);

myApp.config(['$httpProvider', function($httpProvider) {
	//http://better-inter.net/enabling-cors-in-angular-js/
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
])
.config( ['$compileProvider', function( $compileProvider ) {   
	//http://stackoverflow.com/questions/15606751/angular-changes-urls-to-unsafe-in-extension-page
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|blob):/);
    // Angular before v1.2 uses $compileProvider.urlSanitizationWhitelist(...)
}
])
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
 
        // route for the home page
        .when('/', {
            templateUrl : 'html/home.html',
            controller  : 'homeController'
        })
		.when('/melting_temps', {
			templateUrl : 'html/melting_temps_partial.html',
			controller  : 'tempsController'
		});
}
]);
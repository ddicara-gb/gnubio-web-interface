'use strict';

var myApp = angular.module('MeltingTempApp', [ 
	'MeltingTempApp.controllers',
    'MeltingTempApp.services'
]);

myApp.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
}
]);
'use strict';

angular.module('MeltingTempApp.controllers', [])
	.controller('tempsController2', ['$scope', 'meltingTempAPIservice2', function($scope, meltingTempAPIservice2) {
		// Instantiate an object to store your scope data in (Best Practices)
		$scope.data = {};
		$scope.name = "name"
	
		meltingTempAPIservice2.get(function(response) {
			// Assign the response INSIDE the callback
			$scope.data.temp = response;
		});
	}])
	.controller('tempsController', function($scope, meltingTempAPIservice) {
		$scope.name = null;
		$scope.sequence = null;
		$scope.response = null;

		meltingTempAPIservice.getTemp().success(function (response) {
			$scope.name = response.name;
			$scope.sequence = response.sequence
			$scope.response = response
		});
	});

'use strict';

angular.module('MeltingTempApp.controllers', [])
	.controller('tempsController', function($scope, meltingTempAPIservice) {
		$scope.results = null;
		$scope.get_temps = function() {
			// Create an array of non-empty lines.
			var lines = $scope.in_sequence.replace(/^\s*[\r\n]/gm,'').split('\n');
			var sequences = lines.join(',');
			meltingTempAPIservice.getTemp(sequences).success(function (response) {
				$scope.results  = response['IDT'];
			});
		}
	});

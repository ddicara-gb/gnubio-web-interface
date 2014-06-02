'use strict';

angular.module('MeltingTempApp.controllers', [])
	.controller('tempsController', function($scope, meltingTempAPIservice) {
		$scope.response = null;
		$scope.sequence = null;
		$scope.tm = null;

		meltingTempAPIservice.getTemp().success(function (response) {
			$scope.response = response;
			$scope.sequence = response['IDT'][0]['sequence'];
			$scope.tm = response['IDT'][0]['melting_temp']['tm'];
		});
	});

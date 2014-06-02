'use strict';

angular.module('MeltingTempApp.services', ['ngResource'])
	.factory('meltingTempAPIservice', function($http) {
	
		var meltingTempAPI = {};
	
		meltingTempAPI.getTemp = function(sequences) {
			return $http({
				method: 'GET',
				url: 'http://localhost:8010/api/v1/MeltingTemperatures/IDT?sequence=' + sequences,
				mozSystem: true
			});
		}
		return meltingTempAPI;
	})
	.value('version', '0.1');

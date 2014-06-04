'use strict';

angular.module('MeltingTempApp.services', ['ngResource'])
	.factory('meltingTempAPIservice', function($http) {
	
		var meltingTempAPI = {};
	
		meltingTempAPI.getTemp = function(names, sequences) {
			return $http({
				method: 'GET',
				url: 'http://localhost:8010/api/v1/MeltingTemperature/IDT?sequence_name=' + names + '&sequence=' + sequences,
				mozSystem: true
			});
		}
		return meltingTempAPI;
	})
	.value('version', '0.1');

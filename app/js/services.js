'use strict';

angular.module('MeltingTempApp.services', ['ngResource'])
	.factory('meltingTempAPIservice2', function($resource){
		return $resource('http://localhost:8000/MeltingTemps/Rest?name=CLR_WT&sequence=GTGGATCAAAGCCACT', {})
	})
	.factory('meltingTempAPIservice', function($http) {
		
		var meltingTempAPI = {};

		meltingTempAPI.getTemp = function() {
			return $http({
				method: 'JSONP',
				url: "http://localhost:8000/MeltingTemps/Rest?name=CLR_WT&sequence=GTGGATCAAAGCCACT"
			});
		}
	return meltingTempAPI;
	})
	.value('version', '0.1');

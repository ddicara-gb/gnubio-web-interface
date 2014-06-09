'use strict';

window.restBaseUrl = 'http://bioweb:8010/api/v1';

angular.module('MeltingTempApp.services', ['ngResource'])
	.factory('meltingTempAPIservice', function($http) {
	
		var meltingTempAPI = {};
		var url = [restBaseUrl, 'MeltingTemperature', 'IDT?'].join('/')
	
		meltingTempAPI.getTemp = function(names, sequences) {
			var query_url = url + ["sequence_name=" + names, 
			                       "sequence=" + sequences].join("&");
			return $http({
				method: 'GET',
				url: query_url,
				mozSystem: true,
				cache: true
			});
		}
		return meltingTempAPI;
	})
	.value('version', '0.1');
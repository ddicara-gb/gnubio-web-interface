'use strict';

window.restBaseUrl = 'http://bioweb:8020/api/v1';

angular.module('BioinformaticsApp.services', ['ngResource'])
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
	.factory('targetsFileUploadService', function ($http) {
		
		var uploadTargetsFileAPI = {}
		var uploadUrl = [restBaseUrl, 'ProbeDesign', 'Targets'].join('/');
		
		uploadTargetsFileAPI.uploadFileToUrl = function(targetsFile){
			var fd = new FormData();
			fd.append('file', targetsFile);
			return $http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		}
		return uploadTargetsFileAPI;
	})
	.value('version', '0.1');
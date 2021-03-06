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
	.factory('snpSearchAPIservice', function($http) {

		var snpSearchAPI = {};
		var url = [restBaseUrl, 'SNPSearch', 'search?'].join('/')

		snpSearchAPI.getSnps = function(search_names, chr_nums, chr_starts, chr_stops) {
			var query_url = url + ["snp_search_name=" + search_names,
			                       "chr_num=" + chr_nums,
			                       "chr_start=" + chr_starts,
			                       "chr_stop=" + chr_stops].join("&");
			return $http({
				method: 'GET',
				url: query_url,
				mozSystem: true,
				cache: true
			});
		}
		return snpSearchAPI;
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
	.factory('probesFileUploadService', function ($http) {
		
		var uploadProbesFileAPI = {}
		var uploadUrl = [restBaseUrl, 'ProbeDesign', 'Probes'].join('/');
		
		uploadProbesFileAPI.uploadFileToUrl = function(probesFile){
			var fd = new FormData();
			fd.append('file', probesFile);
			return $http.post(uploadUrl, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			});
		}
		return uploadProbesFileAPI;
	})
	.value('version', '0.1');
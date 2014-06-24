'use strict';

window.restBaseUrl = 'http://localhost:8020/api/v1';

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

		snpSearchAPI.getSnps = function(chr_nums, chr_starts, chr_stops) {
			var query_url = url + ["chr_num=" + chr_nums,
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
	.factory('listTargetsFilesService', function($http) {
		var listTargetsFilesAPI = {};
		var url = [restBaseUrl, 'ProbeDesign', 'Targets'].join('/');
		
		listTargetsFilesAPI.listTargetsFiles = function() {
			return $http.get(url);
		}
		return listTargetsFilesAPI;
	})
	.factory('deleteTargetsFileService', function($http) {
		var deleteTargetsFileAPI = {};
		var url = [restBaseUrl, 'ProbeDesign', 'Targets?uuid='].join('/');
		
		deleteTargetsFileAPI.deleteTargetsFile = function(uuid) {
			return $http.delete(url + uuid);
		}
		return deleteTargetsFileAPI;
	})
	.factory('listProbesFilesService', function($http) {
		var listProbesFilesAPI = {};
		var url = [restBaseUrl, 'ProbeDesign', 'Probes'].join('/');
		
		listProbesFilesAPI.listProbesFiles = function() {
			return $http.get(url);
		}
		return listProbesFilesAPI;
	})
	.factory('deleteProbesFileService', function($http) {
		var deleteProbesFilesAPI = {};
		var url = [restBaseUrl, 'ProbeDesign', 'Probes?uuid='].join('/');
		
		deleteProbesFilesAPI.deleteProbesFile = function(uuid) {
			return $http.delete(url + uuid);
		}
		return deleteProbesFilesAPI;
	})
	.value('version', '0.1');
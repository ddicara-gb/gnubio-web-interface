'use strict';

angular.module('BioinformaticsApp.controllers', ['ngSanitize'])
	.controller('tempsController', function($scope, meltingTempAPIservice) {
		$scope.results = null;
		$scope.loading = false;
		$scope.show_table = false;
		$scope.query_failed = false;
		$scope.get_temps = function() {
			
			if ($scope.in_seq) {
				$scope.loading = true;
				$scope.show_table = false;

				// Create an array of non-empty lines.
				var lines = $scope.in_seq.replace(/^\s*[\r\n]/gm,'').split('\n');
				var sequence_array = new Array(lines.length);
				var names_array = new Array(lines.length);
				
				// Ignore header
				for (var i = 0; i < lines.length; i++) { 
					var fields = lines[i].split(/[\s,]+/);
					names_array[i] = fields[0];
					sequence_array[i] = fields[1];
				}
				var names     = names_array.join(',');
				var sequences = sequence_array.join(',');
				meltingTempAPIservice.getTemp(names, sequences).success(function (response) {
					$scope.results = response['IDT'];
					$scope.loading = false;
					$scope.show_table = true;
					$scope.query_failed = false;
					var content_csv = 'Name,Sequence,Tm';
					var content_tsv = 'Name\tSequence\tTm';
					for (var i = 0; i < $scope.results.length; i++) {
						content_csv += '\n' + [$scope.results[i].Name, 
						                       $scope.results[i].Sequence, 
						                       $scope.results[i].Tm
						                      ].join(',');
						content_tsv += '\n' + [$scope.results[i].Name, 
						                       $scope.results[i].Sequence, 
						                       $scope.results[i].Tm
						                      ].join('\t');
					}
					var blob_csv = new Blob([ content_csv ], { type : 'text/plain' });
					var blob_tsv = new Blob([ content_tsv ], { type : 'text/plain' });
					$scope.url_csv = (window.URL || window.webkitURL).createObjectURL( blob_csv );
					$scope.url_tsv = (window.URL || window.webkitURL).createObjectURL( blob_tsv );
				}).error(function(response) {
					$scope.loading = false;
					$scope.show_table = false;
					$scope.query_failed = true;
				});
			} else {
				$scope.show_table = false;
				$scope.query_failed = true;
			}
		}
	})
	.controller('probeDesignController', function($scope, targetsFileUploadService, probesFileUploadService){
		$scope.loadingTargets          = false;
		$scope.loadingProbes           = false;
		$scope.targetsFileUploadStatus = null;
		$scope.probesFileUploadStatus  = null;
		
		$scope.uploadTargetsFile = function(){
			$scope.loadingTargets=true;
			var targetsFile = $scope.targetsFile;
			console.log('file is ' + JSON.stringify(targetsFile));
			targetsFileUploadService.uploadFileToUrl(targetsFile)
			.success(function(data, status, headers, config) {
				$scope.loadingTargets = false;
				$scope.targetsFileUploadStatus = "<p class=\"success\">Upload successful.</p>";
			})
			.error(function(data, status, headers, config) {
				$scope.loadingTargets = false;
				$scope.targetsFileUploadStatus = "<p class=\"error\">Upload failed: " + data["error"] + "</p>";
			});
		};
		
		$scope.uploadProbesFile = function(){
			$scope.loadingProbes=true;
			var probesFile = $scope.probesFile;
			console.log('file is ' + JSON.stringify(probesFile));
			probesFileUploadService.uploadFileToUrl(probesFile)
			.success(function(data, status, headers, config) {
				$scope.loadingProbes = false;
				$scope.probesFileUploadStatus = "<p class=\"success\">Upload successful.</p>";
			})
			.error(function(data, status, headers, config) {
				$scope.loadingProbes = false;
				$scope.probesFileUploadStatus = "<p class=\"error\">Upload failed: " + data["error"] + "</p>";
			});
		};
	})
    .controller('homeController', function($scope) {
    	$scope.info = 'TODO: Add content.';
    })
    .controller('HeaderController', function($scope, $location) { 
    	$scope.isActive = function (viewLocation) { 
    		return viewLocation === $location.path();
    	}
    });

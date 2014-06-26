'use strict';

angular.module('BioinformaticsApp.controllers', [])
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
				var chr_num_array = new Array(lines.length);
				var chr_start_array = new Array(lines.length);
				
				// Ignore header
				for (var i = 0; i < lines.length; i++) { 
					var fields = lines[i].split(/[\s,]+/);
					chr_start_array[i] = fields[0];
					chr_num_array[i] = fields[1];
				}
				var names     = chr_start_array.join(',');
				var sequences = chr_num_array.join(',');
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
				$scope.targetsFileUploadStatus = "Upload successful.";
			})
			.error(function(data, status, headers, config) {
				$scope.loadingTargets = false;
			});
			$scope.targetsFileUploadStatus = "Upload failed: " + data["error"];
		};
		
		$scope.uploadProbesFile = function(){
			$scope.loadingProbes=true;
			var probesFile = $scope.probesFile;
			console.log('file is ' + JSON.stringify(probesFile));
			probesFileUploadService.uploadFileToUrl(probesFile)
			.success(function(data, status, headers, config) {
				$scope.loadingProbes = false;
				$scope.probesFileUploadStatus = "Upload successful.";
			})
			.error(function(data, status, headers, config) {
				$scope.loadingProbes = false;
				$scope.probesFileUploadStatus = "Upload failed: " + data["error"];
			});
		};
	})
    .controller('homeController', function($scope) {
    	$scope.info = 'TODO: Add content.';
    })
    .controller('snpSearchController', function($scope, snpSearchAPIservice) {
        $scope.loading = false;
		$scope.show_table = false;
		$scope.query_failed = false;
		$scope.get_snps = function() {
			if ($scope.in_query) {
				$scope.loading = true;
				$scope.show_table = false;

				var lines = $scope.in_query.replace(/^\s*[\r\n]/gm,'').split('\n');
				var search_name_array = new Array(lines.length);
				var chr_num_array = new Array(lines.length);
				var chr_start_array = new Array(lines.length);
				var chr_stop_array = new Array(lines.length);

				for (var i = 0; i < lines.length; i++) {
					var fields = lines[i].split(/[\s,]+/);
					search_name_array[i] = fields[0];
					chr_num_array[i] = fields[1];
					chr_start_array[i] = fields[2];
					chr_stop_array[i] = fields[3];
				}
				var search_names = search_name_array.join(',');
				var chr_nums  = chr_num_array.join(',');
				var chr_start = chr_start_array.join(',');
				var chr_stop  = chr_stop_array.join(',');


				snpSearchAPIservice.getSnps(search_names, chr_nums, chr_start, chr_stop).success(function (response) {
					$scope.results = response['search'];
					$scope.loading = false;
					$scope.show_table = true;
					$scope.query_failed = false;
					var content_csv = 'SNP Database ID,ref,alt,chromosome, location';
					for (var i = 0; i < $scope.results.length; i++) {
						content_csv += '\n' + [$scope.results[i].search_name,
						                       $scope.results[i].rs,
						                       $scope.results[i].ref,
						                       $scope.results[i].alt,
						                       $scope.results[i].chromosome,
						                       $scope.results[i].loc,
						                       $scope.results[i].validated.replace(",", " ")
						                      ].join(',');
					}
					var blob_csv = new Blob([ content_csv ], { type : 'text/plain' });
					$scope.snp_csv = (window.URL || window.webkitURL).createObjectURL( blob_csv );

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
    .controller('HeaderController', function($scope, $location) {
    	$scope.isActive = function (viewLocation) {
    		return viewLocation === $location.path();
    	}
    });

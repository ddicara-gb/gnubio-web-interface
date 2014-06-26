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
//	.controller('probeDesignController', pdc($scope, targetsFileUploadService,
//			probesFileUploadService, listTargetsFilesService, 
//			listProbesFilesService, deleteTargetsFileService, 
//			deleteProbesFileService))
	.controller('probeDesignController', function($scope, targetsFileUploadService,
			probesFileUploadService, listTargetsFilesService, 
			listProbesFilesService, deleteTargetsFileService, 
			deleteProbesFileService){
		$scope.loadingTargets          = false;
		$scope.loadingProbes           = false;
		$scope.deletingTargetsFile     = false;
		$scope.deletingProbesFile      = false;
		$scope.targetsFileUploadStatus = null;
		$scope.probesFileUploadStatus  = null;
		$scope.targetsFiles            = Array();
		$scope.probesFiles             = Array();
		$scope.selectedTargetsFile     = null;
		$scope.selectedProbesFile      = null;
		$scope.targetsUpButtonText     = "Upload File";
		$scope.probesUpButtonText      = "Upload File";
		$scope.targetsDelButtonText    = "Delete File";
		$scope.probesDelButtonText     = "Delete File";
		
		$scope.uploadTargetsFile = function(){
			$scope.loadingTargets      = true;
			$scope.targetsUpButtonText = "Uploading File...";
			console.log('file is ' + JSON.stringify($scope.selTargFileUpload));
			targetsFileUploadService.uploadFileToUrl($scope.selTargFileUpload)
			.success(function(data, status, headers, config) {
				$scope.loadingTargets = false;
				$scope.targetsFileUploadStatus = "<p class=\"success\">Upload successful.</p>";
				$scope.listTargetsFiles();
				$scope.targetsUpButtonText = "Upload File";
			})
			.error(function(data, status, headers, config) {
				$scope.loadingTargets = false;
				$scope.targetsFileUploadStatus = "<p class=\"error\">Upload failed: " + data["error"] + "</p>";
				$scope.targetsUpButtonText = "Upload File";
			});
		};
		
		$scope.uploadProbesFile = function(){
			$scope.loadingProbes     = true;
			$scope.probesUpButtonText = "Uploading File...";
			console.log('file is ' + JSON.stringify($scope.selProbFileUpload));
			probesFileUploadService.uploadFileToUrl($scope.selProbFileUpload)
			.success(function(data, status, headers, config) {
				$scope.loadingProbes = false;
				$scope.probesFileUploadStatus = "<p class=\"success\">Upload successful.</p>";
				$scope.listProbesFiles();
				$scope.probesUpButtonText = "Upload File";
			})
			.error(function(data, status, headers, config) {
				$scope.loadingProbes = false;
				$scope.probesFileUploadStatus = "<p class=\"error\">Upload failed: " + data["error"] + "</p>";
				$scope.probesUpButtonText = "Upload File";
			});
		};
		
		$scope.listTargetsFiles = function() {
			listTargetsFilesService.listTargetsFiles()
			.success(function(data, status, headers, config) {
				$scope.targetsFiles = Array();
				for (var i = 0; i < data["Targets"].length; i++) {
					var filename   = data["Targets"][i]["filename"];
					var uuid       = data["Targets"][i]["uuid"];
					var targetFile = {"filename": filename, "uuid": uuid};
					$scope.targetsFiles[$scope.targetsFiles.length] = targetFile
				}
			})
			.error(function(data, status, headers, config) {
				console.log('Failure retrieving targets files:' + JSON.stringify(data));
			});
		};
		$scope.listTargetsFiles();
		
		$scope.listProbesFiles = function() {
			listProbesFilesService.listProbesFiles()
			.success(function(data, status, headers, config) {
				$scope.probesFiles = Array();
				for (var i = 0; i < data["Probes"].length; i++) {
					var filename  = data["Probes"][i]["filename"];
					var uuid      = data["Probes"][i]["uuid"];
					var probeFile = {"filename": filename, "uuid": uuid};
					$scope.probesFiles[$scope.probesFiles.length] = probeFile
				}
			})
			.error(function(data, status, headers, config) {
				console.log('Failure retrieving probes files:' + JSON.stringify(data));
			});
		};
		$scope.listProbesFiles();
		
		$scope.deleteTargetsFile = function() {
			$scope.deletingTargetsFile  = true;
			$scope.targetsDelButtonText = "Deleting File...";
			deleteTargetsFileService.deleteTargetsFile($scope.selectedTargetsFile.uuid)
			.success(function(data, status, headers, config){
				console.log('Targets file successfully deleted: ' + $scope.selectedTargetsFile.filename)
				$scope.selectedTargetsFile  = null;
				$scope.listTargetsFiles();
				$scope.deletingTargetsFile  = false;
				$scope.targetsDelButtonText = "Delete File";
			})
			.error(function(data, status, headers, config){
				console.log('Targets file deletion failed: ' + $scope.selectedTargetsFile.filename)
				$scope.selectedTargetsFile  = null;
				$scope.listTargetsFiles();
				$scope.deletingTargetsFile  = false;
				$scope.targetsDelButtonText = "Delete File";
			});
		}

		$scope.isDisabled = function() {
			return $scope.deletingProbesFile || !$scope.selectedProbesFile;
		}
		
		$scope.deleteProbesFile = function() {
			$scope.deletingProbesFile = true;
			$scope.probesDelButtonText = "Deleting File...";
			deleteProbesFileService.deleteProbesFile($scope.selectedProbesFile.uuid)
			.success(function(data, status, headers, config){
				console.log('Probes file successfully deleted: ' + $scope.selectedProbesFile.filename)
				$scope.selectedProbesFile = null;
				$scope.listProbesFiles();
				$scope.deletingProbesFile = false;
				$scope.probesDelButtonText = "Delete File";
			})
			.error(function(data, status, headers, config){
				console.log('Probes file deletion failed: ' + $scope.selectedProbesFile.filename)
				$scope.selectedProbesFile = null;
				$scope.listProbesFiles();
				$scope.deletingProbesFile = false;
				$scope.probesDelButtonText = "Delete File";
			});
		}
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

function pdc ($scope, targetsFileUploadService,
		probesFileUploadService, listTargetsFilesService, 
		listProbesFilesService, deleteTargetsFileService, 
		deleteProbesFileService){
	$scope.loadingTargets          = false;
	$scope.loadingProbes           = false;
	$scope.deletingTargetsFile     = false;
	$scope.deletingProbesFile      = false;
	$scope.targetsFileUploadStatus = null;
	$scope.probesFileUploadStatus  = null;
	$scope.targetsFiles            = Array();
	$scope.probesFiles             = Array();
	$scope.selectedTargetsFile     = null;
	$scope.selectedProbesFile      = null;
	$scope.targetsUpButtonText     = "Upload File";
	$scope.probesUpButtonText      = "Upload File";
	$scope.targetsDelButtonText    = "Delete File";
	$scope.probesDelButtonText     = "Delete File";
	
	$scope.uploadTargetsFile = function(){
		$scope.loadingTargets      = true;
		$scope.targetsUpButtonText = "Uploading File...";
		console.log('file is ' + JSON.stringify($scope.selTargFileUpload));
		targetsFileUploadService.uploadFileToUrl($scope.selTargFileUpload)
		.success(function(data, status, headers, config) {
			$scope.loadingTargets = false;
			$scope.targetsFileUploadStatus = "<p class=\"success\">Upload successful.</p>";
			$scope.listTargetsFiles();
			$scope.targetsUpButtonText = "Upload File";
		})
		.error(function(data, status, headers, config) {
			$scope.loadingTargets = false;
			$scope.targetsFileUploadStatus = "<p class=\"error\">Upload failed: " + data["error"] + "</p>";
			$scope.targetsUpButtonText = "Upload File";
		});
	};
	
	$scope.uploadProbesFile = function(){
		$scope.loadingProbes     = true;
		$scope.probesUpButtonText = "Uploading File...";
		console.log('file is ' + JSON.stringify($scope.selProbFileUpload));
		probesFileUploadService.uploadFileToUrl($scope.selProbFileUpload)
		.success(function(data, status, headers, config) {
			$scope.loadingProbes = false;
			$scope.probesFileUploadStatus = "<p class=\"success\">Upload successful.</p>";
			$scope.listProbesFiles();
			$scope.probesUpButtonText = "Upload File";
		})
		.error(function(data, status, headers, config) {
			$scope.loadingProbes = false;
			$scope.probesFileUploadStatus = "<p class=\"error\">Upload failed: " + data["error"] + "</p>";
			$scope.probesUpButtonText = "Upload File";
		});
	};
	
	$scope.listTargetsFiles = function() {
		listTargetsFilesService.listTargetsFiles()
		.success(function(data, status, headers, config) {
			$scope.targetsFiles = Array();
			for (var i = 0; i < data["Targets"].length; i++) {
				var filename   = data["Targets"][i]["filename"];
				var uuid       = data["Targets"][i]["uuid"];
				var targetFile = {"filename": filename, "uuid": uuid};
				$scope.targetsFiles[$scope.targetsFiles.length] = targetFile
			}
		})
		.error(function(data, status, headers, config) {
			console.log('Failure retrieving targets files:' + JSON.stringify(data));
		});
	};
	$scope.listTargetsFiles();
	
	$scope.listProbesFiles = function() {
		listProbesFilesService.listProbesFiles()
		.success(function(data, status, headers, config) {
			$scope.probesFiles = Array();
			for (var i = 0; i < data["Probes"].length; i++) {
				var filename  = data["Probes"][i]["filename"];
				var uuid      = data["Probes"][i]["uuid"];
				var probeFile = {"filename": filename, "uuid": uuid};
				$scope.probesFiles[$scope.probesFiles.length] = probeFile
			}
		})
		.error(function(data, status, headers, config) {
			console.log('Failure retrieving probes files:' + JSON.stringify(data));
		});
	};
	$scope.listProbesFiles();
	
	$scope.deleteTargetsFile = function() {
		$scope.deletingTargetsFile  = true;
		$scope.targetsDelButtonText = "Deleting File...";
		deleteTargetsFileService.deleteTargetsFile($scope.selectedTargetsFile.uuid)
		.success(function(data, status, headers, config){
			console.log('Targets file successfully deleted: ' + $scope.selectedTargetsFile.filename)
			$scope.selectedTargetsFile  = null;
			$scope.listTargetsFiles();
			$scope.deletingTargetsFile  = false;
			$scope.targetsDelButtonText = "Delete File";
		})
		.error(function(data, status, headers, config){
			console.log('Targets file deletion failed: ' + $scope.selectedTargetsFile.filename)
			$scope.selectedTargetsFile  = null;
			$scope.listTargetsFiles();
			$scope.deletingTargetsFile  = false;
			$scope.targetsDelButtonText = "Delete File";
		});
	}

	$scope.isDisabled = function() {
		return $scope.deletingProbesFile || !$scope.selectedProbesFile;
	}
	
	$scope.deleteProbesFile = function() {
		$scope.deletingProbesFile = true;
		$scope.probesDelButtonText = "Deleting File...";
		deleteProbesFileService.deleteProbesFile($scope.selectedProbesFile.uuid)
		.success(function(data, status, headers, config){
			console.log('Probes file successfully deleted: ' + $scope.selectedProbesFile.filename)
			$scope.selectedProbesFile = null;
			$scope.listProbesFiles();
			$scope.deletingProbesFile = false;
			$scope.probesDelButtonText = "Delete File";
		})
		.error(function(data, status, headers, config){
			console.log('Probes file deletion failed: ' + $scope.selectedProbesFile.filename)
			$scope.selectedProbesFile = null;
			$scope.listProbesFiles();
			$scope.deletingProbesFile = false;
			$scope.probesDelButtonText = "Delete File";
		});
	}
}

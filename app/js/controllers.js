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
	.controller('probeDesignController', function($scope, targetsFileUploadService,
			probesFileUploadService, listTargetsFilesService, 
			listProbesFilesService, deleteTargetsFileService, 
			deleteProbesFileService, submitAbsorptionJobService,
			getAbsorptionJobService, deleteAbsorptionJobService){
		$scope.loadingTargets          = false;
		$scope.loadingProbes           = false;
		$scope.deletingTargetsFile     = false;
		$scope.deletingProbesFile      = false;
		$scope.submittingAbsJob        = false;
		$scope.gettingAbsJobs          = false;
		$scope.showTable               = false;
		$scope.targetsFileUploadStatus = null;
		$scope.probesFileUploadStatus  = null;
		$scope.absSubmitStatus         = null;
		$scope.targetsFiles            = Array();
		$scope.targetsFilesMap         = new Object();
		$scope.probesFiles             = Array();
		$scope.probesFilesMap          = new Object();
		$scope.selectedTargetsFile     = null;
		$scope.selectedProbesFile      = null;
		$scope.targetsUpButtonText     = "Upload File";
		$scope.probesUpButtonText      = "Upload File";
		$scope.targetsDelButtonText    = "Delete File";
		$scope.probesDelButtonText     = "Delete File";
		$scope.absSubmitButtonText     = "Submit Absorption Job";
		$scope.getAbsJobsButtonText    = "Refresh Table";
		
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
				if (status == 403) {
					$scope.targetsFileUploadStatus = "<p class=\"error\">Upload failed: File already exists - please delete the existing file and retry.</p>";
				} else if (status == 415) {
					$scope.targetsFileUploadStatus = "<p class=\"error\">Upload failed: File is not a valid FASTA file.</p>";
				} else {
					$scope.targetsFileUploadStatus = "<p class=\"error\">Upload failed: Server error occurred - please contact system administrator.</p>";
				}
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
				if (status == 403) {
					$scope.probesFileUploadStatus = "<p class=\"error\">Upload failed: File already exists - please delete the existing file and retry.</p>";
				} else if (status == 415) {
					$scope.probesFileUploadStatus = "<p class=\"error\">Upload failed: File is not a valid FASTA file.</p>";
				} else {
					$scope.probesFileUploadStatus = "<p class=\"error\">Upload failed: Server error occurred - please contact system administrator.</p>";
				}
				$scope.probesUpButtonText = "Upload File";
			});
		};
		
		$scope.listTargetsFiles = function() {
			listTargetsFilesService.listTargetsFiles()
			.success(function(data, status, headers, config) {
				$scope.targetsFiles    = Array();
				$scope.targetsFilesMap = new Object();
				for (var i = 0; i < data["Targets"].length; i++) {
					var filename   = data["Targets"][i]["filename"];
					var uuid       = data["Targets"][i]["uuid"];
					var targetFile = {"filename": filename, "uuid": uuid};
					$scope.targetsFiles[$scope.targetsFiles.length] = targetFile
					$scope.targetsFilesMap[uuid] = filename
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
				$scope.probesFiles    = Array();
				$scope.probesFilesMap = new Object();
				for (var i = 0; i < data["Probes"].length; i++) {
					var filename  = data["Probes"][i]["filename"];
					var uuid      = data["Probes"][i]["uuid"];
					var probeFile = {"filename": filename, "uuid": uuid};
					$scope.probesFiles[$scope.probesFiles.length] = probeFile
					$scope.probesFilesMap[uuid] = filename
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

		$scope.submitAbsorptionJob = function() {
			$scope.submittingAbsJob    = true;
			$scope.absSubmitButtonText = "Submitting Absorption Job...";
			submitAbsorptionJobService.submitJob($scope.selectedTargetsFile.uuid, $scope.selectedProbesFile.uuid, $scope.job_name)
			.success(function(data, status, headers, config){
				console.log('Absorption job successfully submitted');
				$scope.selectedTargetsFile = null;
				$scope.selectedProbesFile  = null;
				$scope.submittingAbsJob    = false;
				$scope.absSubmitButtonText = "Submit Absorption Job";
				$scope.absSubmitStatus = "<p class=\"success\">Submission successful.</p>";
				$scope.getAbsorptionJobs();
			})
			.error(function(data, status, headers, config){
				console.log('Absorption job submission failed');
				$scope.submittingAbsJob    = false;
				$scope.absSubmitButtonText = "Submit Absorption Job";
				if (status == 403) {
					$scope.absSubmitStatus = "<p class=\"error\">Submission failed: Job name already exists. Please choose a different name.</p>";
				} else {
					$scope.absSubmitStatus = "<p class=\"error\">Submission failed: Server error occurred - please contact system administrator.</p>";
				}
			});
		}

		$scope.getAbsorptionJobs = function() {
			$scope.gettingAbsJobs = true;
			$scope.getAbsJobsButtonText = "Refreshing Table...";
			getAbsorptionJobService.getJobs()
			.success(function(data, status, headers, config){
				console.log('Absorption jobs successfully obtained');
				$scope.absorptionJobs = data['Absorption'];
				$scope.listTargetsFiles();
				$scope.listProbesFiles();
				for (var i = 0; i < $scope.absorptionJobs.length; i++) {
					var job = $scope.absorptionJobs[i];
					if ("start_datestamp" in job) {
						var start = Date.parse(job["start_datestamp"]);
						if ("finish_datestamp" in job) {
							var end        = job["finish_datestamp"];
							job["runtime"] =  getTimeDelta(start, Date.parse(end));
						} else {
							var d = new Date();
							// getTimezoneOffset() returns minutes, but we need milliseconds
							var end = d.getTime() - d.getTimezoneOffset()*60000.0;
							console.log(d.getTimezoneOffset())
							job["runtime"] = getTimeDelta(start, end);
						}
					} else {
						job["runtime"] = "";
					}
					
					if (job["targets"] in $scope.targetsFilesMap) {
						job["targets_filename"] = $scope.targetsFilesMap[job["targets"]];
					} else {
						job["targets_filename"] = "File not found";
					}
					if (job["probes"] in $scope.probesFilesMap) {
						job["probes_filename"] = $scope.probesFilesMap[job["probes"]];
					} else {
						job["probes_filename"] = "File not found";
					}
				}
				$scope.absorptionJobs.sort(function(a,b){
					  // Turn your strings into dates, and then subtract them
					  // to get a value that is either negative, positive, or zero.
					  return new Date(b["submit_datestamp"]) - new Date(a["submit_datestamp"]);
				});
				
				$scope.getAbsJobsButtonText = "Refresh Table";
				$scope.gettingAbsJobs       = false;
				if ($scope.absorptionJobs.length > 0) {
					$scope.showTable = true;
				} else {
					$scope.showTable = false;
				}
			})
			.error(function(data, status, headers, config){
				console.log('Failed to obtain absorption jobs');
				$scope.getAbsJobsButtonText = "Refresh Table";
				$scope.gettingAbsJobs       = false;
				$scope.showTable            = false;
			});
		}
		$scope.getAbsorptionJobs();
		
		$scope.deleteAbsorptionJob = function(absorptionUuid) {
			deleteAbsorptionJobService.deleteJob(absorptionUuid)
			.success(function(data, status, headers, config){
				console.log('Absorption job successfully deleted: ' + absorptionUuid);
				$scope.getAbsorptionJobs();
			})
			.error(function(data, status, headers, config){
				console.log('Absorption job deletion failed: ' + absorptionUuid)
			});
		}
		
		var getTimeDelta = function(startDate, endDate) {

		    var seconds = Math.floor((endDate - startDate) / 1000);

		    var interval = Math.floor(seconds / 31536000);

		    if (interval > 1) {
		        return interval + " years";
		    }
		    interval = Math.floor(seconds / 2592000);
		    if (interval > 1) {
		        return interval + " months";
		    }
		    interval = Math.floor(seconds / 86400);
		    if (interval > 1) {
		        return interval + " days";
		    }
		    interval = Math.floor(seconds / 3600);
		    if (interval > 1) {
		        return interval + " hours";
		    }
		    interval = Math.floor(seconds / 60);
		    if (interval > 1) {
		        return interval + " minutes";
		    }
		    return Math.floor(seconds) + " seconds";
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
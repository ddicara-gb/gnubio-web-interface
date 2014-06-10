'use strict';

angular.module('MeltingTempApp.controllers', [])
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
						                      ].join(',')
						content_tsv += '\n' + [$scope.results[i].Name, 
						                       $scope.results[i].Sequence, 
						                       $scope.results[i].Tm
						                      ].join('\t')
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
    .controller('homeController', function($scope) {
    	$scope.info = 'TODO: Add content.';
    })
    .controller('HeaderController', function($scope, $location) { 
    	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    	}
    });

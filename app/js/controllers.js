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
				var sequence_array = new Array(lines.length-1);
				var names_array = new Array(lines.length-1);
				
				// Ignore header
				for (var i = 1; i < lines.length; i++) { 
					var fields = lines[i].split(',');
					names_array[i-1] = fields[0];
					sequence_array[i-1] = fields[1];
				}
				var names     = names_array.join(',');
				var sequences = sequence_array.join(',');
				meltingTempAPIservice.getTemp(names, sequences).success(function (response) {
					$scope.results = response['IDT'];
					$scope.loading = false;
					$scope.show_table = true;
					$scope.query_failed = false;
					var content = 'Name,Sequence,Tm';
					for (var i = 0; i < $scope.results.length; i++) {
						content += '\n' + [$scope.results[i].Name, 
						                   $scope.results[i].Sequence, 
						                   $scope.results[i].Tm
						                  ].join(',')
					}
					var blob = new Blob([ content ], { type : 'text/plain' });
					$scope.url = (window.URL || window.webkitURL).createObjectURL( blob );
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
//	.controller('HeaderController', ['$scope','$location', function($scope, $location) { 
//		$scope.isActive = function (viewLocation) { 
//			return viewLocation === $location.path();
//		};
//	})
	.controller('fileWriteController', ['$scope', function($scope) {
		$scope.write_file = function() {
			var fs = require('fs');
			fs.writeFile("/tmp/test", "Hey there!", function(err) {
				if(err) {
					console.log(err);
				} else {
					console.log("The file was saved!");
				}
			}); 
		}
    }]);
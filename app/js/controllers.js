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
					var content = '';
					for (var i = 0; i < $scope.results.length; i++) {
						content += [
						            $scope.results[i].Name, 
						            $scope.results[i].Sequence, 
						            $scope.results[i].Tm
						           ].join(' ') + "\n"
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
    .controller('homeController', function($scope) {
    	$scope.info = 'TODO: Add content.';
    })
    .controller('HeaderController', function($scope, $location) { 
    	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    	}
    });

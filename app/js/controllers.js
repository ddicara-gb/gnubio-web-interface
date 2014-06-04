'use strict';

angular.module('MeltingTempApp.controllers', [])
	.controller('tempsController', function($scope, meltingTempAPIservice) {
		$scope.results = null;
		$scope.loading = false;
		$scope.show_table = false;
		$scope.get_temps = function() {
			
			// Create an array of non-empty lines.
			if ($scope.in_seq) {
				$scope.loading = true;
				$scope.show_table = false;
				$scope.$emit('LOAD');

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
					$scope.$emit('UNLOAD');
					$scope.show_table = true;
				}).error(function(response) {
					$scope.loading = false;
					$scope.$emit('UNLOAD');
					$scope.show_table = false;
				});
			} else {
				$scope.show_table = false;
			}
		}
	})
	.controller('loadController',['$scope',function($scope){
        $scope.$on('LOAD',function(){$scope.loading=true});
        $scope.$on('UNLOAD',function(){$scope.loading=false});
	}])
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
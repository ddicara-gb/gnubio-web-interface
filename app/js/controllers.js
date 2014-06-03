'use strict';

angular.module('MeltingTempApp.controllers', [])
	.controller('tempsController', function($scope, meltingTempAPIservice) {
		$scope.results = null;
		$scope.show_table = false;
		$scope.get_temps = function() {
			$scope.$emit('LOAD')
			
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
				$scope.$emit('UNLOAD')
				$scope.show_table = true
			});
		}
	})
	.controller('loadController',['$scope',function($scope){
        $scope.$on('LOAD',function(){$scope.loading=true});
        $scope.$on('UNLOAD',function(){$scope.loading=false});
    }]);
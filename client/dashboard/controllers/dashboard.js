angular.module("cimonitor").controller("DashboardCtrl", ['$scope', '$collection', '$stateParams','$subscribe',
    function ($scope, $collection, $stateParams,$subscribe) {
    	$subscribe.subscribe('builds').then(function(){
        	$collection(Builds).bind($scope, 'builds');
      	});

      	$scope.getBuildStatusColor = function(isBuilding,result){
      		if(isBuilding)
      		{
      			return "yellow";
      		}

      		if(result==='FAILURE'){
      			return "red";
      		}
      		else{
      			return "green";
      		}

      		return "";
      		
      	};

      	$scope.getBuildStatusInfo = function(isBuilding,result){
      		if(isBuilding)
      		{
      			return "Building";
      		}

      		if(result==='FAILURE'){
      			return "Failure";
      		}
      		else{
      			return "Success";
      		}

      		return "";
      		
      	};

        $(".ui.accordion").accordion();
        $(".ui.dropdown").dropdown();
        $scope.dashboard = 'active';

    }
]);
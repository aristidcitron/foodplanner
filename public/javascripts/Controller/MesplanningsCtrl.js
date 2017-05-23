app.controller('MesplanningsCtrl', [
'$scope',
'$modal',
'$state',
'$log',
'recettes',
'auth',
function($scope,$modal,$state,$log,recettes,auth){


    $scope.currentUser = auth.currentUser;
    $scope.isLoggedIn = auth.isLoggedIn;  
    $scope.plannings = recettes.recettes;
  $scope.supprimerplanning = function(planning) {
  		var tampon=planning;
 		recettes.deleteplanning(planning).success(function(planning){
			$scope.plannings.splice($scope.plannings.indexOf(tampon),1);
		})
 	};


}]);
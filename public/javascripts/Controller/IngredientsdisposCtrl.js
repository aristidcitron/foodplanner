app.controller('IngredientsdisposCtrl', [
'$scope',
'ingredientsdispos',
'auth',
function($scope,ingredientsdispos,auth){
  $scope.currentUser = auth.currentUser;
  $scope.ingredientsdispos = ingredientsdispos.ingredientsdispos;
  $scope.ajouterIngredientsdispo = function() {
 		if (!$scope.nomid || $scope.nomid ==='') { return; }
 		ingredientsdispos.createingredientsdispo ({
 			nomid: $scope.nomid,
 			rayon: $scope.rayon,
 			unite: $scope.unite,
 			type: $scope.type,
 			glucide: $scope.glucide,
 			lipide: $scope.lipide,
 			protide: $scope.protide,
 			calories: $scope.calories,
 			prix: $scope.prix, 			
 			poidmoyen: $scope.poidmoyen,
 		});
 		$scope.nomid='';
 		$scope.rayon='';
 		$scope.unite='';
 	};

 	
	$scope.supprimerIngredientsdispos = function(ingredientsdispo) {
		var tampon=ingredientsdispo;
		ingredientsdispos.deleteingredientsdispo(ingredientsdispo).success(function(ingredientsdispo){
			$scope.ingredientsdispos.splice($scope.ingredientsdispos.indexOf(tampon),1);
		})};
	
	}]);


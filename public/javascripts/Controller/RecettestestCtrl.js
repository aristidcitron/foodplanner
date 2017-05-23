app.controller('RecettestestCtrl', [
	'$scope',
	'$stateParams',
	'recettes',
	'recette',
	'ingredientsdispos',
function($scope,$stateParams,recettes,recette,ingredientsdispos){
	$scope.recette = recette;
    $scope.ingredientsdispos = ingredientsdispos.ingredientsdispos;

    $scope.addtorecette = function(ingredientsdispo) {
		var tampon=ingredientsdispo;
		recettes.addingredient(recette._id,{
			nomi: ingredientsdispo.nomid,
			unite: ingredientsdispo.unite,
			idingredientdispo: ingredientsdispo._id,
			rayon: ingredientsdispo.rayon,
			nombre:0
		}).success(function(ingredient){
			$scope.recette.ingredients.push(ingredient);
		})};

	$scope.supprimerIngredient = function(ingredient) {
		var tampon=ingredient;
		recettes.deleteingredient(recette,ingredient).success(function(ingredient){
			$scope.recette.ingredients.splice($scope.recette.ingredients.indexOf(tampon),1);
		})};	


	$scope.editIngredient = function (ingredient) {
        ingredient.editing = true;
    };

    $scope.doneEditing = function (ingredient) {
        ingredient.editing = false;
        var tampon=ingredient;
        recettes.updatenombre(ingredient, ingredient).error(function(error){
		      $scope.error = error;
		    })
		};
    

    $scope.editrecettename = function (recette) {
        recette.editingnomr = true;
    };

    $scope.doneeditrecettename = function (recette) {
        recette.editingnomr = false;
        var tampon=recette;
        recettes.updaterecette(recette, recette).error(function(error){
		      $scope.error = error;
		    })
		};

    $scope.editrecetteinstructions = function (recette) {
        recette.editinginstructions = true;
    };

    $scope.doneeditrecetteinstructions = function (recette) {
        recette.editinginstructions = false;
        var tampon=recette;
        recettes.updaterecette(recette, recette).error(function(error){
		      $scope.error = error;
		    })
		};


    $scope.editrecettetempsdecuisson = function (recette) {
        recette.editingtempsdecuisson = true;
    };

    $scope.doneeditrecettetempsdecuisson = function (recette) {
        recette.editingtempsdecuisson = false;
        var tampon=recette;
        recettes.updaterecette(recette, recette).error(function(error){
		      $scope.error = error;
		    })
		};



    $scope.editrecettetempsdepreparation = function (recette) {
        recette.editingtempsdepreparation = true;
    };

    $scope.doneeditrecettetempsdepreparation = function (recette) {
        recette.editingtempsdepreparation = false;
        var tampon=recette;
        recettes.updaterecette(recette, recette)
		};


    $scope.editrecetteportionmini = function (recette) {
        recette.editingportionmini = true;
    };

    $scope.doneeditrecetteportionmini = function (recette) {
        recette.editingportionmini = false;
        var tampon=recette;
        recettes.updaterecette(recette, recette)
		};





    $scope.modifierrecette = function(recette){
    	$scope.editrecette = true
    }
    	
// ancienne fonction add to recette
//	    $scope.addtorecette = function(ingredientsdispo) {
//		var tampon=ingredientsdispo;
//		recettes.addingredient(recette._id,{
//			nomi: ingredientsdispo.nomid,
//			unite: ingredientsdispo.unite,
//			idingredientdispo: ingredientsdispo._id,
//			rayon: ingredientsdispo.rayon,
//			nombre:0
//		}).success(function(ingredient){
//			$scope.recette.ingredients.push(ingredient);
//		})};

 
}]);
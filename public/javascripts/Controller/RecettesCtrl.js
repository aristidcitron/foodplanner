app.controller('RecettesCtrl', [
'$scope',
'recette',
'recettes',
'auth',
'filepickerService',
'ingredientsdispos',
function($scope,recette,recettes,auth,filepickerService,ingredientsdispos){
	$scope.recette = recette;
	$scope.nomr = recette.nomr;
	$scope.tempsdecuisson = recette.tempsdecuisson;
	$scope.tempsdepreparation = recette.tempsdepreparation;
	$scope.instructions = recette.instructions;
	$scope.infophoto = {};
	$scope.infophoto.url = recette.picture;
	$scope.portionmini = recette.portionmini;			
	$scope.ingredients = recette.ingredients;




    $scope.ingredientsdispos = ingredientsdispos.ingredientsdispos;

    $scope.addtorecette = function(ingredientsdispo) {
    	ingredientsdispo.nombre=0;
    	//ingredientsdispo.nomi=ingredientsdispo.nomid;
    	//delete ingredientsdispo.nomid;
		$scope.ingredients.push(ingredientsdispo);
		};

	$scope.supprimerIngredient = function(ingredient) {
		var tampon=ingredient;
			$scope.ingredients.splice($scope.ingredients.indexOf(tampon),1);
		};	


	$scope.editIngredient = function (ingredient) {
        ingredient.editing = true;
    };



    $scope.doneEditing = function (ingredient) {
        ingredient.editing = false;
        var tampon=ingredient;
		};


    $scope.ajouterRecette = function () {
 		if (!$scope.nomr || $scope.nomr ==='') { return; } 
 		$scope.ingidnb=[];
 		for (var i=0; i<$scope.ingredients.length; i++){
 			$scope.ingidnb[i]={ _id:$scope.ingredients[i]._id,nombre:$scope.ingredients[i].nombre}
 		};





        recettes.updaterecette({
 			nomr: $scope.nomr,
 			_id:$scope.recette._id,
 			upvotes: 0,
 			tempsdecuisson: $scope.tempsdecuisson,
 			tempsdepreparation:$scope.tempsdepreparation,
 			instructions:$scope.instructions,
 			author: $scope.currentUser,
 			picture: $scope.infophoto.url,
 			portionmini: $scope.portionmini,
 			ingredients: $scope.ingidnb,
 			author: $scope.recette.author,
 		}).error(function(error){
		      $scope.error = error;
		    })
		};


  $scope.labels = ['glucides', 'lipides', 'protides'];
  $scope.series = ['Series A'];

  $scope.data = [
    [$scope.recette.glucide, $scope.recette.lipide, $scope.recette.protide]
  ];






    $scope.upload = function(){
        filepickerService.pick(
            {
                mimetype: 'image/*',
                language: 'en',
                services: ['COMPUTER','DROPBOX','GOOGLE_DRIVE','IMAGE_SEARCH', 'FACEBOOK', 'INSTAGRAM'],
                openTo: 'IMAGE_SEARCH'
            },
            function(Blob){
                console.log(JSON.stringify(Blob));
                $scope.infophoto = Blob;
                $scope.$apply();
            }
        );
    };


}]);

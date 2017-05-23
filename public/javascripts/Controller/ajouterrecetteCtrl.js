app.controller('ajouterrecetteCtrl', [
'$scope',
'recettes',
'auth',
'filepickerService',
'ingredientsdispos',
function($scope,recettes,auth,filepickerService,ingredientsdispos){
  $scope.recettes = recettes.recettes;
  $scope.currentUser = auth.currentUser;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.ingredientsdispos = ingredientsdispos.ingredientsdispos;
  $scope.ingredients = [];
  $scope.infophoto ='';

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



  $scope.ajouterRecette = function() {
 		if (!$scope.nomr || $scope.nomr ==='') { return; } 
 		$scope.ingidnb=[];
 		for (var i=0; i<$scope.ingredients.length; i++){
 			$scope.ingidnb[i]={ _id:$scope.ingredients[i]._id,nombre:$scope.ingredients[i].nombre}
 		};
 		recettes.createrecettecomplette ({
 			nomr: $scope.nomr,
 			upvotes: 0,
 			tempsdecuisson: $scope.tempsdecuisson,
 			tempsdepreparation:$scope.tempsdepreparation,
 			instructions:$scope.instructions,
 			author: $scope.currentUser,
 			picture: $scope.infophoto.url,
 			portionmini: $scope.portionmini,
 			ingredients: $scope.ingidnb,
 		});
 		$scope.nomr='';
 		$scope.tempsdepreparation='';
 		$scope.tempsdecuisson='';
 		$scope.instructions='';
 		$scope.picture='';
 		$scope.ingredients='';
 		$scope.portionmini='';
 		$scope.ingredients=[];
 	};







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

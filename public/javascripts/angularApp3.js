var app = angular.module('foodplanner', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('home',{
				url:'/home',
				views:{
					'page':{
						templateUrl:'/home.html',
						controller:'MainCtrl',
						resolve:{
							recettePromise:['recettes', function(recettes){
								return recettes.getAll();
							}]
						}
					},
					'menu':{
						templateUrl:'/menu.html',
					}

				}
				
			})

			.state('ingredientsdispos',{
				url:'/ingredientsdispos',
				views:{
					'page':{
						templateUrl:'/ingredientsdispos.html',
						controller:'IngredientsdisposCtrl',
						resolve:{
							ingredientsdispoPromise:['ingredientsdispos', function(ingredientsdispos){
								return ingredientsdispos.getIngredientsdispo();
							}]
						}

					}},
					'menu':{
						templateUrl:'/menu.html',
					}

				}
				
			)




			.state('recettes',{
				url: '/recettes/{id}',				
				views:{
					'page':{

						templateUrl:'/recettes.html',
						controller: 'RecettesCtrl',
						resolve: {
							recette:['$stateParams','recettes', function($stateParams, recettes){
								return recettes.getingredients($stateParams.id);
							}],
							ingredientsdispoPromise:['ingredientsdispos', function(ingredientsdispos){
								return ingredientsdispos.getIngredientsdispo();
							}]
						}
					},
					'menu':{
						templateUrl:'/menu.html',
					}

				}		
			});
		$urlRouterProvider.otherwise ('home');

	}])

//méthodes d'appel a la bdd
app.factory('ingredientsdispos',['$http',function($http){
var i = {
		ingredientsdispos:[]
	};
		// récupérer la liste de tous les ingredientsdispos 
	i.getIngredientsdispo = function(){
		return $http.get('/ingredientsdispos').success(function(data){
			angular.copy(data,i.ingredientsdispos);
		});
	};	
	// ajouter un nouve ingredientsdispo
	i.createingredientsdispo=function(ingredientsdispo){
		return $http.post('/ingredientsdispos', ingredientsdispo).success(function(data){
			i.ingredientsdispos.push(data);
		});
	};	
	// supprimer un ingredientsdispo
	i.deleteingredientsdispo = function (ingredientsdispo){
		return $http.delete('/ingredientsdispos/' + ingredientsdispo._id);
	};	
	return i;

}])

app.factory('recettes',['$http', function($http){
	var o = {
		recettes:[]
	};
	
	// récupérer la liste de toutes les recettes 
	o.getAll = function(){
		return $http.get('/recettes').success(function(data){
			angular.copy(data,o.recettes);
		});
	};



	// récupérer la liste des ingrédients pour une recette 	
	o.getingredients = function(id){
		return $http.get('/recettes/'+ id).then(function(res){
			return res.data;
		});
	};
	// ajouter une nouvelle recette 	
	o.createrecette=function(recette){
		return $http.post('/recettes', recette).success(function(data){
			o.recettes.push(data);
		});
	};



	// upvote une recette
	o.upvote = function (recette){
		return $http.put('/recettes/' + recette._id + '/upvote').success(function(data){
			recette.upvotes +=1;
		});
	};
	// ajouter un ingredient	
	o.addingredient = function(id, ingredient){
		return $http.post('/recettes/' + id + '/ingredients', ingredient);
	};
	// supprimer une recette
	o.deleterecette = function (recette){
		return $http.delete('/recettes/' + recette._id);
	};

	o.deleteingredient = function (recette, ingredient){
		return $http.delete('/recettes/' + recette._id + '/ingredients/' + ingredient._id);
	};	

	return o;
}])


app.controller('IngredientsdisposCtrl', [
'$scope',
'ingredientsdispos',
function($scope,ingredientsdispos){
  $scope.ingredientsdispos = ingredientsdispos.ingredientsdispos;
  $scope.ajouterIngredientsdispo = function() {
 		if (!$scope.nomid || $scope.nomid ==='') { return; }
 		ingredientsdispos.createingredientsdispo ({
 			nomid: $scope.nomid,
 			rayon: $scope.rayon,
 			unite: $scope.unite,
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


app.controller('MainCtrl', [
'$scope',
'recettes',
function($scope,recettes){
  $scope.recettes = recettes.recettes;
  $scope.ajouterRecette = function() {
 		if (!$scope.nomr || $scope.nomr ==='') { return; }
 		recettes.createrecette ({
 			nomr: $scope.nomr,
 			upvotes: 0,
 			tempsdecuisson: $scope.tempsdecuisson,
 			tempsdepreparation:$scope.tempsdepreparation,
 			insctructions:$scope.instructions,
 		});
 		$scope.nomr='';
 		$scope.tempsdepreparation='';
 		$scope.tempsdecuisson='';
 		$scope.instructions='';
 	};

 	$scope.incrementUpvotes = function(recette){
 		recettes.upvote(recette);
 	};

	$scope.supprimerRecette = function(recette) {
		var tampon=recette;
		recettes.deleterecette(recette).success(function(recette){
			$scope.recettes.splice($scope.recettes.indexOf(tampon),1);
		})};
	
	}]);





app.controller('RecettesCtrl', [
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
			nombre:0
		}).success(function(ingredient){
			$scope.recette.ingredients.push(ingredient);
		})};

	$scope.supprimerIngredient = function(ingredient) {
		var tampon=ingredient;
		recettes.deleteingredient(recette,ingredient).success(function(ingredient){
			$scope.recette.ingredients.splice($scope.recette.ingredients.indexOf(tampon),1);
		})};	

// ancienne fonction avec formulaire
//	$scope.ajouterIngredient = function(){
// 		if (!$scope.nomi || $scope.nomi ==='') { return; }
// 		recettes.addingredient(recette._id,{
// 			nomi: $scope.nomi,
// 			nombre: $scope.nombre
// 			}).success(function(ingredient){
// 				$scope.recette.ingredients.push(ingredient);
// 		});
// 		$scope.nomi='';
// 		$scope.nombre=''; 
// 	};	
  // gets the template to ng-include for a table row / item
    $scope.getTemplate = function (ingredient) {
        if (ingredient.nomi === $scope.recette.selected.nomi) return 'edit';
        else return 'display';
    };

    $scope.editIngredient = function (ingredient) {
        $scope.recette.selected = angular.copy(contact);
    };

    $scope.saveIngredient = function (ingredient) {
        console.log("Saving ingredient");
        $scope.recette.ingredient[idx] = angular.copy($scope.recette.selected);
        $scope.reset();
    };	

    $scope.reset = function () {
        $scope.recette.selected = {};
    };
 
}]);



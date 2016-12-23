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
							ingredientsdisposPromise:['ingredientsdispos', function(ingredientsdispos){
								return ingredientsdispos.getIngredientsdispo();
							}]
						}
					},
					'menu':{
						templateUrl:'/menu.html',
					}

				}
				
			})




			.state('recettes',{
				url: '/recettes/{id}',				
				views:{
					'page':{

						templateUrl:'/recettes.html',
						controller: 'RecettesCtrl',
						resolve: {
							recette:['$stateParams','recettes', function($stateParams, recettes){
								return recettes.getingredients($stateParams.id);
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

		// récupérer la liste de tous les ingredientsdispos 
	o.getIngredientsdispo = function(){
		return $http.get('/ingredientsdispos').success(function(data){
			angular.copy(data,o.ingredientsdispos);
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

	// ajouter un nouve ingredientsdispo
	o.createingredientsdispo=function(ingredientsdispo){
		return $http.post('/ingredientsdispos', ingredientsdispo).success(function(data){
			o.ingredientsdispos.push(data);
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
	return o;
	// supprimer un ingredientsdispo
	o.deleteingredientsdispo = function (ingredientsdispo){
		return $http.delete('/ingredientsdispos/' + recette._id);
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
 		recettes.createingredientsdispo ({
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
function($scope,$stateParams,recettes,recette){
	$scope.recette = recette;
	$scope.ajouterIngredient = function(){
 		if (!$scope.nomi || $scope.nomi ==='') { return; }
 		recettes.addingredient(recette._id,{
 			nomi: $scope.nomi,
 			nombre: $scope.nombre
 			}).success(function(ingredient){
 				$scope.recette.ingredients.push(ingredient);
 		});
 		$scope.nomi='';
 		$scope.nombre=''; 
 	};			
}]);



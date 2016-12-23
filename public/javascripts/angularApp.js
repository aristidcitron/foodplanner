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

			.state('ingredientsdispo',{
				url:'/ingredientsdispo',
				views:{
					'page':{
						templateUrl:'/ingredientsdispo.html',
						controller:'IngredientsdispoCtrl',
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
	return o;

}])


app.controller('MainCtrl', [
'$scope',
'recettes',
function($scope,recettes){
  $scope.test = 'Hello world!';
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



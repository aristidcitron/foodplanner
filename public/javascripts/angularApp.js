var app = angular.module('foodplanner', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('home',{
				url:'/home',
				templateUrl:'/home.html',
				controller:'MainCtrl',
				resolve:{
					recettePromise:['recettes', function(recettes){
						return recettes.getAll();
					}]
				}
			})
			.state('recettes',{
				url: '/recettes/{id}',
				templateUrl:'/recettes.html',
				controller: 'RecettesCtrl',
				resolve: {
					recette:['$stateParams','recettes', function($stateParams, recettes){
						return recettes.getingredients($stateParams.id);
					}]
				}
			})
		$urlRouterProvider.otherwise ('home');


	}])

//méthodes d'appel a la bdd
app.factory('recettes',['$http', function($http){
	var o = {
		recettes:[]
	};
	o.getAll = function(){
		return $http.get('/recettes').success(function(data){
			angular.copy(data,o.recettes);
		});
	};
	o.getingredients = function(id){
		return $http.get('/recettes/'+ id).then(function(res){
			return res.data;
		});
	};

	o.createrecette=function(recette){
		return $http.post('/recettes', recette).success(function(data){
			o.recettes.push(data)
		});
	};
	o.upvote = function (recette){
		return $http.put('/recettes/' + recette._id + '/upvote').success(function(data){
			recette.upvotes +=1;
		});
	};
	o.addingredient = function(id, ingredient){
		return $http.post('/recettes/' + id + '/ingredients', ingredient);
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
 		if ($scope.nomr ===''|| $scope.tempsdecuisson <1|| $scope.tempsdepreparation <1) { return; }
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
 	}

 	$scope.incrementUpvotes = function(recette){
 		recettes.upvote(recette);
 	}

	$scope.supprimerRecette = function(index) { 
		$scope.recettes.splice(index,1);
	}
	

}]);
app.controller('RecettesCtrl', [
	'$scope',
	'$stateParams',
	'recettes',
	'recette',
function($scope,$stateParams,recettes,recette){
	$scope.recette = recette;
	$scope.ajouterIngredient = function() {
 		if ($scope.nomi ==='') { return; }
 		recettes.addingredient(recette._id, {
 			nomi: $scope.nomi,
 			nombre: $scope.nombre,
 		}).success(function(ingredient){
 			$scope.recette.ingredients.push(ingredient);
 		});
 		$scope.nomi='';
 		$scope.nombre=''; 

 	}			
}])
;
var app = angular.module('foodplanner', ['ui.router']);

app.config([
	'$stateProvider',
	'$urlRouterProvider',
	function($stateProvider, $urlRouterProvider){
		$stateProvider
			.state('home',{
				url:'/home',
				templateUrl:'/home.html',
				controller:'MainCtrl'
			})
			.state('recettes',{
				url: '/recettes/{id}',
				templateUrl:'/recettes.html',
				controller: 'RecettesCtrl'
			})
		$urlRouterProvider.otherwise ('home');


	}])

app.factory('recettes',[function(){
	var o = {
		recettes:[]
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
 		if ($scope.nom ===''|| $scope.tempsdecuisson <1|| $scope.tempsdepreparation <1) { return; }
 		$scope.recettes.push ({
 			nom: $scope.nom,
 			upvotes: 0,
 			tempsdecuisson: $scope.tempsdecuisson,
 			tempsdepreparation:$scope.tempsdepreparation,
 			insctructions:$scope.instructions,
 			ingredients:[
 				{nom: 'carottes',nombre: '200'},
 				{nom: 'tomates',nombre: '300'},
 			]
 		});
 		$scope.nom='';
 		$scope.tempsdepreparation='';
 		$scope.tempsdecuisson='';
 		$scope.instructions='';
 	}

 	$scope.incrementUpvotes = function(recette){
 		recette.upvotes +=1;
 	}

	$scope.supprimerRecette = function(index) { 
		$scope.recettes.splice(index,1);
	}
	

}]);
app.controller('RecettesCtrl', [
	'$scope',
	'$stateParams',
	'recettes',
function($scope,$stateParams,recettes){
	$scope.recette = recettes.recettes[$stateParams.id];

	$scope.ajouterIngredient = function() {
 		if ($scope.nom ==='') { return; }
 		$scope.recette.ingredients.push ({
 			nom: $scope.nom,
 			nombre: $scope.nombre,
 		});
 		$scope.nom='';
 		$scope.nombre=''; 
 	}			
}])
;
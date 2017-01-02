var app = angular.module('foodplanner', ['ui.router', 'angular.filter']);

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
						controller:'NavCtrl',
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

					},
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})


			.state('planning',{
				url:'/planning',
				views:{
					'page':{
						templateUrl:'/planning.html',
						controller:'PlanningCtrl',
						resolve:{
							recettePromise:['recettes', function(recettes){
								return recettes.getAll();
							}]
						}
					},
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
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
							}],
							ingredientsdispoPromise:['ingredientsdispos', function(ingredientsdispos){
								return ingredientsdispos.getIngredientsdispo();
							}]
						}
					},
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
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

		o.getingredients2 = function(id){
		return $http.get('/recettes/'+ id);
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

	o.updatenombre = function (ingredient,ingredient){
		return $http.put('/ingredients/' + ingredient._id, ingredient);
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




app.controller('PlanningCtrl', [
'$scope',
'recettes',
function($scope,recettes){
  $scope.recettes = recettes.recettes;

  $scope.genererplanning = function(recettes){
  	$scope.planningrecettes = recettes;
  	    var j, x, i;
    for (i = $scope.planningrecettes.length; i; i--) {
	        j = Math.floor(Math.random() * i);
	        x = $scope.planningrecettes[i - 1];
	        $scope.planningrecettes[i - 1] = $scope.planningrecettes[j];
	        $scope.planningrecettes[j] = x;
    	}
    $scope.planningrecettes = $scope.planningrecettes.slice(0,14)	
	};
 	$scope.validernombrepersonnes = function() {
 		$scope.planningvalides = [
	 		{idrecette :$scope.planningrecettes[0]._id, nombrepersonne: $scope.repaspresent0},
	 		{idrecette :$scope.planningrecettes[1]._id, nombrepersonne: $scope.repaspresent1},
	 		{idrecette :$scope.planningrecettes[2]._id, nombrepersonne: $scope.repaspresent2},
	 		{idrecette :$scope.planningrecettes[3]._id, nombrepersonne: $scope.repaspresent3},
	  		{idrecette :$scope.planningrecettes[4]._id, nombrepersonne: $scope.repaspresent4},
	  		{idrecette :$scope.planningrecettes[5]._id, nombrepersonne: $scope.repaspresent5},
	 		{idrecette :$scope.planningrecettes[6]._id, nombrepersonne: $scope.repaspresent6},
	 		{idrecette :$scope.planningrecettes[7]._id, nombrepersonne: $scope.repaspresent7},	  		 				 		
	 		{idrecette :$scope.planningrecettes[8]._id, nombrepersonne: $scope.repaspresent8},
	 		{idrecette :$scope.planningrecettes[9]._id, nombrepersonne: $scope.repaspresent9},
	 		{idrecette :$scope.planningrecettes[10]._id, nombrepersonne: $scope.repaspresent10},
	  		{idrecette :$scope.planningrecettes[11]._id, nombrepersonne: $scope.repaspresent11},
	  		{idrecette :$scope.planningrecettes[12]._id, nombrepersonne: $scope.repaspresent12},
	 		{idrecette :$scope.planningrecettes[13]._id, nombrepersonne: $scope.repaspresent13},
 		];
 		var i=0;
 		var j=0;
 		var donneestemp1 = [];
 		var donneestemp2 = [];
 		for ( i=0;i<14;i++){
 			recettes.getingredients2($scope.planningrecettes[i]._id).success(function(data){
				donneestemp2 = data.ingredients;
//				for (j=0;j<donneestemp2.length-1;j++){
//					donneestemp2[j].nombre=donneestemp2[j].nombre * $scope.planningvalides[i].nombrepersonne;
//					};
				$scope.donnees= donneestemp1.concat(donneestemp2);
				donneestemp1=$scope.donnees;
				});
 		};
 		donneestemp1 = [];
 		donneestemp2 = [];	

 	};

 	$scope.genererliste = function() {
 		var i=0;
 		var j=0;
 		$scope.coucou=1;
 		for (i=0; i<$scope.donnees.length; i++){
 			for (j=0; j<14; j++){
 				if ($scope.donnees[i].recette == $scope.planningvalides[j].idrecette){
 						if ( typeof $scope.planningvalides[j].nombrepersonne !== 'undefined') {
 							$scope.donnees[i].nombre = $scope.donnees[i].nombre*$scope.planningvalides[j].nombrepersonne;
 						} else{
 							$scope.donnees[i].nombre = 0;
 						}
 					
 					};
 			};
 		};
 		for (i=0; i<$scope.donnees.length; i++){
 			if ($scope.donnees[i].nombre==0){
 				$scope.donnees.splice(i, 1);
 				i=i-1;
 			};
 		};
 	};
 		//}
	$scope.getVolumeSum = function(items) {
    return items
        .map(function(x) { return x.nombre; })
        .reduce(function(a, b) { return a + b; });
	};	 	



	$scope.editRepas = function (planningrecette) {
        planningrecette.editing = true;
    };
//test d'édition des recettes
   // $scope.doneEditingRepas = function (planningrecette) {
    //    planningrecette.editing = false;
    //    planningrecette._id=toto;
	//	};
}]);





app.controller('NavCtrl', [
	'$scope',
	'$state',
function widgetsController($scope, $state) {
    $scope.$state = $state;
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
        recettes.updatenombre(ingredient, ingredient)
		};
        //dong some background ajax calling for persistence...
    	
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

 
}]);



var app = angular.module('foodplanner', ['ngMessages','ui.router','ui.bootstrap', 'angular.filter', 'angular-filepicker','chart.js']);




app.config([
	'$stateProvider',
	'$urlRouterProvider',
	'filepickerProvider',
	function($stateProvider, $urlRouterProvider, filepickerProvider){
		$stateProvider
			.state('index',{
				url:'/index',
				views:{
					'page':{
						templateUrl:'/index.html',
						controller:'IndexCtrl',			

					},
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})

			.state('home',{
				url:'/recettes',
				views:{
					'page':{
						templateUrl:'/recettes.html',
						controller:'MainCtrl',						
						resolve:{
							//simpleObj:['auth', function(auth){return auth.currentUser();}],
							//var currentUser = auth.currentUser(),
							recettePromise:['recettes','auth', function(recettes,auth){
								return recettes.getAllUser(auth.currentUser());
							}]
						}
					},
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})





			.state('mesplannings',{
				url:'/mesplannings',
				views:{
					'page':{
						templateUrl:'/mesplannings.html',
						controller:'MesplanningsCtrl',						
						resolve:{
							recettePromise:['recettes','auth', function(recettes,auth){
								return recettes.getplannings(auth.currentUser());
							}]
						}
					},
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})




			.state('contact',{
				url:'/contact',
				views:{
					'page':{
						templateUrl:'/contact.html',
						controller:'ContactCtrl',	
						resolve: {
							contactPromise:['recettes','auth', function(recettes,auth){
								return recettes.getuserinfo(auth.currentUser());
							}]						
						},											

					},	
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
					}

				}})







			.state('ajouterrecette',{
				url:'/ajouterrecette',
				views:{
					'page':{
						templateUrl:'/ajouterrecette.html',
						controller:'ajouterrecetteCtrl',						
						resolve: {
							ingredientsdispoPromise:['ingredientsdispos', function(ingredientsdispos){
								return ingredientsdispos.getIngredientsdispo();
							}]						
						},
					},	
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
					}

				}})



			.state('login',{
				url:'/login',
				views:{
					'page':{
						templateUrl:'/login.html',
						controller:'AuthCtrl',
						onEnter: ['$state','auth', function($state,auth){
							if(auth.isLoggedIn()){
								$state.go('home');
							}
						}]						
					},
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})

			.state('register',{
				url:'/register',
				views:{
					'page':{
						templateUrl:'/register.html',
						controller:'AuthCtrl',
						onEnter: ['$state','auth', function($state,auth){
							if(auth.isLoggedIn()){
								$state.go('home');
							}
						}]						
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
							}],
							recette2Promise:['recettes','auth', function(recettes,auth){
								return recettes.getAllUser(auth.currentUser());
							}]							
						}
					},
					'menu':{
						templateUrl:'/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})



			.state('plannings',{
				url: '/plannings/{id}',				
				views:{
					'page':{

						templateUrl:'/planning.html',
						controller: '1planningCtrl',
						resolve: {
							recette:['$stateParams','recettes', function($stateParams, recettes){
								return recettes.getplanningdetails($stateParams.id);
							}],							
							recettePromise:['recettes', function(recettes){
								return recettes.getAll();
							}],
							recette2Promise:['recettes','auth', function(recettes,auth){
								return recettes.getAllUser(auth.currentUser());
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

						templateUrl:'/ajouterrecette.html',
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
		$urlRouterProvider.otherwise ('index');
		filepickerProvider.setKey('AP8r820JEQiqGqRVOddP0z');

	}])

app.factory('auth', ['$http', '$window', function($http, $window){
	var auth = {};
	auth.saveToken = function(token) {
		$window.localStorage['foodplanner-token'] = token;

	}
	auth.getToken=function(){
		return $window.localStorage['foodplanner-token'];
	}
	auth.isLoggedIn = function(){
		var token = auth.getToken();
		if(token){
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.exp > Date.now() / 1000;
		} else{
			return false;
		}
	}

	auth.currentUser = function(){
		if (auth.isLoggedIn()){
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
			return payload.username;



		}
	}



	auth.register = function(user){
		return $http.post('/register', user).success(function(data){
			auth.saveToken(data.token);
		});
	}

		auth.logIn = function(user){
		return $http.post('/login', user).success(function(data){
			auth.saveToken(data.token);
		});
	}




	auth.logOut = function(){
		$window.localStorage.removeItem('foodplanner-token');
	}

	return auth; 
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

app.factory('recettes',['$http', 'auth', function($http, auth){
	var o = {
		recettes:[]
	};


	o.getuserinfo = function(user){
		return $http.get('/user/'+ user).success(function(data){
			o.userinfo=data; console.log(o.userinfo);
		});
	};

	// récupérer la liste de toutes les recettes d'un user
	o.getplannings = function(id){
		return $http.get('/mesplannings/'+ id).success(function(data){
			angular.copy(data,o.recettes);console.log(o.recettes);
		});
	};

	// ajouter un nouve planning
	o.createplanning=function(planning){console.log(planning);
		return $http.post('/plannings', planning,{
   			 	headers: {Authorization: 'Bearer '+auth.getToken()}
 			 }).success(function(data){console.log(data);});
	};	



	// récupérer un détail de planning
	o.getplanningdetails = function(id){
		return $http.get('/plannings/'+ id).success(function(data){
			angular.copy(data,o.plannings);o.plannings= data;
		});
	};




	// supprimer un planning
	o.deleteplanning = function (planning){
		return $http.delete('/plannings/' + planning._id);
	};	


	
	// récupérer la liste de toutes les recettes 
	o.getAll = function(){
		return $http.get('/recettes').success(function(data){
			angular.copy(data,o.recettes);
		});
	};


	// récupérer lune recette aléatoire 
	o.getrecettealea = function(){
		return $http.get('/recettealea').success(function(data){
			angular.copy(data,o.recettealea);
		});
	};


	// récupérer la liste des courses
	o.getlistedecourses = function(planningenvoyes){
		return $http.post('/listedecourses',planningenvoyes).success(function(data){console.log(data);
			angular.copy(data,o.planningenvoyes);
	});};



	// récupérer la liste des courses
	o.sendmail = function(mail){
		return $http.post('/pushmail/',mail).success(function(data){
			angular.copy(data);
	});};



	// récupérer la liste de toutes les recettes d'un user
	o.getAllUser = function(id){
		return $http.get('/recettesuser/'+ id).success(function(data){
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
		return  $http.post('/recettes', recette,{
   			 	headers: {Authorization: 'Bearer '+auth.getToken()}
 			 }).success(function(data){
			o.recettes.push(data);
			console.log(data._id);
		});
	};









	o.createrecettecomplette=function(recette){
		return   $http.post('/recettes', recette,{
   			 	headers: {Authorization: 'Bearer '+auth.getToken()}
 			 })
	};








	// upvote une recette
	o.upvote = function (recette){
		return $http.put('/recettes/' + recette._id + '/upvote').success(function(data){
			recette.upvotes +=1;
		});
	};
	// ajouter un ingredient	
	o.addingredient = function(id, ingredient){
		console.log(ingredient); return $http.post('/recettes/' + id + '/ingredients', ingredient);
	};
	// supprimer une recette
	o.deleterecette = function (recette){
		return 	 $http.delete('/recettes/' + recette._id,{
   			 	headers: {Authorization: 'Bearer '+auth.getToken()}
 			 }).success(function(data){	console.log(data);});
	};

	o.deleteingredient = function (recette, ingredient){
		return $http.delete('/recettes/' + recette._id + '/ingredients/' + ingredient._id);
	};	

	o.updatenombre = function (ingredient,ingredient){
		return $http.put('/ingredients/' + ingredient._id, ingredient);
	};	









	o.updaterecette = function (recette){
		return $http.put('/recettes/' + recette._id, recette,{
   			 	headers: {Authorization: 'Bearer '+auth.getToken()}
 			 }).success(function(data){	console.log(data);});
	};











	return o;
}])


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




app.controller('MainCtrl', [
'$scope',
'recettes',
'auth',
function($scope,recettes,auth){
  $scope.recettes = recettes.recettes;
  $scope.currentUser = auth.currentUser;
  $scope.isLoggedIn = auth.isLoggedIn;


 	$scope.incrementUpvotes = function(recette){
 		recettes.upvote(recette);
 	};

	$scope.supprimerRecette = function(recette) {
		var tampon=recette;
		recettes.deleterecette(recette).error(function(error){
      $scope.error = error;
    }).success(function(recette){
			$scope.recettes.splice($scope.recettes.indexOf(tampon),1);
		})};
  	$scope.sendmail = function () {
  	console.log('coucou');  		
  		recettes.sendmail();
    };  

	}]);







app.controller('PlanningCtrl', [
'$scope',
'$modal',
'$state',
'$log',
'recettes',
'auth',
function($scope,$modal,$state,$log,recettes,auth){

    $scope.values = ["0","1","2","3","4","5","6"];
    $scope.selectedItem = 0;
    $scope.date = new Date();
    $scope.currentUser = auth.currentUser;
    $scope.isLoggedIn = auth.isLoggedIn;  
    $scope.planning = [];
    $scope.planning.nomp = 'ma recette';

    $scope.jours=[
    	{id:1,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date:$scope.date.setDate($scope.date.getDate())},
    	{id:2,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: $scope.date.setDate($scope.date.getDate() + 1)},
     	{id:3,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: $scope.date.setDate($scope.date.getDate() + 1)},
     	{id:4,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: $scope.date.setDate($scope.date.getDate() + 1)},    	  	
    	{id:5,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: $scope.date.setDate($scope.date.getDate() + 1)},
     	{id:6,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: $scope.date.setDate($scope.date.getDate() + 1)},
     	{id:7,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: $scope.date.setDate($scope.date.getDate() + 1)},
     	    ];   

   $scope.changemidi=function(jour){
   	jour.portionrestantemidi=-1;
   	tampon = jour.midi.portionmini;
   	while (jour.portionrestantemidi<0){
   	jour.portionrestantemidi = tampon-jour.nbpersmidi;
   	tampon = tampon+jour.midi.portionmini;};
   };



    $scope.changesoir=function(jour){

   	jour.portionrestantesoir=-1;
   	tampon = jour.soir.portionmini;
   	while (jour.portionrestantesoir<0){
   	jour.portionrestantesoir = tampon-jour.nbperssoir;
   	tampon = tampon+jour.soir.portionmini;};
   };

  $scope.delete = function(jour,moment){
 		var index = jour.id-1; 	
 		if (moment === 'midi'){
		$scope.jours[index].midi = "";
		$scope.jours[index].nbpersmidi = "";
		$scope.jours[index].portionrestantemidi="";
	}{
		$scope.jours[index].soir = "";
		$scope.jours[index].nbperssoir = "";
		$scope.jours[index].portionrestantesoir="";
	};

//MAJ du graphe
		$scope.date = new Date();
		$scope.semainefr=new Array("Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam","Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam");
		  $scope.labels = [$scope.semainefr[$scope.date.getDay()] +' midi', $scope.semainefr[$scope.date.getDay()] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+1] +' midi', $scope.semainefr[$scope.date.getDay()+1] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+2] +' midi', $scope.semainefr[$scope.date.getDay()+2] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+3] +' midi', $scope.semainefr[$scope.date.getDay()+3] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+4] +' midi', $scope.semainefr[$scope.date.getDay()+4] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+5] +' midi', $scope.semainefr[$scope.date.getDay()+5] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+6] +' midi', $scope.semainefr[$scope.date.getDay()+6] +' soir',
		  					];
		  $scope.series = ['glucides','Lipides', 'Protides'];
		  $scope.data = [
		    [$scope.jours[0].midi.glucide,$scope.jours[0].soir.glucide,
		    $scope.jours[1].midi.glucide,$scope.jours[1].soir.glucide,
			$scope.jours[2].midi.glucide,$scope.jours[2].soir.glucide,
		    $scope.jours[3].midi.glucide,$scope.jours[3].soir.glucide,
			$scope.jours[4].midi.glucide,$scope.jours[4].soir.glucide,
		    $scope.jours[5].midi.glucide,$scope.jours[5].soir.glucide,
			$scope.jours[6].midi.glucide,$scope.jours[6].soir.glucide,],
		    [$scope.jours[0].midi.lipide,$scope.jours[0].soir.lipide,
		    $scope.jours[1].midi.lipide,$scope.jours[1].soir.lipide,
			$scope.jours[2].midi.lipide,$scope.jours[2].soir.lipide,
		    $scope.jours[3].midi.lipide,$scope.jours[3].soir.lipide,
			$scope.jours[4].midi.lipide,$scope.jours[4].soir.lipide,
		    $scope.jours[5].midi.lipide,$scope.jours[5].soir.lipide,
			$scope.jours[6].midi.lipide,$scope.jours[6].soir.lipide,],
		    [$scope.jours[0].midi.protide,$scope.jours[0].soir.protide,
		    $scope.jours[1].midi.protide,$scope.jours[1].soir.protide,
			$scope.jours[2].midi.protide,$scope.jours[2].soir.protide,
		    $scope.jours[3].midi.protide,$scope.jours[3].soir.protide,
			$scope.jours[4].midi.protide,$scope.jours[4].soir.protide,
		    $scope.jours[5].midi.protide,$scope.jours[5].soir.protide,
			$scope.jours[6].midi.protide,$scope.jours[6].soir.protide,],
		  ];



		  $scope.labels2 = $scope.labels;
		  $scope.series2 = ['Prix','Calories'];
		  $scope.data2 = [
		    [$scope.jours[0].midi.prix,$scope.jours[0].soir.prix,
		    $scope.jours[1].midi.prix,$scope.jours[1].soir.prix,
			$scope.jours[2].midi.prix,$scope.jours[2].soir.prix,
		    $scope.jours[3].midi.prix,$scope.jours[3].soir.prix,
			$scope.jours[4].midi.prix,$scope.jours[4].soir.prix,
		    $scope.jours[5].midi.prix,$scope.jours[5].soir.prix,
			$scope.jours[6].midi.prix,$scope.jours[6].soir.prix,],
		    [$scope.jours[0].midi.calories,$scope.jours[0].soir.calories,
		    $scope.jours[1].midi.calories,$scope.jours[1].soir.calories,
			$scope.jours[2].midi.calories,$scope.jours[2].soir.calories,
		    $scope.jours[3].midi.calories,$scope.jours[3].soir.calories,
			$scope.jours[4].midi.calories,$scope.jours[4].soir.calories,
		    $scope.jours[5].midi.calories,$scope.jours[5].soir.calories,
			$scope.jours[6].midi.calories,$scope.jours[6].soir.calories,],
		  ];
	};



  $scope.ajouterrepasalea = function(jour,moment){
	recettes.getrecettealea().success(function(recettealea){
		var index = jour.id-1;
		var varmoment = moment;
		$scope.jours[index][varmoment]=recettealea;
		if (moment === "midi") {
			if (jour.nbpersmidi!=0){
				$scope.changemidi(jour)
			}
			
		}{
			if (jour.nbperssoir!=0){
				$scope.changesoir(jour)
			}	
		}
	})
			$scope.date = new Date();
		$scope.semainefr=new Array("Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam","Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam");
		  $scope.labels = [$scope.semainefr[$scope.date.getDay()] +' midi', $scope.semainefr[$scope.date.getDay()] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+1] +' midi', $scope.semainefr[$scope.date.getDay()+1] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+2] +' midi', $scope.semainefr[$scope.date.getDay()+2] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+3] +' midi', $scope.semainefr[$scope.date.getDay()+3] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+4] +' midi', $scope.semainefr[$scope.date.getDay()+4] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+5] +' midi', $scope.semainefr[$scope.date.getDay()+5] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+6] +' midi', $scope.semainefr[$scope.date.getDay()+6] +' soir',
		  					];
		  $scope.series = ['glucides','Lipides', 'Protides',];
		  $scope.data = [
		    [$scope.jours[0].midi.glucide,$scope.jours[0].soir.glucide,
		    $scope.jours[1].midi.glucide,$scope.jours[1].soir.glucide,
			$scope.jours[2].midi.glucide,$scope.jours[2].soir.glucide,
		    $scope.jours[3].midi.glucide,$scope.jours[3].soir.glucide,
			$scope.jours[4].midi.glucide,$scope.jours[4].soir.glucide,
		    $scope.jours[5].midi.glucide,$scope.jours[5].soir.glucide,
			$scope.jours[6].midi.glucide,$scope.jours[6].soir.glucide,],
		    [$scope.jours[0].midi.lipide,$scope.jours[0].soir.lipide,
		    $scope.jours[1].midi.lipide,$scope.jours[1].soir.lipide,
			$scope.jours[2].midi.lipide,$scope.jours[2].soir.lipide,
		    $scope.jours[3].midi.lipide,$scope.jours[3].soir.lipide,
			$scope.jours[4].midi.lipide,$scope.jours[4].soir.lipide,
		    $scope.jours[5].midi.lipide,$scope.jours[5].soir.lipide,
			$scope.jours[6].midi.lipide,$scope.jours[6].soir.lipide,],
		    [$scope.jours[0].midi.protide,$scope.jours[0].soir.protide,
		    $scope.jours[1].midi.protide,$scope.jours[1].soir.protide,
			$scope.jours[2].midi.protide,$scope.jours[2].soir.protide,
		    $scope.jours[3].midi.protide,$scope.jours[3].soir.protide,
			$scope.jours[4].midi.protide,$scope.jours[4].soir.protide,
		    $scope.jours[5].midi.protide,$scope.jours[5].soir.protide,
			$scope.jours[6].midi.protide,$scope.jours[6].soir.protide,],
		  ];

		  $scope.labels2 = $scope.labels;
		  $scope.series2 = ['Prix','Calories'];
		  $scope.data2 = [
		    [$scope.jours[0].midi.prix,$scope.jours[0].soir.prix,
		    $scope.jours[1].midi.prix,$scope.jours[1].soir.prix,
			$scope.jours[2].midi.prix,$scope.jours[2].soir.prix,
		    $scope.jours[3].midi.prix,$scope.jours[3].soir.prix,
			$scope.jours[4].midi.prix,$scope.jours[4].soir.prix,
		    $scope.jours[5].midi.prix,$scope.jours[5].soir.prix,
			$scope.jours[6].midi.prix,$scope.jours[6].soir.prix,],
		    [$scope.jours[0].midi.calories,$scope.jours[0].soir.calories,
		    $scope.jours[1].midi.calories,$scope.jours[1].soir.calories,
			$scope.jours[2].midi.calories,$scope.jours[2].soir.calories,
		    $scope.jours[3].midi.calories,$scope.jours[3].soir.calories,
			$scope.jours[4].midi.calories,$scope.jours[4].soir.calories,
		    $scope.jours[5].midi.calories,$scope.jours[5].soir.calories,
			$scope.jours[6].midi.calories,$scope.jours[6].soir.calories,],
		  ];		  
 };

// edition des repas
	var k;
   $scope.open = function (jour,moment) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
   	  scope: $scope,
      resolve: {  	
        items: function () {
          return $scope.items;
         },
        jour: function(){
          return jour;
         },
        moment: function(){
          return moment;
         }         
       }
    });

    modalInstance.result.then(function (recette) {
      	var index = jour.id-1;
		var varmoment = moment;
		$scope.jours[index][varmoment]=recette;
		if (moment === "midi") {
			if (jour.nbpersmidi!=0){
				$scope.changemidi(jour)
			}
			
		}{
			if (jour.nbperssoir!=0){
				$scope.changesoir(jour)
			}	
		}		

//MAJ du graphe
		$scope.date = new Date();
		$scope.semainefr=new Array("Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam","Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam");
		  $scope.labels = [$scope.semainefr[$scope.date.getDay()] +' midi', $scope.semainefr[$scope.date.getDay()] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+1] +' midi', $scope.semainefr[$scope.date.getDay()+1] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+2] +' midi', $scope.semainefr[$scope.date.getDay()+2] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+3] +' midi', $scope.semainefr[$scope.date.getDay()+3] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+4] +' midi', $scope.semainefr[$scope.date.getDay()+4] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+5] +' midi', $scope.semainefr[$scope.date.getDay()+5] +' soir',
		  					$scope.semainefr[$scope.date.getDay()+6] +' midi', $scope.semainefr[$scope.date.getDay()+6] +' soir',
		  					];
		  $scope.series = ['glucides','Lipides', 'Protides',];
		  $scope.data = [
		    [$scope.jours[0].midi.glucide,$scope.jours[0].soir.glucide,
		    $scope.jours[1].midi.glucide,$scope.jours[1].soir.glucide,
			$scope.jours[2].midi.glucide,$scope.jours[2].soir.glucide,
		    $scope.jours[3].midi.glucide,$scope.jours[3].soir.glucide,
			$scope.jours[4].midi.glucide,$scope.jours[4].soir.glucide,
		    $scope.jours[5].midi.glucide,$scope.jours[5].soir.glucide,
			$scope.jours[6].midi.glucide,$scope.jours[6].soir.glucide,],
		    [$scope.jours[0].midi.lipide,$scope.jours[0].soir.lipide,
		    $scope.jours[1].midi.lipide,$scope.jours[1].soir.lipide,
			$scope.jours[2].midi.lipide,$scope.jours[2].soir.lipide,
		    $scope.jours[3].midi.lipide,$scope.jours[3].soir.lipide,
			$scope.jours[4].midi.lipide,$scope.jours[4].soir.lipide,
		    $scope.jours[5].midi.lipide,$scope.jours[5].soir.lipide,
			$scope.jours[6].midi.lipide,$scope.jours[6].soir.lipide,],
		    [$scope.jours[0].midi.protide,$scope.jours[0].soir.protide,
		    $scope.jours[1].midi.protide,$scope.jours[1].soir.protide,
			$scope.jours[2].midi.protide,$scope.jours[2].soir.protide,
		    $scope.jours[3].midi.protide,$scope.jours[3].soir.protide,
			$scope.jours[4].midi.protide,$scope.jours[4].soir.protide,
		    $scope.jours[5].midi.protide,$scope.jours[5].soir.protide,
			$scope.jours[6].midi.protide,$scope.jours[6].soir.protide,],
		  ];
		  $scope.labels2 = $scope.labels;
		  $scope.series2 = ['Prix','Calories'];
		  $scope.data2 = [
		    [$scope.jours[0].midi.prix,$scope.jours[0].soir.prix,
		    $scope.jours[1].midi.prix,$scope.jours[1].soir.prix,
			$scope.jours[2].midi.prix,$scope.jours[2].soir.prix,
		    $scope.jours[3].midi.prix,$scope.jours[3].soir.prix,
			$scope.jours[4].midi.prix,$scope.jours[4].soir.prix,
		    $scope.jours[5].midi.prix,$scope.jours[5].soir.prix,
			$scope.jours[6].midi.prix,$scope.jours[6].soir.prix,],
		    [$scope.jours[0].midi.calories,$scope.jours[0].soir.calories,
		    $scope.jours[1].midi.calories,$scope.jours[1].soir.calories,
			$scope.jours[2].midi.calories,$scope.jours[2].soir.calories,
		    $scope.jours[3].midi.calories,$scope.jours[3].soir.calories,
			$scope.jours[4].midi.calories,$scope.jours[4].soir.calories,
		    $scope.jours[5].midi.calories,$scope.jours[5].soir.calories,
			$scope.jours[6].midi.calories,$scope.jours[6].soir.calories,],
		  ];



    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };



 $scope.genererplanning2 = function(jours,planningvalides){
    $scope.planningvalides= [];
    $scope.planningenvoyes= [];    
 	for (var i=0; i<7; i++) {
 	$scope.planningvalides[i] =
 	{idrecette:$scope.jours[i].midi._id,nbpers:$scope.jours[i].nbpersmidi};};
 	for (var i=7; i<14;i++){
  	$scope.planningvalides[i] =
 	{idrecette:$scope.jours[i-7].soir._id,nbpers:$scope.jours[i-7].nbperssoir};};

 	for (var i=0; i<13; i++) {
		if (typeof $scope.planningvalides[i].idrecette !== 'undefined') {
			if ( $scope.planningvalides[i].nbpers>0) {		
				 $scope.planningenvoyes.push($scope.planningvalides[i]);
			}
		}
 	};
 	recettes.getlistedecourses($scope.planningenvoyes).success(function(data){$scope.test= data; $scope.listedecourses = $scope.test.liste; $scope.total=$scope.test.total});
 };





  $scope.recettes = recettes.recettes;




   $scope.open2 = function (jours,nom,listedecourses,currentUser) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent2.html',
      controller: 'ModalInstance2Ctrl',
   	  scope: $scope,
      resolve: {  	
        jours: function () {
          return $scope.jours;
         },
        listedecourses: function () {
          return $scope.listedecourses;
         },
        currentUser: function () {
          return $scope.currentUser;
         },                
       }
    });

    modalInstance.result.then(function () {
console.log(coucou) }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


  $scope.sauvegarderplanning = function() {
 		recettes.createplanning ({
 			nomp: $scope.nomp,
 			jours: $scope.jours,
 			listedecourses: $scope.listedecourses,
 			author: $scope.currentUser});
 	};




    $scope.editplanningename = function (planning) {
        planning.editingnomp = true;
    };

    $scope.doneeditplanningname = function (planning) {
        planning.editingnomp = false;
        $scope.planning.nomp = planning.nomp;
  		};





	$scope.editRepas = function (planningrecette) {
        planningrecette.editing = true;
    };




  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };


  //conf du graphe






}]);



// modal d'édition du repas
app.controller('ModalInstanceCtrl',
	function ($scope, $modalInstance, items, jour,moment) {
		$scope.jour=jour;
		$scope.moment=moment;		
 		 $scope.ok = function (recette,jour,moment) {
  			  $modalInstance.close(recette,jour,moment);
  		};

  		$scope.cancel = function () {
  			  $modalInstance.dismiss('cancel');
  		};
	}
);


// modal de sauvegarde d'un planning
app.controller('ModalInstance2Ctrl', [
'$scope',
'$modal',
'$state',
'$log',
'recettes',
'auth',
'$modalInstance',

function($scope,$modal,$state,$log,recettes,auth,$modalInstance,jour,nom,listedecourse,currentUser) {
		$scope.jour=jour;
		$scope.currentUser=currentUser;		
		$scope.listedecourse=listedecourse;		
	  $scope.ok = function(nom,jours,listedecourses,currentUser) {
	 		recettes.createplanning ({
	 			nomp: nom,
	 			jours: $scope.jours,
	 			listedecourses: $scope.listedecourses,
	 			author: $scope.currentUser});
	 		$modalInstance.close();
	 	};


  		$scope.cancel = function () {
  			  $modalInstance.dismiss('cancel');
  		};
	}]
);







app.controller('1planningCtrl', [
'$scope',
'$modal',
'$state',
'$log',
'recettes',
'auth',
function($scope,$modal,$state,$log,recettes,auth){
	$scope.plannings=recettes.plannings;
	$scope.jours=recettes.plannings[0].jours;
	$scope.listedecourses=recettes.plannings[0].listedecourses;
    $scope.values = ["0","1","2","3","4","5","6"];
    $scope.selectedItem = 0;
    $scope.date = new Date();
    $scope.currentUser = auth.currentUser;
    $scope.isLoggedIn = auth.isLoggedIn;  

   $scope.changemidi=function(jour){
   	jour.portionrestantemidi=-1;
   	tampon = jour.midi.portionmini;
   	while (jour.portionrestantemidi<0){
   	jour.portionrestantemidi = tampon-jour.nbpersmidi;
   	tampon = tampon+jour.midi.portionmini;};
   };



    $scope.changesoir=function(jour){

   	jour.portionrestantesoir=-1;
   	tampon = jour.soir.portionmini;
   	while (jour.portionrestantesoir<0){
   	jour.portionrestantesoir = tampon-jour.nbperssoir;
   	tampon = tampon+jour.soir.portionmini;};
   };

  $scope.delete = function(jour,moment){
 		var index = jour.id-1; 	
		$scope.jours[index].midi = "";
		$scope.jours[index].nbpersmidi = "";
		$scope.jours[index].portionrestantemidi="";
	};



  $scope.ajouterrepasalea = function(jour,moment){
	recettes.getrecettealea().success(function(recettealea){
		var index = jour.id-1;
		var varmoment = moment;
		$scope.jours[index][varmoment]=recettealea;
		if (moment === "midi") {
			if (jour.nbpersmidi!=0){
				$scope.changemidi(jour)
			}
			
		}{
			if (jour.nbperssoir!=0){
				$scope.changesoir(jour)
			}	
		}
	})
 };

// edition des repas
	var k;
   $scope.open = function (jour,moment) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent.html',
      controller: 'ModalInstanceCtrl',
   	  scope: $scope,
      resolve: {  	
        items: function () {
          return $scope.items;
         },
        jour: function(){
          return jour;
         },
        moment: function(){
          return moment;
         }         
       }
    });

    modalInstance.result.then(function (recette) {
      	var index = jour.id-1;
		var varmoment = moment;
		$scope.jours[index][varmoment]=recette;
		if (moment === "midi") {
			if (jour.nbpersmidi!=0){
				$scope.changemidi(jour)
			}
			
		}{
			if (jour.nbperssoir!=0){
				$scope.changesoir(jour)
			}	
		}			

    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };



   $scope.open2 = function (jours,nom,listedecourses,currentUser) {

    var modalInstance = $modal.open({
      templateUrl: 'myModalContent2.html',
      controller: 'ModalInstance2Ctrl',
   	  scope: $scope,
      resolve: {  	
        jours: function () {
          return $scope.jours;
         },
        listedecourses: function () {
          return $scope.listedecourses;
         },
        currentUser: function () {
          return $scope.currentUser;
         },                
       }
    });

    modalInstance.result.then(function () {
console.log(coucou) }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };


 $scope.genererplanning2 = function(jours,planningvalides){
    $scope.planningvalides= [];
    $scope.planningenvoyes= [];    
 	for (var i=0; i<7; i++) {
 	$scope.planningvalides[i] =
 	{idrecette:$scope.jours[i].midi._id,nbpers:$scope.jours[i].nbpersmidi};};
 	for (var i=7; i<14;i++){
  	$scope.planningvalides[i] =
 	{idrecette:$scope.jours[i-7].soir._id,nbpers:$scope.jours[i-7].nbperssoir};};

 	for (var i=0; i<13; i++) {
		if (typeof $scope.planningvalides[i].idrecette !== 'undefined') {
			if ( $scope.planningvalides[i].nbpers>0) {		
				 $scope.planningenvoyes.push($scope.planningvalides[i]);
			}
		}
 	};
 	recettes.getlistedecourses($scope.planningenvoyes).success(function(data){$scope.listedecourses = data;});
 };





  $scope.recettes = recettes.recettes;







  $scope.sauvegarderplanning = function() {
 		recettes.createplanning ({
 			jours: $scope.jours,
 			listedecourses: $scope.listedecourses,
 			author: $scope.currentUser});
 	};






















	$scope.editRepas = function (planningrecette) {
        planningrecette.editing = true;
    };












}]);



// modal d'édition du repas
app.controller('ModalInstanceCtrl',
	function ($scope, $modalInstance, items, jour,moment) {
		$scope.jour=jour;
		$scope.moment=moment;		
 		 $scope.ok = function (recette,jour,moment) {
  			  $modalInstance.close(recette,jour,moment);
  		};

  		$scope.cancel = function () {
  			  $modalInstance.dismiss('cancel');
  		};
	}
);







app.controller('ContactCtrl', [
	'$scope',
	'$state',
	'recettes',
	'auth',
function widgetsController($scope, $state,recettes,auth) {
  $scope.$state = $state;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.coucou = recettes.userinfo ;
  $scope.mail= [];
  $scope.mail.username=$scope.coucou.user;
  $scope.mail.mail=$scope.coucou.email;

  $scope.contact = function () {
  		
  		recettes.sendmail($scope.mail);
    };  

}]);





app.controller('MesplanningsCtrl', [
'$scope',
'$modal',
'$state',
'$log',
'recettes',
'auth',
function($scope,$modal,$state,$log,recettes,auth){


    $scope.currentUser = auth.currentUser;
    $scope.isLoggedIn = auth.isLoggedIn;  
    $scope.plannings = recettes.recettes;
  $scope.supprimerplanning = function(planning) {
  		var tampon=planning;
 		recettes.deleteplanning(planning).success(function(planning){
			$scope.plannings.splice($scope.plannings.indexOf(tampon),1);
		})
 	};


}]);













// modal d'édition du repas
app.controller('ModalInstanceCtrl',
	function ($scope, $modalInstance, items, jour,moment) {
		$scope.jour=jour;
		$scope.moment=moment;		
 		 $scope.ok = function (recette,jour,moment) {
  			  $modalInstance.close(recette,jour,moment);
  		};

  		$scope.cancel = function () {
  			  $modalInstance.dismiss('cancel');
  		};
	}
);





app.controller('AuthCtrl', [
'$scope',
'$state',
'auth',
function($scope, $state, auth){
  $scope.user = {};

  $scope.register = function(){
    auth.register($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };

  $scope.logIn = function(){
    auth.logIn($scope.user).error(function(error){
      $scope.error = error;
    }).then(function(){
      $state.go('home');
    });
  };
}])









app.controller('NavCtrl', [
	'$scope',
	'$state',
	'auth',
function widgetsController($scope, $state,auth) {
   $scope.$state = $state;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);



app.controller('IndexCtrl', [
	'$scope',
function ($scope){
  $scope.myInterval1 = 2000;
  $scope.myInterval2 = 1500;  
    $scope.myInterval3 = 2500; 
    $scope.myInterval4 = 3000;     
  $scope.slides1 = [
    {
      image: 'images/repas1.jpg'
    },
    {
      image: 'images/repas2.jpg'
    },
  ];
  $scope.slides2 = [
    {
      image: 'images/repas3.jpg'
    },
    {
      image: 'images/repas4.jpg'
    },
  ];
    $scope.slides3 = [
    {
      image: 'images/repas1.jpg'
    },
    {
      image: 'images/repas4.jpg'
    },
  ];
      $scope.slides4 = [
    {
      image: 'images/repas2.jpg'
    },
    {
      image: 'images/repas3.jpg'
    },
  ];
}]);



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



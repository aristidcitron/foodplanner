var app = angular.module('foodplanner', ['ui.bootstrap.datetimepicker','ngMessages','ui.router','ui.bootstrap', 'angular.filter', 'angular-filepicker','chart.js']);




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
						templateUrl:'/../javascripts/Pages/home.html',
						controller:'IndexCtrl',			

					},
					'menu':{
						templateUrl:'/../javascripts/Pages/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})

			.state('home',{
				url:'/recettes',
				views:{
					'page':{
						templateUrl:'/javascripts/pages/recettes.html',
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
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})





			.state('mesplannings',{
				url:'/mesplannings',
				views:{
					'page':{
						templateUrl:'/javascripts/pages/mesplannings.html',
						controller:'MesplanningsCtrl',						
						resolve:{
							recettePromise:['recettes','auth', function(recettes,auth){
								return recettes.getplannings(auth.currentUser());
							}]
						}
					},
					'menu':{
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})




			.state('contact',{
				url:'/contact',
				views:{
					'page':{
						templateUrl:'/javascripts/pages/contact.html',
						controller:'ContactCtrl',	
						resolve: {
							contactPromise:['recettes','auth', function(recettes,auth){
								return recettes.getuserinfo(auth.currentUser());
							}]						
						},											

					},	
					'menu':{
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}})







			.state('ajouterrecette',{
				url:'/ajouterrecette',
				views:{
					'page':{
						templateUrl:'/javascripts/pages/ajouterrecette.html',
						controller:'ajouterrecetteCtrl',						
						resolve: {
							ingredientsdispoPromise:['ingredientsdispos', function(ingredientsdispos){
								return ingredientsdispos.getIngredientsdispo();
							}]						
						},
					},	
					'menu':{
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}})



			.state('login',{
				url:'/login',
				views:{
					'page':{
						templateUrl:'/javascripts/pages/login.html',
						controller:'AuthCtrl',
						onEnter: ['$state','auth', function($state,auth){
							if(auth.isLoggedIn()){
								$state.go('home');
							}
						}]						
					},
					'menu':{
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})

			.state('register',{
				url:'/register',
				views:{
					'page':{
						templateUrl:'/javascripts/pages/register.html',
						controller:'AuthCtrl',
						onEnter: ['$state','auth', function($state,auth){
							if(auth.isLoggedIn()){
								$state.go('home');
							}
						}]						
					},
					'menu':{
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})

			.state('ingredientsdispos',{
				url:'/ingredientsdispos',
				views:{
					'page':{
						templateUrl:'/javascripts/pages/ingredientsdispos.html',
						controller:'IngredientsdisposCtrl',
						resolve:{
							ingredientsdispoPromise:['ingredientsdispos', function(ingredientsdispos){
								return ingredientsdispos.getIngredientsdispo();
							}]
						}

					},
					'menu':{
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})


			.state('planning',{
				url:'/planning',
				views:{
					'page':{
						templateUrl:'/javascripts/pages/planning.html',
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
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})



			.state('plannings',{
				url: '/plannings/{id}',				
				views:{
					'page':{

						templateUrl:'/javascripts/pages/planning.html',
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
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}		
			})


			.state('listedecourses',{
				url:'/listedecourses',
				views:{
					'page':{
						templateUrl:'/javascripts/pages/listedecourses.html',
						controller:'ListedecoursesCtrl',
						resolve:{
							recettePromise:['recettes','auth', function(recettes,auth){
								return recettes.getliste();
							}],
							ingredientsdispoPromise:['ingredientsdispos', function(ingredientsdispos){
								return ingredientsdispos.getIngredientsdispo();
							}]
						
						}
					},
					'menu':{
						templateUrl:'/javascripts/pages/menu.html',
						controller:'NavCtrl',
					}

				}
				
			})





			.state('recettes',{
				url: '/recettes/{id}',				
				views:{
					'page':{

						templateUrl:'/javascripts/pages/ajouterrecette.html',
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
						templateUrl:'/javascripts/pages/menu.html',
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



	//envoyer un mail
	o.sendmail = function(mail){
		return $http.post('/pushmail/',mail).success(function(data){
			angular.copy(data);
	});};



	//envoyer un event
	o.sendevent = function(jours){
		return $http.post('/pushevent/',jours,{
   			 	headers: {Authorization: 'Bearer '+auth.getToken()}
 			 }).success(function(data){
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





	// Mettre a jour la liste de course
	o.updatelistedecourses = function (listedecourses){
		return $http.put('/liste/',listedecourses, {
   			 	headers: {Authorization: 'Bearer '+auth.getToken()}
 			 }).success(function(data){
			console.log(data);
		});
	};

	o.getliste = function (listedecourses){
		return $http.get('/liste/',{
   			 	headers: {Authorization: 'Bearer '+auth.getToken()}
 			 }).success(function(data){
 			 o.listedecourses = data		
			
		});

	};




	return o;
}])



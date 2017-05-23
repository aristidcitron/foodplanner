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

app.controller('ListedecoursesCtrl', [
'$scope',
'$modal',
'$state',
'$log',
'recettes',
'auth',
function($scope,$modal,$state,$log,recettes,auth){


    $scope.currentUser = auth.currentUser;
    $scope.isLoggedIn = auth.isLoggedIn;  
    $scope.listedecourses = recettes.listedecourses;


  $scope.fait = function(listedecourse) {
  		if($scope.listedecourses[$scope.listedecourses.indexOf(listedecourse)].status==="todo93"){
  		$scope.listedecourses[$scope.listedecourses.indexOf(listedecourse)].status="done93";} else
  		{$scope.listedecourses[$scope.listedecourses.indexOf(listedecourse)].status="todo93";};
  		recettes.updatelistedecourses($scope.listedecourses);
 	
 	};


	$scope.edit = function (listedecourde) {
        listedecourde.editing = true;
    };

    $scope.doneEditing = function (listedecourde) {
        listedecourde.editing = false;
  		recettes.updatelistedecourses($scope.listedecourses);
		};



   $scope.modalajoutlistedecourses = function (currentUser) {

    var modalInstance = $modal.open({
      templateUrl: '/../javascripts/pages/Modalajoutlistedecourses.html',
      controller: 'ModalajoutlistedecoursesCtrl',
   	  scope: $scope,
      resolve: {  	

 					recettePromise:['recettes','auth', function(recettes,auth){
					return recettes.getliste();
					}],     	
					ingredientsdispoPromise:['ingredientsdispos', function(ingredientsdispos){
					return ingredientsdispos.getIngredientsdispo();
					}],
                }
    });

    modalInstance.result.then(function (ingredientsdispos) {
	recettes.getliste();     $scope.listedecourses = recettes.listedecourses;}, function () {
      $log.info('Modal dismissed at: ' + new Date());
    });
  };

}]);




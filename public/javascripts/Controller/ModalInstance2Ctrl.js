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

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




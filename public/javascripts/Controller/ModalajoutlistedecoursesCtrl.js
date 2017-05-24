// modal ajout de liste de courses
app.controller('ModalajoutlistedecoursesCtrl', [
'$scope',
'$modal',
'$state',
'$log',
'ingredientsdispos',
'auth',
'$modalInstance',
'recettes',

function($scope,$modal,$state,$log,ingredientsdispos,auth,$modalInstance,recettes) {
		$scope.ingredientsdispos = ingredientsdispos.ingredientsdispos;
   		 $scope.listedecourses = recettes.listedecourses;		
		$scope.selected = undefined;



	  $scope.ok = function(selected) {
	  		for (var i = 0; i < $scope.ingredientsdispos.length; i++) {
 				if ($scope.ingredientsdispos[i].nomid === selected) {
				var index = i;
				}
			};
			if(index>=0){
			$scope.listedecourses.push({nomid:$scope.ingredientsdispos[index].nomid,unite:$scope.ingredientsdispos[index].unite,rayon:$scope.ingredientsdispos[index].rayon,nombre:0,status:"todo93"});
				}else{$scope.listedecourses.push({nomid:selected,rayon:"",unite:"",nombre:0,status:"todo93"})};

				console.log($scope.listedecourses);
			recettes.updatelistedecourses($scope.listedecourses);
	 		$modalInstance.close();
	 	};


  		$scope.cancel = function () {
  			  $modalInstance.dismiss('cancel');
  		};
	}]
);

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
      templateUrl: '/javascripts/pages/myModalContent.html',
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
      templateUrl: '/javascripts/pages/myModalContent2.html',
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

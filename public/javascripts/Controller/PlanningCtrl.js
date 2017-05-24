app.controller('PlanningCtrl', [
'$scope',
'$modal',
'$state',
'$log',
'recettes',
'auth',
function($scope,$modal,$state,$log,recettes,auth){
	$scope.semainefr=new Array("Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam","Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam");
    $scope.prix = [];
    $scope.values = ["0","1","2","3","4","5","6"];
    $scope.selectedItem = 0;
    $scope.date = new Date();
    $scope.currentUser = auth.currentUser;
    $scope.isLoggedIn = auth.isLoggedIn;  
    $scope.planning = [];
    $scope.planning.nomp = 'ma recette';
    $scope.jours=[
    	{id:1,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: $scope.date.setDate($scope.date.getDate())},
    	{id:2,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: ''},
     	{id:3,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: ''},
     	{id:4,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: ''},    	  	
    	{id:5,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: ''},
     	{id:6,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: ''},
     	{id:7,midi:'',nbpersmidi:'',portionrestantemidi:'',soir:'',nbperssoir:'',portionrestantesoir:'',date: ''},
     	    ];   



  $scope.$watch("date", function(newValue, oldValue) {
  $scope.jours[0].date = $scope.date;
  $scope.jours[1].date = new Date($scope.date.getTime() + 86400000);
  $scope.jours[2].date = new Date($scope.date.getTime() + 86400000*2);
  $scope.jours[3].date = new Date($scope.date.getTime() + 86400000*3);
  $scope.jours[4].date = new Date($scope.date.getTime() + 86400000*4);   
  $scope.jours[5].date = new Date($scope.date.getTime() + 86400000*5);
  $scope.jours[6].date = new Date($scope.date.getTime() + 86400000*6);      
  });



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










  $scope.$watch("jours", function(newValue, oldValue) {
  	var j=0;
  		$scope.seriedate= [];
  		$scope.serieprix=[];
  		$scope.serieglucide=[];
  		$scope.serielipide=[];
  		$scope.serieprotide=[];
  		$scope.seriecalories=[];  		  		
  		for (var i=0; i<7;i++) {
  			if ($scope.jours[i].midi !=""){
  			$scope.seriedate[j]=$scope.semainefr[$scope.jours[i].date.getDay()]  +' midi';
  			$scope.serieprix[j]=$scope.jours[i].midi.prix;
  			$scope.serieglucide[j]=$scope.jours[i].midi.glucide;
  			$scope.serielipide[j]=$scope.jours[i].midi.lipide;
  			$scope.serieprotide[j]=$scope.jours[i].midi.protide;
  			$scope.seriecalories[j]=$scope.jours[i].midi.calories;
  			j=j+1;
  		};
  			if ($scope.jours[i].soir !=""){
  			$scope.seriedate[j]=$scope.semainefr[$scope.jours[i].date.getDay()]  +' soir';
  			$scope.serieprix[j]=$scope.jours[i].soir.prix;
  			$scope.serieglucide[j]=$scope.jours[i].soir.glucide;
  			$scope.serielipide[j]=$scope.jours[i].soir.lipide;
  			$scope.serieprotide[j]=$scope.jours[i].soir.protide;
  			$scope.seriecalories[j]=$scope.jours[i].soir.calories;
  			j=j+1;
  		};  		
  		};


  	$scope.tableauconcat=[];
  	$scope.tableauconcat=[$scope.serieglucide,$scope.serielipide,$scope.serieprotide];
 		  $scope.serie = ['glucides','Lipides', 'Protides'];
		  $scope.serie2 = ['Calories'];
     $scope.serie3 = ['Prix'];	 	
	   		$scope.serieprix2=[$scope.serieprix]; 	
	   		$scope.seriecalories2=[$scope.seriecalories]; 	   		
  }, true);











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
      templateUrl: '/../javascripts/Pages/myModalContent.html',
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
      templateUrl: '/../javascripts/pages/myModalContent2.html',
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

  $scope.sauvegarderliste = function() {
    console.log($scope.listedecourses);
    for(var i=0; i<$scope.listedecourses.length; i++) {
      $scope.listedecourses[i].status="todo93";
    }
    recettes.updatelistedecourses ($scope.listedecourses);
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



  $scope.event = function () {
  		
  		recettes.sendevent($scope.jours);
    };  






}]);


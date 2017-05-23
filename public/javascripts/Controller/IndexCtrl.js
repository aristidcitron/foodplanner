app.controller('IndexCtrl', [
	'$scope',
function ($scope){
  $scope.myInterval1 = 2000;
  $scope.myInterval2 = 1500;  
    $scope.myInterval3 = 2500; 
    $scope.myInterval4 = 3000;   
    $scope.screenshot = 'images/planning.jpg';  
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

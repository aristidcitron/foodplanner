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
  $scope.mail= {};
  $scope.mail.username=$scope.coucou.user;
  $scope.mail.mail=$scope.coucou.email;

  $scope.contact = function () {
  		
  		recettes.sendmail($scope.mail);
    };  



}]);

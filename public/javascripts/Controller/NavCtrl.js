app.controller('NavCtrl', [
	'$scope',
	'$state',
	'auth',
function widgetsController($scope, $state,auth) {
   $scope.$state = $state;
  $scope.isLoggedIn = auth.isLoggedIn;
  $scope.currentUser = auth.currentUser;
  $scope.logOut = auth.logOut;
}]);

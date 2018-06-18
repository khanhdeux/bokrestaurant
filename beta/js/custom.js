var myApp = angular.module('myApp',['ngCart']);

myApp.controller ('myCtrl', ['$scope', '$http', 'ngCart', function($scope, $http, ngCart) {
    ngCart.setTaxRate(0);
    ngCart.setShipping(0);

    $scope.myVariable = "My Variable value";
        
    $scope.checkout = function() {
           $scope.summary = ngCart.toObject();
           
         // Post your cart to your resource
         //$http.post('cart/', ngCart.toObject());
    }
}]);
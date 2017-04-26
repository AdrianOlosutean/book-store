app.controller('loginController', ($scope, $http, $rootScope, $state, $mdToast) => {

    $scope.nav = "app/customnav.html";

    $rootScope.logout = function () {
        $state.go('login');
        $rootScope.isLoggedIn = false;
        $rootScope.user = "";
    };

    $scope.login = function () {
        $http.post("http://localhost:8080/authenticate", {username: $scope.username, password: $scope.password})
            .then(function successCallback(response) {
                let user = response.data;
                let type = user.type;
                if (type === 'CLIENT')
                    $state.go('client');
                else if (type === 'ADMIN')
                    $state.go('admin');
            }, function errorCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Invalid Credentials')
                        .hideDelay(1000)
                );
            });
    }
});
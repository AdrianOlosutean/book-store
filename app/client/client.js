app.controller('clientController', function ($scope, $rootScope, $timeout, $mdSidenav, $http) {
    $scope.toggleRight = buildToggler('right');
    $scope.isOpenRight = function () {
        return $mdSidenav('right').isOpen();
    };

    $http.get("http://localhost:8080/books")
        .then(function (response) {
            $scope.books = response.data;
        });

    $scope.addToShopcart = (index) => {
        let copy = JSON.parse(JSON.stringify($scope.books[index]));
        copy.maxQuantity = copy.quantity;
        $rootScope.shopcart.push(copy);
    };

    $scope.query = () => {
        let url = "http://localhost:8080/books?";
        if (!!$scope.title) {
            url += "title=" + $scope.title.split(' ').join('+') + "&";
        }
        if (!!$scope.genre) {
            url += "genre=" + $scope.genre + "&";
        }
        if (!!$scope.author) {
            url += "author=" + $scope.author.split(' ').join('+');
        }
        if (url.charAt(url.length - 1) === '&') {
            url = url.substr(0, url.length - 1);
        }
        $http.get(url)
            .then(function (response) {
                $scope.books = response.data;
                console.log(response.data);
            });
    };

    function debounce(func, wait, context) {
        var timer;

        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function () {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }

    function buildToggler(navID) {
        return function () {
            $mdSidenav(navID)
                .toggle()
                .then(function () {
                });
        };
    }
});


app.controller('ShopcartController', function ($scope, $rootScope, $timeout, $mdSidenav, $log, $http) {

    $rootScope.shopcart = [];

    $scope.allValid = () => {
        function hasGoodAmount(element, index, array) {
            return element.quantity <= element.maxQuantity && element.quantity > 0;
        }

        return $rootScope.shopcart.every(hasGoodAmount);
    };

    $scope.buy = () => {
        var transactions = [];
        for (let el of $rootScope.shopcart) {
            transactions.push({
                id: el.isbn,
                amount: parseInt(el.quantity)
            })
        }

        $http.post("http://localhost:8080/buy", transactions)
            .then(function successCallback(response) {
            });

        $rootScope.shopcart = [];
    };

    $scope.sum = () => {
        if ($rootScope.shopcart.length === 0) return 0.0;
        return $scope.shopcart.map(product => product.quantity * product.price)
            .reduce((sum, x) => sum + x);
    };

    $scope.removeItem = (index) => {
        $rootScope.shopcart.splice(index, 1);
    };

    $scope.close = function () {
        $mdSidenav('right').close()
            .then(function () {
                $log.debug("close RIGHT is done");
            });
    };
});
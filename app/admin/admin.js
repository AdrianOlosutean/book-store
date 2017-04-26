app.controller('adminController', function ($scope,$mdDialog, $window) {

    $scope.insertBookDialog = function(ev) {
        $mdDialog.show({
            controller:  BookDialogController,
            templateUrl: 'app/admin/dialogBook.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
            .then(function(newBook) {
                $window.location.reload();
            });
    };


    $scope.insertUserDialog = function(ev) {
        $mdDialog.show({
            controller: UserDialogController,
            templateUrl: 'app/admin/dialogUser.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true
        })
            .then(function(newBook) {
                $window.location.reload();
            });
    };
});

function BookDialogController($scope, $mdDialog, $http, $mdToast) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.insert = function(answer) {
        let newBook = {
            isbn: $scope.isbn,
            title: $scope.title,
            author: $scope.author,
            genre: $scope.genre,
            amount: $scope.amount,
            price: $scope.price
        };
        $http.post("http://localhost:8080/books", newBook)
            .then(function successCallback(response) {
                $mdDialog.hide(newBook);
            }, function errorCallback(response) {
                let elem = angular.element(document.getElementById('bookInsertDialog'));
                $mdToast.show(
                    $mdToast.simple()
                        .content('Invalid')
                        .parent(elem)
                        .hideDelay(3000)
                );
            });
    };
}

app.controller('adminBookController', function ($scope, $mdToast, $http) {

    $scope.downloadPdf = function () {
        let columns = "ISBN Title Author Genre\n";
        let text = $scope.unavailableBooks()
            .map(b => b.isbn + ' ' + b.title + ' ' + b.author + ' ' + b.genre + '\n')
            .reduce((x, y) => x + ' ' + y);
        pdfMake.createPdf({ content: columns+text }).download('unavailable.pdf');
    };

    $scope.deleteRowCallback = function(rows){
        for (let row of rows) {
            $http.delete("http://localhost:8080/books/"+row)
                .then(function successCallback(response) {});
        }
        $mdToast.show(
            $mdToast.simple()
                .content('Deleted : '+rows.length)
                .hideDelay(3000)
        );
    };

    $scope.saveRowCallback = function(row){
        let book = {
            isbn: row[0],
            title: row[1],
            author: row[2],
            genre: row[3],
            quantity: row[4],
            price: row[5]
        };
        $http.put("http://localhost:8080/books/"+row[0], book)
            .then(function successCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Row changed')
                        .hideDelay(3000)
                );
            }, function errorCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Invalid Data')
                        .hideDelay(3000)
                );
            });

    };

    $http.get("http://localhost:8080/books")
        .then(function(response) {
            $scope.books = response.data;
        });

    $scope.unavailableBooks = () => $scope.books.filter(book => book.quantity === 0);
});

app.controller('adminUserController', function ($scope,$mdToast, $http) {

    $scope.deleteRowCallback = function(rows){
        for (let row of rows) {
            $http.delete("http://localhost:8080/users/"+row)
                .then(function successCallback(response) {});
        }
        $mdToast.show(
            $mdToast.simple()
                .content('Deleted : '+rows.length)
                .hideDelay(3000)
        );
    };

    $scope.saveRowCallback = function(row){
        let user = {
            username: row[0],
            type: row[1],
            firstname: row[2],
            lastname: row[3]
        };
        $http.put("http://localhost:8080/users/"+row[0], user)
            .then(function successCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Row changed')
                        .hideDelay(3000)
                );
            }, function errorCallback(response) {
                $mdToast.show(
                    $mdToast.simple()
                        .content('Invalid Data')
                        .hideDelay(3000)
                );
            });

    };

    $http.get("http://localhost:8080/users")
        .then(function(response) {
            $scope.users = response.data;
        });
});

function UserDialogController($scope, $mdDialog, $http, $mdToast) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.insert = function(answer) {
        let newUser = {
            username: $scope.username,
            password: $scope.password,
            type: $scope.type,
            firstname: $scope.firstname,
            lastname: $scope.lastname
        };
        $http.post("http://localhost:8080/users", newUser)
            .then(function successCallback(response) {
                $mdDialog.hide();
            }, function errorCallback(response) {
                let elem = angular.element(document.getElementById('userInsertDialog'));
                $mdToast.show(
                    $mdToast.simple()
                        .content('Invalid')
                        .parent(elem)
                        .hideDelay(3000)
                );
            });
    };
}


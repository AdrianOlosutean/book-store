
let app = angular.module('bookStore',['ngMaterial','ngMessages','ui.router', 'ngSanitize','mdDataTable','ngMdIcons', 'ngCsv']);

app.config(( $stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/login');

    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: "app/login/login.html"
        })
        .state('admin', {
            url: '/admin',
            templateUrl: "app/admin/admin.html"
        })
        .state('client', {
            url: '/client',
            templateUrl: "app/client/client.html"
        })
});
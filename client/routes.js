angular.module("cimonitor").config(['$urlRouterProvider', '$stateProvider', '$locationProvider',
  function($urlRouterProvider, $stateProvider, $locationProvider){

    $locationProvider.html5Mode(true);

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        template: UiRouter.template('dashboard.html'),
        controller: 'DashboardCtrl'
      });

      $urlRouterProvider.otherwise("/dashboard");
}]);
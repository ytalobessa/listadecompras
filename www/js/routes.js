angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('menu', {
    url: '/app',
    templateUrl: 'app/menu/menu.html',
    abstract: true
  })
  .state('menu.categories', {
    url: '/categories',
    views: {
      'menuContent': {
        templateUrl: 'app/categories/list.html',
        controller: 'categoryListCtrl'
      }
    }
  })
  .state('menu.newCategory', {
    url: '/category/new',    
    cache: false,
    views: {
      'menuContent': {
        templateUrl: 'app/categories/edit.html',
        controller: 'categoryEditCtrl'
      }
    }
  })
  .state('menu.editCategory', {
    url: '/category/edit/:id',  
    cache: false,  
    views: {
      'menuContent': {
        templateUrl: 'app/categories/edit.html',
        controller: 'categoryEditCtrl'
      }
    }
  })
  .state('menu.lists', {
    url: '/lists',
    views: {
      'menuContent': {
        templateUrl: 'app/lists/list.html',
        controller: 'listCtrl'
      }
    }
  })
  .state('menu.viewList', {
    url: '/lists/view',
    views: {
      'menuContent': {
        templateUrl: 'app/lists/view.html',
        controller: 'listCtrl'
      }
    }
  })
  .state('menu.newList', {
    url: '/list/new',
    views: {
      'menuContent': {
        templateUrl: 'app/lists/edit.html',
        controller: 'listCtrl'
      }
    }    
  })
  .state('menu.editList', {
    url: '/list/edit/:id',
    views: {
      'menuContent': {
        templateUrl: 'app/lists/edit.html',
        controller: 'listCtrl'
      }
    }    
  });
  
  $urlRouterProvider.otherwise('/app/lists')

});
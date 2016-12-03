angular.module('app.category.controller')
.controller('categoryEditCtrl', function ($scope, $stateParams, $state, $toast, category) {
    $scope.obj = category.getDefault();
    
    if ($stateParams.id) {        
        category.get(parseInt($stateParams.id))
        .then(function (obj) {
            $scope.obj = obj;
        }).catch(function (message) {
            $toast.showError(message);
            $state.go('menu.categories');
        });        
    }

    $scope.onSubmit = function() {
        if ($scope.obj) {
            category.isValid($scope.obj)
            .then(function () {
                category.save($scope.obj)
                    .then(function () {
                            $toast.showSuccess('Categoria salva com sucesso.');
                            $state.go('menu.categories');
                    }).catch(function (message) {
                        $toast.showError(message);
                    }); 
            }).catch(function (message) {
                $toast.showError(message); 
            });
        }
    };   
});
angular.module('app.category.controller')
    .controller('categoryListCtrl', function ($scope, $ionicPopup, $ionicPlatform, $toast, category) {        
        $ionicPlatform.ready(function () {            
            category.all().then(function (items) {
                $scope.items = items;
            }).catch(function (message) {
                $toast.showError(message);
            });
        });

        $scope.delete = function (index, id) {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Excluir categoria.',
                template: 'Você confirma a exclusão da categoria selecionada?'
            }).then(function (ok) {
                if (ok) {
                    category.delete(id)
                        .then(function () {
                            $scope.items.splice(index, 1);
                            $toast.showSuccess('Categoria excluída com sucesso.');
                        }).catch(function (message) {
                            $toast.showError(message);
                        });
                }
            });
        }
    });
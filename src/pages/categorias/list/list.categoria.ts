import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { EditCategoriaPage } from '../edit/edit.categoria';
import { Categoria } from '../../../providers/categorias/categoria'
import { CategoriaService } from '../../../providers/categorias/categoria.service'
import { ToastService } from '../../../providers/shared/toast.service'

@Component({
    selector: 'list-categorias',
    templateUrl: 'list.categoria.html'
})
export class ListCategoriaPage {
    items: Categoria[];

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public categoriaService: CategoriaService,
        public toastService: ToastService) { }

    /**
     * Abre a tela para cadastrar um novo item
     */
    addNew() {
        this.navCtrl.push(EditCategoriaPage);
    }

    /**
     * Abre a tela de cadastro com o item selecionado
     * @param item
     */
    editItem(item: Categoria) {
        this.navCtrl.push(EditCategoriaPage, { item: item });
    }

    /**
     * Remove o item do banco
     * @param item
     */
    removeItem(item: Categoria) {
        this.alertCtrl.create({
            title: 'Excluir: ' + item.nome,
            message: 'Confirma a exclusão dessa categoria?',
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: 'Excluir categoria "' + item.nome + '"',
                    handler: () => {
                        this.handlerRemoveItem(item);
                    }
                }
            ]
        }).present();
    }

    /**
     * Remove o item do banco
     * @param item
     */
    handlerRemoveItem(item: Categoria) {
        // Verifico se pode excluír a cateogira
        this.categoriaService.canRemove(item.id)
            .then((result) => {
                if (result) {
                    // Caso positivo removo a categoria
                    this.categoriaService.remove(item.id)
                        .then((result) => {
                            if (result) {
                                // Remove o item da lista
                                this.items.splice(this.items.indexOf(item), 1);
                                this.toastService.show('Categoria excluída com sucesso.');
                            }
                        })
                        .catch((e) => this.toastService.show('Ocorreu algum erro ao excluír a categoria.'));
                } else {
                    // Caso negativo informo o motivo de não remover para o usuario
                    this.toastService.show('Não é possível excluír a categoria pois ela já está em uso.')
                }
            })
            .catch((e) =>
                this.toastService.show('Ocorreu algum erro ao verificar se pode excluír a categoria.')
            );
    }

    /**
     * Carrega todos os itens do banco
     */
    loadItems() {
        this.categoriaService.getAll()
            .then((result: Categoria[]) => {
                this.items = result;
            })
            .catch((e) => this.toastService.show('Ocorreu algum erro ao listar as categorias.'));
    }

    /**
     * Evento do NavController que roda quando a tela for totalmente carregada
     * e se torna a tela ativa
     */
    ionViewDidEnter() {
        this.loadItems();
    }
}

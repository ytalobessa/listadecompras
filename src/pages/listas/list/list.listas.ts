import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { EditListaPage } from '../edit/edit.lista';
import { DetailListaPage } from '../detail/detail.lista';
import { Lista } from '../../../providers/listas/lista'
import { ListaService } from '../../../providers/listas/lista.service'
import { ToastService } from '../../../providers/shared/toast.service'

@Component({
    selector: 'list-listas',
    templateUrl: 'list.listas.html'
})
export class ListListasPage {
    items: Lista[];

    constructor(
        public navCtrl: NavController,
        public alertCtrl: AlertController,
        public listaService: ListaService,
        public toastService: ToastService) { }

    /**
     * Abre a tela para cadastrar um novo item
     */
    addNew() {
        this.navCtrl.push(EditListaPage);
    }

    /**
     * Abre a tela de cadastro com o item selecionado
     * @param item
     */
    editItem(item: Lista) {
        this.navCtrl.push(EditListaPage, { item: item });
    }

    /**
     * Exibe a tela de detalhes da lista.
     * Tela onde é exibido os items da lista
     * @param item
     */
    showDetail(item: Lista) {
        this.navCtrl.push(DetailListaPage, { item: item });
    }

    /**
     * Remove o item do banco
     * @param item
     */
    removeItem(item: Lista) {
        this.alertCtrl.create({
            title: 'Excluir: ' + item.nome,
            message: 'Confirma a exclusão dessa lista?',
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: 'Excluir lista "' + item.nome + '"',
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
    handlerRemoveItem(item: Lista) {
        this.listaService.remove(item.id)
            .then((result) => {
                if (result) {
                    // Remove o item da lista
                    this.items.splice(this.items.indexOf(item), 1);
                    this.toastService.show('Lista excluída com sucesso.');
                }
            })
            .catch((e) => this.toastService.show('Ocorreu algum erro ao excluír a lista.'));
    }

    /**
     * Carrega todos os itens do banco
     */
    loadItems() {
        this.listaService.getAll()
            .then((result: Lista[]) => {
                this.items = result;
            })
            .catch((e) => this.toastService.show('Ocorreu algum erro ao listar as listas.'));
    }

    /**
     * Evento do NavController que roda quando a tela for totalmente carregada
     * e se torna a tela ativa
     */
    ionViewDidEnter() {
        this.loadItems();
    }
}

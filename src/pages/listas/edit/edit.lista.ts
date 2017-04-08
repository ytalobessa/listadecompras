import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Lista } from '../../../providers/listas/lista'
import { ListaService } from '../../../providers/listas/lista.service'
import { ToastService } from '../../../providers/shared/toast.service'

@Component({
    selector: 'edit-lista',
    templateUrl: 'edit.lista.html'
})
export class EditListaPage {
    model: Lista;
    @ViewChild('form') form: NgForm;

    constructor(
        public navCtrl: NavController,
        public toastService: ToastService,
        public listaService: ListaService,
        private navParams: NavParams) {

        this.model = new Lista();

        if (navParams.data.item) {
            this.model = navParams.data.item;
        }
    }

    /**
     * Salva a lista no banco de dados
     */
    save() {
        if (this.form.form.valid) {
            this.listaService.save(this.model)
                .then((r) => {
                    this.toastService.show('Lista salva com sucesso.');
                    // Fecho a tela e volto para a lista de listas
                    this.navCtrl.pop();
                })
                .catch((e) => {
                    this.toastService.show('Ocorreu algum erro ao salvar a lista.');
                });
        }
    }
}

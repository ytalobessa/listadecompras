import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Categoria } from '../../../providers/categorias/categoria'
import { CategoriaService } from '../../../providers/categorias/categoria.service'
import { ToastService } from '../../../providers/shared/toast.service'

@Component({
    selector: 'edit-categoria',
    templateUrl: 'edit.categoria.html'
})
export class EditCategoriaPage {
    model: Categoria;
    @ViewChild('form') form: NgForm;

    constructor(
        public navCtrl: NavController,
        public toastService: ToastService,
        public categoriaService: CategoriaService,
        private navParams: NavParams) {

        this.model = new Categoria();

        if (navParams && navParams.data.item) {
            this.model = navParams.data.item;
        }
    }

    /**
     * Salva a categoria no banco de dados
     */
    save() {
        if (this.form.form.valid) {
            this.categoriaService.save(this.model)
            .then((r) => {
                this.toastService.show('Categoria salva com sucesso.');
                // Fecho a tela e volto para a lista de categorias
                this.navCtrl.pop();
            })
            .catch((e) => {
                this.toastService.show('Ocorreu algum erro ao salvar a categoria.');
            });
        }
    }
}

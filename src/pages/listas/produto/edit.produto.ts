import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { ToastService } from '../../../providers/shared/toast.service'
import { Categoria } from '../../../providers/categorias/categoria';
import { Produto } from '../../../providers/listas/produto'
import { CategoriaService } from '../../../providers/categorias/categoria.service';
import { ProdutoService } from '../../../providers/listas/produto.service'

@Component({
    selector: 'edit-produto',
    templateUrl: 'edit.produto.html'
})
export class EditProdutoPage implements OnInit {
    model: Produto;
    qtdItems: number;
    categories: Categoria[];
    @ViewChild('form') form: NgForm;

    constructor(
        public navCtrl: NavController,
        public toastService: ToastService,
        public produtoService: ProdutoService,
        public categoriaService: CategoriaService,
        private navParams: NavParams) {

        this.model = new Produto();
        this.model.quantidade = 1;
        this.model.categoriaId = -1;

        if (navParams.data.item) {
            this.model = navParams.data.item;
        }

        this.model.listaId = navParams.data.listaId;
        this.qtdItems = navParams.data.qtdItens;
    }

    /**
     * Evento do angular executado após o contrutor
     */
    ngOnInit() {
        this.loadCategories();
    }

    /**
     * Pega as categorias do banco de dados
     */
    loadCategories() {
        this.categoriaService.getAll()
            .then((result: Categoria[]) => {
                this.categories = result;
            })
            .catch((e) =>
                this.toastService.show('Ocorreu algum erro ao listar as categorias.')
            );
    }

    /**
     * Aumenta a quantidade
     */
    addQtd() {
        this.model.quantidade++;
    }

    /**
     * Diminue a quantidade
     */
    removeQtd() {
        this.model.quantidade--;
        // forço a quantidade nunca ser menor que 0
        if (this.model.quantidade < 0)
            this.model.quantidade = 0;
    }

    /**
     * Salva o produto na lista no banco de dados
     */
    save() {
        if (this.form.form.valid) {

            // se está incluindo um novo produto
            if (!this.model.id) {
                // O produto é sempre adicionado por ultimo na lista
                this.model.ordem = this.qtdItems + 1;
                // Marco que ele ainda não foi comprado
                this.model.comprado = false;
            }

            this.produtoService.save(this.model)
                .then((r) => {
                    this.toastService.show('Produto salvo com sucesso.');
                    // Fecho a tela e volto para os detalhes da lista
                    this.navCtrl.pop();
                })
                .catch((e) => {
                    this.toastService.show('Ocorreu algum erro ao salvar o produto.');
                });
        } else {
            this.toastService.show('Existe algum proplema de validação.');
        }
    }
}

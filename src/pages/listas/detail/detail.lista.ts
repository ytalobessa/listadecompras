import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { ToastService } from '../../../providers/shared/toast.service'
import { EditProdutoPage } from '../produto/edit.produto';
import { Lista } from '../../../providers/listas/lista'
import { Produto } from '../../../providers/listas/produto'
import { ProdutoPorCategoria } from '../../../providers/listas/produto-por-categoria'
import { ProdutoService } from '../../../providers/listas/produto.service'

@Component({
    selector: 'detail-lista',
    templateUrl: 'detail.lista.html'
})
export class DetailListaPage {
    produtosPorCategoria: ProdutoPorCategoria[];
    lista: Lista;
    qtdProdutos: number

    constructor(
        public navCtrl: NavController,
        public toastService: ToastService,
        public alertCtrl: AlertController,
        public produtoService: ProdutoService,
        private navParams: NavParams) {

        this.lista = navParams.data.item;
    }

    /**
     * Abre a tela para cadastrar um novo produto
     */
    addNew() {
        this.navCtrl.push(EditProdutoPage, {
            listaId: this.lista.id,
            qtdItens: this.qtdProdutos
        });
    }

    /**
     * Abre a tela de cadastro com o item selecionado
     * @param item
     */
    editItem(item: Produto) {
        this.navCtrl.push(EditProdutoPage, {
            listaId: this.lista.id,
            qtdItens: this.qtdProdutos,
            item: item
        });
    }

    /**
     * Exibe mensagem de confirmação e remove o item caso confirmado
     * @param categoria
     * @param produto
     */
    removeItem(categoria: ProdutoPorCategoria, produto: Produto) {
        this.alertCtrl.create({
            title: 'Excluir: ' + produto.nome,
            message: 'Confirma a exclusão desse produto?',
            buttons: [
                {
                    text: 'Cancelar'
                },
                {
                    text: 'Excluir produto "' + produto.nome + '"',
                    handler: () => {
                        this.handlerRemoveItem(categoria, produto);
                    }
                }
            ]
        }).present();
    }

    /**
     * Remove o item do banco
     * @param categoria
     * @param produto
     */
    handlerRemoveItem(categoria: ProdutoPorCategoria, produto: Produto) {
        this.produtoService.remove(produto.id)
            .then((result) => {
                if (result) {
                    // Remove o item da lista da categoria
                    categoria.produtos.splice(categoria.produtos.indexOf(produto), 1);
                    if (categoria.produtos.length == 0) {
                        // se não tem mais nenhum produto para essa categoria, eu removo ela da lista
                        this.produtosPorCategoria.splice(this.produtosPorCategoria.indexOf(categoria), 1);
                    }
                    this.toastService.show('Produto excluído com sucesso.');
                }
            })
            .catch((e) => this.toastService.show('Ocorreu algum erro ao excluír o produto.'));
    }

    setItemPurchased(produto: Produto) {
        produto.comprado = !produto.comprado;
        // Mando salvar para atualizar no banco de dados
        this.produtoService.save(produto)
            .catch((e) => {
                this.toastService.show('Ocorreu algum erro ao marcar o produto como comprado/não comprado.')
            })
    }

    /**
     * Carrega todos os itens do banco
     */
    loadItems() {
        this.produtoService.getAll(this.lista.id)
            .then((result: Produto[]) => {
                var produtos = result;
                this.qtdProdutos = produtos.length;
                this.produtosPorCategoria = [];

                // Categoria atual
                var atual: ProdutoPorCategoria;

                produtos.forEach(produto => {
                    if (atual == null || (produto.categoriaNome != atual.nome)) {
                        atual = new ProdutoPorCategoria();
                        atual.nome = produto.categoriaNome;
                        atual.produtos = [];

                        this.produtosPorCategoria.push(atual);
                    }

                    atual.produtos.push(produto);
                });
            })
            .catch((e) =>
                this.toastService.show('Ocorreu algum erro ao listar os produtos.')
            );
    }

    reorderItems(indexes, categoria: ProdutoPorCategoria) {
        var produto = categoria.produtos[indexes.from];

        // Reordeno os itens na lista
        categoria.produtos.splice(indexes.from, 1);
        categoria.produtos.splice(indexes.to, 0, produto);

        // Reordeno no banco de dados
        var ordem = 0;
        categoria.produtos.forEach((produto) => {
            produto.ordem = ordem;
            ordem++;

            // salvo no banco
            this.produtoService.save(produto)
                .catch((e) => {
                    this.toastService.show('Ocorreu algum erro ao reordenar os produtos.');
                });
        });
    }


    /**
     * Evento do NavController que roda quando a tela for totalmente carregada
     * e se torna a tela ativa
     */
    ionViewDidEnter() {
        this.loadItems();
    }
}

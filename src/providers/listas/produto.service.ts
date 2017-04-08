import { Injectable } from '@angular/core';
import { DatabaseService } from '../shared/database.service'
import { Produto } from './produto';

@Injectable()
export class ProdutoService {

    constructor(public dbService: DatabaseService) { }

    /**
     * Busta todos os produto e suas categorias
     * @param listaId
     */
    public getAll(listaId: number) {
        var sql = 'select ';
        sql += 'listitem.id, ';
        sql += 'listitem.list_id, ';
        sql += 'listitem.category_id, ';
        sql += 'listitem.name, ';
        sql += 'listitem.sequence, ';
        sql += 'listitem.purchased, ';
        sql += 'listitem.qtd, ';
        sql += 'category.name as category_name ';
        sql += 'FROM listitem inner join category on listitem.category_id == category.id ';
        sql += 'where listitem.list_id = ?';
        sql += 'order by category_name, listitem.sequence';

        return this.dbService.executeSQL(sql, [listaId])
            .then((data) => {
                var produtos: Produto[] = [];

                for (var i = 0; i < data.rows.length; i++) {
                    var row = data.rows.item(i);
                    var produto = new Produto();
                    produto.id = row.id
                    produto.listaId = row.list_id;
                    produto.categoriaId = row.category_id;
                    produto.categoriaNome = row.category_name;
                    produto.nome = row.name;
                    produto.ordem = row.sequence;
                    produto.comprado = row.purchased == 'true';
                    produto.quantidade = row.qtd;
                    produtos.push(produto);
                }

                return produtos;
            })
            .catch(e => console.log(e));
    }

    public save(produto: Produto) {
        if (produto.id) {
            return this.update(produto);
        } else {
            return this.insert(produto);
        }
    }

    private insert(produto: Produto) {
        var sql = 'insert into listitem (list_id, category_id, name, sequence, purchased, qtd) values (?, ?, ?, ?, ?, ?)';
        var dados = [produto.listaId, produto.categoriaId, produto.nome,
        produto.ordem, produto.comprado, produto.quantidade];

        return this.dbService.executeSQL(sql, dados)
            .then((data) => {
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

    private update(produto: Produto) {
        var sql = 'update listitem set ';
        sql += 'category_id = ?, ';
        sql += 'name = ?, ';
        sql += 'sequence = ?, ';
        sql += 'purchased = ?, ';
        sql += 'qtd = ? ';
        sql += 'where id = ?';

        var dados = [produto.categoriaId, produto.nome, produto.ordem,
        produto.comprado, produto.quantidade, produto.id];

        return this.dbService.executeSQL(sql, dados)
            .then((data) => {
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

    public remove(id: number) {
        return this.dbService.executeSQL('delete from listitem where id = ?', [id])
            .then((data) => {
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

}

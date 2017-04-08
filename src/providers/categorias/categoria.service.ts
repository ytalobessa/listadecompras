import { Injectable } from '@angular/core';
import { DatabaseService } from '../shared/database.service'
import { Categoria } from './categoria'

@Injectable()
export class CategoriaService {

    constructor(public dbService: DatabaseService) { }

    /**
     * Busca todas as categorias no banco de dados
     */
    public getAll() {
        return this.dbService.executeSQL('select * from category', {})
            .then((data) => {
                var categorias: Categoria[] = [];

                for (var i = 0; i < data.rows.length; i++) {
                    var row = data.rows.item(i);
                    var categoria = new Categoria();
                    categoria.id = row.id
                    categoria.nome = row.name;
                    categorias.push(categoria);
                }

                return categorias;
            })
            .catch(e => console.log(e));
    }

    /**
     * Salva uma categoria no banco de dados
     * @param categoria
     */
    public save(category: Categoria) {
        if (category.id) {
            return this.update(category);
        } else {
            return this.insert(category);
        }
    }

    /**
     * Insere uma categoria no banco de dados
     * @param categoria
     */
    private insert(category: Categoria) {
        return this.dbService.executeSQL('insert into category (name) values(?)', [category.nome])
            .then((data) => {
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

    /**
     * Atualiza uma categoria no banco de dados
     * @param categoria
     */
    private update(categoria: Categoria) {
        return this.dbService.executeSQL('update category set name = ? where id = ?',
            [categoria.nome, categoria.id])
            .then((data) => {
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

    /**
     * Verifica se pode remover a categoria do banco de dados
     * @param id
     */
    public canRemove(id: number) {
        return this.dbService.executeSQL('select id from listitem where category_id = ?', [id])
            .then((data) => {
                if (data.rows.length > 0) {
                    return false
                } else {
                    return true;
                }
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

    /**
     * Remove uma categoria do banco de dados
     * @param id
     */
    public remove(id: number) {
        return this.dbService.executeSQL('delete from category where id = ?', [id])
            .then((data) => {
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }
}

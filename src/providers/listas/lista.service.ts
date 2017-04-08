import { Injectable } from '@angular/core';
import { DatabaseService } from '../shared/database.service'
import { Lista } from './lista'


@Injectable()
export class ListaService {

    constructor(public dbService: DatabaseService) { }

    /**
     * Busca todas as listas do banco de dados
     */
    public getAll() {
        return this.dbService.executeSQL('select * from list', {})
            .then((data) => {
                var listas: Lista[] = [];

                for (var i = 0; i < data.rows.length; i++) {
                    var row = data.rows.item(i);
                    var lista = new Lista();
                    lista.id = row.id
                    lista.nome = row.name;
                    listas.push(lista);
                }

                return listas;
            })
            .catch(e => console.log(e));
    }

    /**
     * Salva uma lista no banco de dados
     * @param lista
     */
    public save(lista: Lista) {
        if (lista.id) {
            return this.update(lista);
        } else {
            return this.insert(lista);
        }
    }

    /**
     * Insere uma lista no banco de dados
     * @param lista
     */
    private insert(lista: Lista) {
        return this.dbService.executeSQL('insert into list (name) values(?)', [lista.nome])
            .then((data) => {
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

    /**
     * Atualiza uma lista no banco de dados
     * @param lista
     */
    private update(lista: Lista) {
        return this.dbService.executeSQL('update list set name = ? where id = ?',
            [lista.nome, lista.id])
            .then((data) => {
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

    /**
     * Remove a lista e os itens da lista do banco de dados
     * @param id
     */
    public remove(id: number) {
        return this.dbService.executeBatchSQL(
            [
                ['delete from listitem where list_id = ?', [id]],
                ['delete from list where id = ?', [id]]
            ])
            .then((data) => {
                return true;
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

}

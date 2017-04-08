import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

export class DatabaseTable {
    name: string;
    columns: DatabaseColumn[];

    constructor(name: string, columns: DatabaseColumn[]) {
        this.name = name;
        this.columns = columns;
    }

}

export class DatabaseColumn {
    name: string;
    type: string;
    isNull: boolean;

    constructor(name: string, type: string, isNull: boolean) {
        this.name = name;
        this.type = type;
        this.isNull = isNull;
    }
}

@Injectable()
export class DatabaseService {
    database: SQLiteObject;

    constructor(private sqlite: SQLite) { }

    private getDb() {
        return this.sqlite.create({ name: 'listadecompras.db', location: 'default' });
    }

    public createDatabase() {
        return this.getDb()
            .then((db: SQLiteObject) => {
                this.database = db;

                var sqls = this.getDatabaseSQLSchema();

                for (var i = 0; i < sqls.length; i++) {
                    var sql = sqls[i];
                    db.executeSql(sql, {})
                        .catch(e => console.log(e));
                }

                this.insertDefaultItems(db);
            })
            .catch(e => {
                console.log(e);
                return false;
            });
    }

    public executeSQL(statement: string, params: any) {
        return this.getDb()
            .then((db: SQLiteObject) => {
                return db.executeSql(statement, params);
            })
            .catch(e => {
                console.log(e);
                return null;
            });
    }

    public executeBatchSQL(sqlStatements: any) {
        return this.getDb()
            .then((db: SQLiteObject) => {
                return db.sqlBatch(sqlStatements);
            })
            .catch((e) => {
                console.log(e);
                return null;
            });
    }

    private insertDefaultItems(db: SQLiteObject) {
        db.executeSql('select * from db_version', {})
            .then((data) => {
                if (data.rows.length == 0) {
                    db.executeSql('insert into db_version (version) values (?)', [1])
                        .catch(e => console.log(e));

                    var inserirCategorias = 'insert into category (name) values (?)';

                    db.sqlBatch(
                        [
                            [inserirCategorias, ["Mercearia"]],
                            [inserirCategorias, ["Carnes, aves e peixes"]],
                            [inserirCategorias, ["Matinais e laticínios"]],
                            [inserirCategorias, ["Hortifruti"]],
                            [inserirCategorias, ["Limpeza e utensilios"]],
                            [inserirCategorias, ["Higiene pessoal"]]
                        ])
                        .catch(e => {
                            console.log(e);
                            console.log('Erro ao incluir itens padrão.')
                        });
                }
            })
            .catch(e => console.log(e));
    }

    private getDatabaseSchema() {
        var tables: DatabaseTable[] = [];

        tables.push(
            new DatabaseTable("db_version",
                [
                    new DatabaseColumn("version", "integer", false)
                ]));

        tables.push(
            new DatabaseTable("category",
                [
                    new DatabaseColumn("name", "varchar(100)", false)
                ]));

        tables.push(
            new DatabaseTable("list",
                [
                    new DatabaseColumn("name", "varchar(100)", false)
                ]));

        tables.push(
            new DatabaseTable("listitem",
                [
                    new DatabaseColumn("list_id", "integer", false),
                    new DatabaseColumn("category_id", "integer", false),
                    new DatabaseColumn("name", "varchar(100)", false),
                    new DatabaseColumn("sequence", "integer", false),
                    new DatabaseColumn("purchased", "numeric(1)", false),
                    new DatabaseColumn("qtd", "integer", false)
                ]));

        return tables;
    }

    private getDatabaseSQLSchema() {
        var tables = this.getDatabaseSchema();
        var sqls = [];

        for (var i = 0; i < tables.length; i++) {
            var table = tables[i];
            var sql = "CREATE TABLE IF NOT EXISTS " + table.name + " (";
            sql += "id integer primary key autoincrement, ";
            for (var j = 0; j < table.columns.length; j++) {
                var column = table.columns[j];
                var sqlColumn = column.name + " " + column.type;
                if (!column.isNull)
                    sqlColumn += " not null";

                if (j + 1 < table.columns.length)
                    sqlColumn += ", ";

                sql += sqlColumn;
            }
            sql += ")";

            sqls.push(sql);
        }

        return sqls;
    }

}

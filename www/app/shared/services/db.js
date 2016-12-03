angular.module('app.shared.services.db')
    .factory('$db', function ($cordovaSQLite, $rootScope) {
        return {
            schema: function () {
                var tables = [                    
                    {
                        name: 'category',
                        columns: [
                            { name: 'name', type: 'varchar(100)', isNull: false }
                        ]
                    },
                    {
                        name: 'list',
                        columns: [
                            { name: 'name', type: 'varchar(100)', isNull: false }
                        ]
                    },
                    {
                        name: 'listitem',
                        columns: [
                            { name: 'name', type: 'varchar(100)', isNull: false },
                            { name: 'sequence', type: 'integer', isNull: false }
                        ]
                    }
                ];

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
            },
            initialize: function () {
                if (!$rootScope.db) {
                    var sqls = this.schema();

                    var db = $cordovaSQLite.openDB({ name: "ListaCompras.db", iosDatabaseLocation: 'default' });
                    $rootScope.db = db;

                    //criando as tabelas
                    for (var i = 0; i < sqls.length; i++) {
                        var sql = sqls[i];
                        $cordovaSQLite.execute(db, sql).then(function (res) {

                        }, function (error) {
                            console.error("Ocorreu algum erro ao criar a tabela. " + error + ". SQL: " + sql);
                        });
                    }

                    $cordovaSQLite.execute($rootScope.db, 'select COUNT(*) as qtd from category')
                        .then(function (result) {
                            //se não tem nenhuma categoria inserida
                            if (result.rows.length > 0 && result.rows.item(0).qtd == 0) {
                                //insiro varias categorias padrão
                                $cordovaSQLite.insertCollection(
                                    $rootScope.db, 
                                    'insert into category (name) values (?)',
                                    [
                                        ["Mercearia"], ["Carnes, aves e peixes"], ["Matinais e laticínios"],
                                        ["Hortifruti"], ["Limpeza e utensilios"], ["Higiene pessoal"]
                                    ]
                                );
                            }
                        });
                }
            },
            execute: function (query, where) {
                return $cordovaSQLite.execute($rootScope.db, query, where);
            }
        };
    });

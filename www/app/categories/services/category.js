angular.module('app.category.services', [])
.factory('category', function($q, $db) {
    return {      
        getDefault: function() {
            return { name: '' };
        },
        get: function(id) {
            var q = $q.defer();

            $db.execute('select * from category where id = ?', [id])
            .then(function (result) {
                var obj =  result.rows.item(0);
                q.resolve(obj);
            }).catch(function (result) {
                q.reject('Ocorreu um erro ao buscar a categoria.');
            });

            return q.promise;
        },
        all: function () {
            var q = $q.defer();
            $db.execute('select * from category order by name')
            .then(function (result) {
                var items = [];

                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    items.push({ id: row.id, name: row.name });
                }

                q.resolve(items);
            }).catch(function (result) {                
                q.reject('Ocorreu um erro ao listar as categorias.');
            });

            return q.promise;
        },
        isValid: function (obj) {
            var q = $q.defer();
            var hasDuplicate;
            
            var msg = '';
            if (!obj.name || obj.name == '') {
                msg = 'O nome é obrigatório.';
            } else {
                hasDuplicate = this.hasDuplicate(obj.name).then(function(result){ 
                    if (result)
                        msg = 'Já existe uma categoria com este nome.';
                });
            }
            
            return $q.all([hasDuplicate]).then(function() {
                if (msg == '') {
                    q.resolve();
                } else {
                    q.reject(msg);
                }
    
                return q.promise;    
            });
        },
        hasDuplicate: function(name) {
            var q = $q.defer();

            $db.execute('select * from category where name = ?', [name])
            .then(function (result) {
                var duplicate =  result.rows.length > 0;
                q.resolve(duplicate);
            }).catch(function (result) {
                q.reject('Ocorreu um erro ao validar categoria duplicada.');
            });

            return q.promise;
        },
        save: function(obj) {
            var q = $q.defer();

            var args = [obj.name];
            var query = '';
            if (obj.id) { //insert
                args.push(obj.id);
                query = 'update category set name = ? where id = ?';                
            } else { //update
                query = 'insert into category (name) values(?)';                                
            }

            $db.execute(query, args)
            .then(function (result) {
                q.resolve(result);
            }).catch(function (result) {
                q.reject('Ocorreu um erro ao salvar a categoria.');
            });

            return q.promise;
        },
        delete: function (id) {
            var q = $q.defer();

            $db.execute('delete from category where id = ?', [id])
            .then(function (result) {
                q.resolve(result);
            }).catch(function (result) {
                q.reject('Ocorreu um erro ao excluir a categoria.');
            });

            return q.promise;
        }
    }
});
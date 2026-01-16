const sqlite3 = require('sqlite3').verbose();

class Database {
    constructor(dbPath = './db.sqlite') {
        this.db = new sqlite3.Database(dbPath);
        this.initTable();
    }

    _query(method, sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db[method](sql, params, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }

    initTable() {
        return this._query('run', 'CREATE TABLE IF NOT EXISTS json (ID TEXT PRIMARY KEY, json TEXT)');
    }

    get(id) {
        return this._query('get', 'SELECT * FROM json WHERE ID = ?', [id]);
    }

    set(id, data) {
        return this._query('run', 'INSERT OR REPLACE INTO json (ID, json) VALUES (?, ?)', [id, data]);
    }

    delete(id) {
        return this._query('run', 'DELETE FROM json WHERE ID = ?', [id]);
    }

    all() {
        return this._query('all', 'SELECT * FROM json WHERE ID IS NOT NULL');
    }

    deleteAll() {
        return this._query('run', 'DELETE FROM json');
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => err ? reject(err) : resolve());
        });
    }
}

module.exports = Database;

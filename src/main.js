const Database = require('./database');
const { name, version } = require('../package.json');
const fs = require('fs');

class CodersDB {
    static ALIASES = {
        fetch: 'get', del: 'delete', remove: 'subtract', clear: 'deleteAll',
        exists: 'has', includes: 'has', getAll: 'all', fetchAll: 'all',
        typeof: 'type', count: 'size', length: 'size'
    };

    constructor(dbPath = './db.sqlite') {
        this.db = new Database(dbPath);
        this.name = name;
        this.version = version;
        return new Proxy(this, {
            get: (target, prop) => target[prop] || target[CodersDB.ALIASES[prop]]
        });
    }

    _validate(key, data, type) {
        if (key !== undefined && !key) throw new TypeError('No Key Specified');
        if (type === 'number' && typeof data !== 'number') throw new TypeError('Amount Must Be A Number');
        if (data === Infinity) throw new TypeError('Data Cannot Be Infinity');
    }

    async _getData(key) {
        try {
            const row = await this.db.get(key);
            return row ? JSON.parse(row.json) : undefined;
        } catch { return undefined; }
    }

    async _setData(key, data) {
        try {
            await this.db.set(key, JSON.stringify(data));
            return data;
        } catch { return undefined; }
    }

    async get(key) {
        this._validate(key);
        return this._getData(key);
    }

    async set(key, data) {
        this._validate(key);
        if (data === undefined) throw new TypeError('No Value Specified');
        return this._setData(key, data);
    }

    async add(key, amount) {
        this._validate(key, amount, 'number');
        const current = await this._getData(key);
        return this._setData(key, (typeof current === 'number' ? current : 0) + amount);
    }

    async subtract(key, amount) {
        this._validate(key, amount, 'number');
        const current = await this._getData(key);
        if (typeof current !== 'number') throw new TypeError('Stored Value Must Be A Number');
        return this._setData(key, current - amount);
    }

    async math(key, amount, operator) {
        this._validate(key, amount, 'number');
        const ops = { '+': (a, b) => a + b, '-': (a, b) => a - b, '*': (a, b) => a * b,
                      '/': (a, b) => a / b, '%': (a, b) => a % b };
        if (!ops[operator]) throw new TypeError('Invalid Operator');
        const current = await this._getData(key);
        if (typeof current !== 'number') throw new TypeError('Stored Value Must Be A Number');
        return this._setData(key, ops[operator](current, amount));
    }

    async push(key, element) {
        this._validate(key);
        if (element === undefined) throw new TypeError('No Element Specified');
        const current = await this._getData(key);
        const array = Array.isArray(current) ? current : [];
        array.push(element);
        return this._setData(key, array);
    }

    async pull(key, element) {
        this._validate(key);
        if (element === undefined) throw new TypeError('No Element Specified');
        const current = await this._getData(key);
        if (!Array.isArray(current)) throw new TypeError('Stored Value Must Be An Array');
        const index = current.indexOf(element);
        if (index > -1) current.splice(index, 1);
        return this._setData(key, current);
    }

    async delete(key) {
        this._validate(key);
        if (!(await this.has(key))) return false;
        try { await this.db.delete(key); return true; } catch { return false; }
    }

    async deleteAll() {
        try { await this.db.deleteAll(); return true; } catch { return false; }
    }

    async has(key) {
        this._validate(key);
        try { return (await this.db.get(key)) !== undefined; } catch { return false; }
    }

    async all() {
        try {
            const rows = await this.db.all();
            return rows.map(row => ({ ID: row.ID, data: JSON.parse(row.json) }));
        } catch { return []; }
    }

    async type(key) {
        this._validate(key);
        return typeof (await this._getData(key));
    }

    async size() { return (await this.all()).length; }

    async filter(filterFn) {
        if (typeof filterFn !== 'function') throw new TypeError('Filter Must Be A Function');
        return (await this.all()).filter(filterFn);
    }

    async startsWith(prefix) {
        this._validate(prefix);
        return (await this.all()).filter(item => item.ID.startsWith(prefix));
    }

    async endsWith(suffix) {
        this._validate(suffix);
        return (await this.all()).filter(item => item.ID.endsWith(suffix));
    }

    async toJson() {
        return (await this.all()).reduce((obj, item) => ({ ...obj, [item.ID]: item.data }), {});
    }

    async last() {
        const all = await this.all();
        return all[all.length - 1];
    }

    async backup(filename) {
        try {
            const backupName = filename || `db.backup.${Date.now()}`;
            const data = await this.toJson();
            fs.writeFileSync(backupName, JSON.stringify(data, null, 2), 'utf8');
            return { success: true, filename: backupName, timestamp: Date.now(), size: Object.keys(data).length };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    close() { return this.db.close(); }
}

module.exports = CodersDB;
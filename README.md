# coders.sqlite

[![npm version](https://img.shields.io/npm/v/coders.sqlite.svg)](https://www.npmjs.com/package/coders.sqlite)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/coders.sqlite.svg)](https://nodejs.org)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcoders908%2Fcoders.sqlite.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcoders908%2Fcoders.sqlite?ref=badge_shield)

A lightweight, promise-based SQLite wrapper for Node.js with advanced type handling and automatic fallbacks. Perfect for Discord bots, small web apps, and rapid prototyping where you need persistent key-value storage without the overhead of a full database setup.

## ✨ Features

- **Zero Configuration** – Works out of the box with sensible defaults
- **Promise-Based API** – Fully async/await compatible for clean, modern code
- **Type-Safe Operations** – Built-in validation with helpful error messages
- **Array & Math Operations** – Native support for push/pull and arithmetic operations
- **Multiple Aliases** – Flexible method names (`get`/`fetch`, `delete`/`del`, etc.)
- **JSON Backup** – Export your entire database to JSON with one command
- **TypeScript Support** – Full type definitions included
- **Lightweight** – Minimal dependencies, powered by sqlite3

## 📦 Installation

```bash
npm install coders.sqlite
```

## 🚀 Quick Start

```javascript
const CodersDB = require('coders.sqlite');

// Create a new database instance
const db = new CodersDB('./mydata.sqlite');

// Basic operations
await db.set('user', { name: 'John', age: 25 });
const user = await db.get('user');
console.log(user); // { name: 'John', age: 25 }

// Check if key exists
if (await db.has('user')) {
    console.log('User exists!');
}
```

## 📖 Usage Examples

### Key-Value Operations

```javascript
// Store any data type
await db.set('name', 'Alice');
await db.set('settings', { theme: 'dark', notifications: true });
await db.set('scores', [100, 85, 92]);

// Retrieve data
const name = await db.get('name');      // 'Alice'
const settings = await db.fetch('name'); // Same as get()

// Delete data
await db.delete('name');   // Returns true if deleted
await db.del('settings');  // Alias for delete()
await db.deleteAll();      // Clear entire database
```

### Math Operations

```javascript
// Set initial value
await db.set('coins', 100);

// Add to a number
await db.add('coins', 50);     // 150

// Subtract from a number
await db.subtract('coins', 25); // 125

// Advanced math operations
await db.math('coins', 2, '*'); // 250 (multiply)
await db.math('coins', 5, '/'); // 50  (divide)
await db.math('coins', 7, '%'); // 1   (modulo)
```

### Array Operations

```javascript
// Push elements to array
await db.set('inventory', ['sword']);
await db.push('inventory', 'shield');  // ['sword', 'shield']
await db.push('inventory', 'potion');  // ['sword', 'shield', 'potion']

// Remove elements from array
await db.pull('inventory', 'sword');   // ['shield', 'potion']
```

### Query Operations

```javascript
// Get all entries
const all = await db.all();
// [{ ID: 'user', data: {...} }, { ID: 'coins', data: 150 }]

// Filter entries
const highScores = await db.filter(item => item.data > 100);

// Find entries by key pattern
const userEntries = await db.startsWith('user_');
const configEntries = await db.endsWith('_config');
```

### Utility Methods

```javascript
// Get database info
const count = await db.size();     // Number of entries
const type = await db.type('coins'); // 'number'

// Get last entry
const last = await db.last();

// Export to JSON
const json = await db.toJson();
// { user: {...}, coins: 150, inventory: [...] }

// Create backup
const backup = await db.backup('backup.json');
// { success: true, filename: 'backup.json', timestamp: 1642..., size: 3 }

// Close database connection
await db.close();
```

## 📋 API Reference

| Method | Aliases | Description |
|--------|---------|-------------|
| `get(key)` | `fetch` | Retrieve a value by key |
| `set(key, value)` | – | Store a value with key |
| `has(key)` | `exists`, `includes` | Check if key exists |
| `delete(key)` | `del` | Delete a key-value pair |
| `deleteAll()` | `clear` | Remove all data |
| `add(key, number)` | – | Add to a numeric value |
| `subtract(key, number)` | `remove` | Subtract from a numeric value |
| `math(key, number, operator)` | – | Perform math (+, -, *, /, %) |
| `push(key, element)` | – | Add element to array |
| `pull(key, element)` | – | Remove element from array |
| `all()` | `getAll`, `fetchAll` | Get all entries |
| `filter(fn)` | – | Filter entries by function |
| `startsWith(prefix)` | – | Find keys starting with prefix |
| `endsWith(suffix)` | – | Find keys ending with suffix |
| `size()` | `count`, `length` | Get number of entries |
| `type(key)` | `typeof` | Get type of stored value |
| `toJson()` | – | Export database as JSON object |
| `backup(filename?)` | – | Save database to JSON file |
| `last()` | – | Get the last entry |
| `close()` | – | Close database connection |

## 💡 Use Cases

**Discord Bots**
```javascript
// Economy system
await db.add(`balance_${userId}`, 100);
const balance = await db.get(`balance_${userId}`);

// Leveling system
await db.add(`xp_${userId}`, 10);
```

**Configuration Storage**
```javascript
await db.set('config', {
    prefix: '!',
    language: 'en',
    features: ['logging', 'moderation']
});
```

**Session Management**
```javascript
await db.set(`session_${sessionId}`, {
    userId: 123,
    expires: Date.now() + 3600000
});
```

## ⚙️ Requirements

- Node.js 14.0.0 or higher
- sqlite3 ^5.1.7

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the [MIT License](LICENSE).


[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fcoders908%2Fcoders.sqlite.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fcoders908%2Fcoders.sqlite?ref=badge_large)

## 👤 Author

**Coders**

- GitHub: [@coders908](https://github.com/coders908)
- Discord: coders1_1
---

<p align="center">
  Made with ❤️ by the Coders
</p>
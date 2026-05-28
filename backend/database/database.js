const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const databasePath = path.join(__dirname, "..", "returns.db");

const db = new sqlite3.Database(databasePath);

module.exports = db;

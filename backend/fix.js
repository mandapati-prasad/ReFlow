const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");

const db = new sqlite3.Database("./returns.db");

const realHash = bcrypt.hashSync("123456", 10);

console.log("Generated real hash:", realHash);

db.run(`UPDATE users SET password = ?`, [realHash], function (err) {
  if (err) {
    console.error("Error updating passwords:", err.message);
  } else {
    console.log(
      `Success! Updated ${this.changes} users with the correct working password.`
    );
    console.log("You can now log in with 123456!");
  }
  db.close();
});

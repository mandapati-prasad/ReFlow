const db = require("../database/database");

const createNotification = (userId, title, message) => {
  db.run(
    `
      INSERT INTO notifications
      (user_id,title,message)
      VALUES (?,?,?)
    `,
    [userId, title, message]
  );
};

module.exports = createNotification;

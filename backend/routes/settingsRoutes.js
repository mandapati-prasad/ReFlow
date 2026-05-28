const express = require("express");

const router = express.Router();

const db = require("../database/database");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("admin"), (req, res) => {
  db.get(`SELECT * FROM settings LIMIT 1`, (err, row) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(row);
  });
});

router.put("/", authMiddleware, roleMiddleware("admin"), (req, res) => {
  const { system_name, support_email, website, currency } = req.body;

  db.run(
    `
      UPDATE settings
      SET
      system_name = ?,
      support_email = ?,
      website = ?,
      currency = ?
      WHERE id = 1
    `,
    [system_name, support_email, website, currency],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({ message: "Settings updated" });
    }
  );
});

module.exports = router;

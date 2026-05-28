const express = require("express");
const router = express.Router();
const db = require("../database/database");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, (req, res) => {
  db.all(
    `
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.json(rows);
    }
  );
});

router.put("/:id/read", authMiddleware, (req, res) => {
  db.run(
    `
      UPDATE notifications
      SET is_read = 1
      WHERE id = ? AND user_id = ?
    `,
    [req.params.id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({
        message: "Notification marked as read",
      });
    }
  );
});

router.put("/read-all", authMiddleware, (req, res) => {
  db.run(
    `
      UPDATE notifications
      SET is_read = 1
      WHERE user_id = ?
    `,
    [req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }
      res.json({
        message: "All notifications updated",
      });
    }
  );
});

module.exports = router;

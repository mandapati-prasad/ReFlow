const express = require("express");

const router = express.Router();

const db = require("../database/database");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/:id", authMiddleware, (req, res) => {
  db.get(
    `
      SELECT * FROM order_items
      WHERE id = ?
    `,
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(row);
    }
  );
});

module.exports = router;

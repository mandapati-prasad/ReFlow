const express = require("express");
const router = express.Router();

const db = require("../database/database");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, (req, res) => {
  const { search = "", status = "" } = req.query;
  let query = `SELECT * FROM orders WHERE order_number LIKE ? AND status LIKE ?`;
  let params = [`%${search}%`, `%${status}%`];

  if (req.user.role === "customer") {
    query += ` AND customer_id = ?`;
    params.push(req.user.id);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

router.get("/:id", authMiddleware, (req, res) => {
  db.get(`SELECT * FROM orders WHERE id = ?`, [req.params.id], (err, row) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(row);
  });
});

router.get("/:id/items", authMiddleware, (req, res) => {
  db.all(
    `
      SELECT * FROM order_items
      WHERE order_id = ?
    `,
    [req.params.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(rows);
    }
  );
});

module.exports = router;

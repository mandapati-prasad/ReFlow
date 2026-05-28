const express = require("express");
const router = express.Router();
const db = require("../database/database");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/top-reasons",
  authMiddleware,
  roleMiddleware("admin", "support_agent"),
  (req, res) => {
    db.all(
      `SELECT reason, COUNT(*) as count 
     FROM return_requests 
     GROUP BY reason`,
      (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
      }
    );
  }
);

router.get(
  "/requests-timeline",
  authMiddleware,
  roleMiddleware("admin", "support_agent"),
  (req, res) => {
    db.all(
      `SELECT DATE(created_at) as date, COUNT(*) as count 
     FROM return_requests 
     GROUP BY DATE(created_at) 
     ORDER BY date ASC 
     LIMIT 7`,
      (err, rows) => {
        if (err) return res.status(500).json(err);
        res.json(rows);
      }
    );
  }
);

router.get("/overview", authMiddleware, roleMiddleware("admin"), (req, res) => {
  const data = { returns: [], refunds: [] };

  db.all(
    `SELECT DATE(created_at) as date, COUNT(*) as count 
     FROM return_requests 
     GROUP BY DATE(created_at) 
     LIMIT 7`,
    (err, returnsRows) => {
      if (err) return res.status(500).json(err);
      data.returns = returnsRows;

      db.all(
        `SELECT DATE(created_at) as date, SUM(refund_amount) as total_amount 
         FROM refunds 
         GROUP BY DATE(created_at) 
         LIMIT 7`,
        (err, refundRows) => {
          if (err) return res.status(500).json(err);
          data.refunds = refundRows;
          res.json(data);
        }
      );
    }
  );
});

module.exports = router;

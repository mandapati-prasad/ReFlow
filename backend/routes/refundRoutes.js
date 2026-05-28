const express = require("express");
const router = express.Router();
const db = require("../database/database");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, (req, res) => {
  let query = `SELECT r.* FROM refunds r`;
  let params = [];

  if (req.user.role === "customer") {
    query += `
      JOIN return_requests rr ON r.return_request_id = rr.id
      WHERE rr.customer_id = ?
    `;
    params.push(req.user.id);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

router.post("/", authMiddleware, (req, res) => {
  const { return_request_id, refund_amount, payment_method } = req.body;

  db.run(
    `
      INSERT INTO refunds
      (
        refund_number,
        return_request_id,
        refund_amount,
        refund_status,
        payment_method
      )
      VALUES (?,?,?,?,?)
    `,
    [
      `REF-${Date.now()}`,
      return_request_id,
      refund_amount,
      "Processing",
      payment_method,
    ],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      db.run(
        `
          INSERT INTO notifications (user_id, title, message, is_read, created_at)
          SELECT customer_id, 'Refund Processed', 'Great news! A refund of ₹' || ? || ' has been issued and is processing.', 0, CURRENT_TIMESTAMP
          FROM return_requests 
          WHERE id = ?
        `,
        [refund_amount, return_request_id],
        (notifErr) => {
          if (notifErr) console.error("Notification Error:", notifErr);
        }
      );

      res.json({ message: "Refund created" });
    }
  );
});

router.put("/:id/status", authMiddleware, (req, res) => {
  const { refund_status } = req.body;

  db.run(
    `
      UPDATE refunds
      SET refund_status = ?
      WHERE id = ?
    `,
    [refund_status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      db.run(
        `
          INSERT INTO notifications (user_id, title, message, is_read, created_at)
          SELECT rr.customer_id, 'Refund Status Updated', 'Your refund status is now: ' || ?, 0, CURRENT_TIMESTAMP
          FROM refunds r
          JOIN return_requests rr ON r.return_request_id = rr.id
          WHERE r.id = ?
        `,
        [refund_status, req.params.id],
        (notifErr) => {
          if (notifErr) console.error("Notification Error:", notifErr);
        }
      );

      res.json({ message: "Refund updated" });
    }
  );
});

module.exports = router;

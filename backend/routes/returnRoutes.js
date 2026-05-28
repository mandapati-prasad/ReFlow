const express = require("express");

const router = express.Router();

const db = require("../database/database");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const createNotification = require("../utils/createNotification");

const upload = require("../middleware/uploadMiddleware");

router.get("/", authMiddleware, (req, res) => {
  let query = `
    SELECT rr.*, oi.product_name, oi.price 
    FROM return_requests rr 
    JOIN order_items oi ON rr.order_item_id = oi.id
  `;
  let params = [];

  if (req.user.role === "customer") {
    query += ` WHERE rr.customer_id = ?`;
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
  db.get(
    `
      SELECT
      rr.*,
      oi.product_name,
      oi.price
      FROM return_requests rr
      JOIN order_items oi
      ON rr.order_item_id = oi.id
      WHERE rr.id = ?
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

router.post(
  "/",
  authMiddleware,
  roleMiddleware("customer"),
  upload.single("returnImage"),
  (req, res) => {
    const { order_item_id, reason, description } = req.body;
    const image_url = req.file ? req.file.path : null;
    const returnNumber = `RET-${Date.now()}`;

    db.get(
      `SELECT id FROM return_requests WHERE order_item_id = ?`,
      [order_item_id],
      (err, existing) => {
        if (err) return res.status(500).json(err);
        if (existing) {
          return res.status(400).json({
            message: "A return request for this item already exists.",
          });
        }

        db.run(
          `INSERT INTO return_requests (return_number, order_item_id, customer_id, reason, description, image_url, support_agent_id) VALUES (?,?,?,?,?,?,?)`,
          [
            returnNumber,
            order_item_id,
            req.user.id,
            reason,
            description,
            image_url,
            8,
          ],
          function (err) {
            if (err) return res.status(500).json(err);

            db.run(
              `INSERT INTO return_status_logs (return_request_id, status, changed_by) VALUES (?, ?, ?)`,
              [this.lastID, "Requested", req.user.id]
            );

            db.run(
              `
                INSERT INTO notifications (user_id, title, message, is_read)
                SELECT id, 'New Return Request', 'Return ' || ? || ' requires inspection.', 0
                FROM users 
                WHERE role IN ('support_agent', 'admin')
              `,
              [returnNumber],
              (notifErr) => {
                if (notifErr)
                  console.error(
                    "Failed to generate staff notifications:",
                    notifErr
                  );
              }
            );

            res.json({ message: "Return request created" });
          }
        );
      }
    );
  }
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("support_agent", "admin"),
  (req, res) => {
    const { status } = req.body;
    db.get(
      `SELECT * FROM return_requests WHERE id = ?`,
      [req.params.id],
      (err, returnRequest) => {
        if (err || !returnRequest)
          return res.status(404).json({ message: "Return request not found" });

        db.run(
          `UPDATE return_requests SET status = ? WHERE id = ?`,
          [status, req.params.id],
          function (err) {
            if (err) return res.status(500).json(err);

            // NEW: Log the status change into the return_status_logs table
            db.run(
              `INSERT INTO return_status_logs (return_request_id, status, changed_by) VALUES (?, ?, ?)`,
              [req.params.id, status, req.user.id]
            );

            createNotification(
              returnRequest.customer_id,
              `Return ${status}`,
              `Your return request ${returnRequest.return_number} is now ${status}`
            );
            res.json({ message: "Status updated" });
          }
        );
      }
    );
  }
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("support_agent", "admin"),
  (req, res) => {
    db.run(
      `DELETE FROM return_requests WHERE id = ?`,
      [req.params.id],
      function (err) {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({ message: "Return deleted" });
      }
    );
  }
);

router.get("/:id/comments", authMiddleware, (req, res) => {
  db.all(
    `
      SELECT
      comments.*,
      users.full_name,
      users.role
      FROM comments
      JOIN users
      ON comments.user_id = users.id
      WHERE return_request_id = ?
      ORDER BY comments.created_at DESC
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

router.post("/:id/comments", authMiddleware, (req, res) => {
  const { comment } = req.body;

  db.run(
    `
      INSERT INTO comments
      (return_request_id, user_id, comment)
      VALUES (?,?,?)
    `,
    [req.params.id, req.user.id, comment],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      if (req.user.role === "customer") {
        db.run(
          `
            INSERT INTO notifications (user_id, title, message, is_read, created_at)
            SELECT id, 'New Comment', 'A customer commented on Return Request ID ' || ?, 0, CURRENT_TIMESTAMP
            FROM users 
            WHERE role IN ('support_agent', 'admin')
          `,
          [req.params.id]
        );
      } else {
        db.run(
          `
            INSERT INTO notifications (user_id, title, message, is_read, created_at)
            SELECT customer_id, 'New Reply', 'Support has replied to your return request of ID' || ?, 0, CURRENT_TIMESTAMP
            FROM return_requests 
            WHERE id = ?
          `,
          [req.params.id, req.params.id]
        );
      }

      res.json({ message: "Comment added" });
    }
  );
});

module.exports = router;

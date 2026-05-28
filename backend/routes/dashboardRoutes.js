const express = require("express");

const router = express.Router();

const db = require("../database/database");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get(
  "/customer",
  authMiddleware,
  roleMiddleware("customer"),
  (req, res) => {
    const query = `
    SELECT
      (SELECT COUNT(*) FROM orders WHERE customer_id = ?) AS totalOrders,
      (SELECT COUNT(*) FROM return_requests WHERE customer_id = ?) AS returnRequests,
      (SELECT COUNT(*) FROM refunds 
       JOIN return_requests ON refunds.return_request_id = return_requests.id 
       WHERE return_requests.customer_id = ?) AS refunds,
      (SELECT COUNT(*) FROM return_requests 
       WHERE status = 'Under Review' AND customer_id = ?) AS pendingActions
  `;

    db.get(
      query,
      [req.user.id, req.user.id, req.user.id, req.user.id],
      (err, row) => {
        if (err) {
          console.error("Dashboard Error:", err);
          return res
            .status(500)
            .json({ error: "Failed to load dashboard data" });
        }
        res.json(row);
      }
    );
  }
);

router.get(
  "/support",
  authMiddleware,
  roleMiddleware("support_agent"),
  (req, res) => {
    db.get(
      `
      SELECT
      (SELECT COUNT(*) FROM return_requests) AS totalRequests,
      (SELECT COUNT(*) FROM return_requests WHERE status = 'Under Review') AS underReview,
      (SELECT COUNT(*) FROM return_requests WHERE status = 'Approved') AS approved,
      (SELECT COUNT(*) FROM return_requests WHERE status = 'Rejected') AS rejected
    `,
      (err, row) => {
        if (err) {
          return res.status(500).json(err);
        }

        res.json(row);
      }
    );
  }
);

router.get("/admin", authMiddleware, roleMiddleware("admin"), (req, res) => {
  db.get(
    `
      SELECT
      (SELECT COUNT(*) FROM users) AS totalUsers,
      (SELECT COUNT(*) FROM orders) AS totalOrders,
      (SELECT COUNT(*) FROM return_requests) AS totalReturns,
      (SELECT COUNT(*) FROM refunds) AS totalRefunds
    `,
    (err, row) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(row);
    }
  );
});

module.exports = router;

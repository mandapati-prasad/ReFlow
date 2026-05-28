const express = require("express");
const router = express.Router();
const db = require("../database/database");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/:returnRequestId", authMiddleware, (req, res) => {
  db.get(
    `
      SELECT * FROM inspection_reports
      WHERE return_request_id = ?
    `,
    [req.params.returnRequestId],
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
  roleMiddleware("support_agent", "admin"),
  (req, res) => {
    const {
      return_request_id,
      inspector_name,
      product_condition,
      packaging_condition,
      accessories_included,
      inspection_notes,
      inspection_result,
    } = req.body;

    db.run(
      `
      INSERT INTO inspection_reports
      (
        return_request_id,
        inspector_name,
        product_condition,
        packaging_condition,
        accessories_included,
        inspection_notes,
        inspection_result
      )
      VALUES (?,?,?,?,?,?,?)
    `,
      [
        return_request_id,
        inspector_name,
        product_condition,
        packaging_condition,
        accessories_included,
        inspection_notes,
        inspection_result,
      ],
      function (err) {
        if (err) {
          return res.status(500).json(err);
        }

        db.run(
          `
            INSERT INTO notifications (user_id, title, message, is_read, created_at)
            SELECT id, 'Inspection Complete', 'Return ID ' || ? || ' has been inspected and is ready for review.', 0, CURRENT_TIMESTAMP
            FROM users 
            WHERE role = 'admin'
          `,
          [return_request_id],
          (notifErr) => {
            if (notifErr) console.error("Notification Error:", notifErr);
          }
        );

        res.json({ message: "Inspection report created" });
      }
    );
  }
);

module.exports = router;

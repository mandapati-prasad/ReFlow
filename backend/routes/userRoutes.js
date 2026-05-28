const express = require("express");

const router = express.Router();

const db = require("../database/database");
const upload = require("../middleware/uploadMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, roleMiddleware("admin"), (req, res) => {
  db.all(`SELECT * FROM users`, (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(rows);
  });
});

router.get("/profile", authMiddleware, (req, res) => {
  db.get(
    `
      SELECT
      id,
      full_name,
      email,
      role,
      phone,
      address,
      profile_image,
      status,
      created_at
      FROM users
      WHERE id = ?
    `,
    [req.user.id],
    (err, row) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json(row);
    }
  );
});

router.put(
  "/profile-image",
  authMiddleware,
  upload.single("profileImage"),
  (req, res) => {
    const imagePath = req.file.path;

    db.run(
      `
      UPDATE users
      SET profile_image = ?
      WHERE id = ?
    `,
      [imagePath, req.user.id],
      function (err) {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({
          message: "Profile updated",
          profile_image: imagePath,
        });
      }
    );
  }
);

router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    const { status } = req.body;

    db.run(
      `
      UPDATE users
      SET status = ?
      WHERE id = ?
    `,
      [status, req.params.id],
      function (err) {
        if (err) {
          return res.status(500).json(err);
        }

        res.json({ message: "User updated" });
      }
    );
  }
);

router.delete("/:id", authMiddleware, roleMiddleware("admin"), (req, res) => {
  db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({ message: "User deleted" });
  });
});

module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const router = express.Router();

const db = require("../database/database");

router.post("/register", async (req, res) => {
  const { full_name, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `
      INSERT INTO users
      (full_name,email,password,role)
      VALUES (?,?,?,?)
    `,
      [full_name, email, hashedPassword, role],
      function (err) {
        if (err) {
          return res.status(500).json({ message: err.message });
        }

        res.json({ message: "User registered" });
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.status === "Inactive") {
      return res.status(403).json({
        message:
          "Your account has been deactivated. Please contact an administrator.",
      });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      token,
      role: user.role,
      user,
    });
  });
});0

module.exports = router;

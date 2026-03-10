// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const router = express.Router();
const SECRET = "mysecret";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!valid)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

module.exports = router;
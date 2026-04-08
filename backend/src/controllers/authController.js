const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const { signAccessToken } = require("../utils/jwt");

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPasswordValid(value) {
  return typeof value === "string" && value.length >= 6;
}

function isNameValid(value) {
  return typeof value === "string" && value.trim().length >= 2;
}

async function signup(req, res) {
  const { name, email, password } = req.body;

  if (!isNameValid(name) || !isEmail(email) || !isPasswordValid(password)) {
    return res.status(400).json({ message: "Invalid name, email, or password" });
  }

  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
    email.toLowerCase(),
  ]);

  if (existing.rowCount > 0) {
    return res.status(409).json({ message: "Email already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
    [name.trim(), email.toLowerCase(), passwordHash]
  );

  const user = result.rows[0];
  const token = signAccessToken({ id: user.id, email: user.email, name: user.name });

  return res.status(201).json({ token, user });
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!isEmail(email) || !isPasswordValid(password)) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const result = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = $1",
    [email.toLowerCase()]
  );

  if (result.rowCount === 0) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = result.rows[0];
  const ok = await bcrypt.compare(password, user.password_hash);

  if (!ok) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = signAccessToken({ id: user.id, email: user.email, name: user.name });

  return res.json({
    token,
    user: { id: user.id, name: user.name || user.email, email: user.email },
  });
}

module.exports = {
  signup,
  login,
};

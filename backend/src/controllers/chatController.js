const pool = require("../db/pool");

async function getUsers(req, res) {
  const result = await pool.query(
    "SELECT id, COALESCE(name, email) AS name, email FROM users WHERE id <> $1 ORDER BY name ASC",
    [req.user.id]
  );
  return res.json(result.rows);
}

async function getMessages(req, res) {
  const currentUserId = Number(req.user.id);
  const withUserId = Number(req.params.userId);

  if (!withUserId || Number.isNaN(withUserId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  const result = await pool.query(
    `SELECT id, sender_id, receiver_id, body, created_at
     FROM messages
     WHERE (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY created_at ASC`,
    [currentUserId, withUserId]
  );

  return res.json(result.rows);
}

module.exports = {
  getUsers,
  getMessages,
};

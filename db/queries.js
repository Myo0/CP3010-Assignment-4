const pool = require('./pool');

async function getUserByEmail(email) {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return rows[0];
}

async function createUser(firstName, lastName, email, hashedPassword) {
  const { rows } = await pool.query(
    'INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [firstName, lastName, email, hashedPassword]
  );
  return rows[0];
}

async function setMember(userId) {
  await pool.query('UPDATE users SET is_member = TRUE WHERE id = $1', [userId]);
}

async function setAdmin(userId) {
  await pool.query('UPDATE users SET is_admin = TRUE, is_member = TRUE WHERE id = $1', [userId]);
}

async function getAllMessages() {
  const { rows } = await pool.query(`
    SELECT messages.id, messages.title, messages.text, messages.created_at,
           users.first_name, users.last_name
    FROM messages
    JOIN users ON messages.author_id = users.id
    ORDER BY messages.created_at DESC
  `);
  return rows;
}

async function createMessage(title, text, authorId) {
  await pool.query(
    'INSERT INTO messages (title, text, author_id) VALUES ($1, $2, $3)',
    [title, text, authorId]
  );
}

async function deleteMessage(id) {
  await pool.query('DELETE FROM messages WHERE id = $1', [id]);
}

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  setMember,
  setAdmin,
  getAllMessages,
  createMessage,
  deleteMessage,
};

import pool from '../database/index.js'

export async function findAllUsers() {
  const query = `
    SELECT
      id,
      username,
      email,
      is_active,
      created_at,
      updated_at
    FROM users
  `

  const { rows } = await pool.query(query)
  return rows
}

export async function createUser({ username, email, passwordHash }) {
    const query = `
    INSERT INTO users (username, email, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, is_active, created_at
    `
    const values = [username, email, passwordHash]
    const { rows } = await pool.query(query, values)

    return rows[0]
}
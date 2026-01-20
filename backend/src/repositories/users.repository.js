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

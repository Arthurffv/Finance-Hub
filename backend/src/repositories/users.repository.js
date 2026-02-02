import pool from '../database/index.js'

// Buscar todos os usuários
export async function findAllUsers() {
  const query = 'SELECT id, username, email, created_at FROM users'
  const { rows } = await pool.query(query)
  return rows
}

// Buscar por Email (ESSENCIAL PARA O LOGIN)
export async function findUserByEmail(email) {
  const query = 'SELECT * FROM users WHERE email = $1'
  const values = [email]
  const { rows } = await pool.query(query, values)
  return rows[0]
}

// Criar Usuário
export async function createUser({ username, email, passwordHash }) {
    const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at
    `
    // Note acima: Mudei "password_hash" para "password" para bater com sua tabela!
    
    const values = [username, email, passwordHash]
    const { rows } = await pool.query(query, values)
    return rows[0]
}
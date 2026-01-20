import { findAllUsers } from '../repositories/users.repository.js'

export async function getUsers(req, res) {
  try {
    const users = await findAllUsers()
    return res.status(200).json(users)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao buscar usuários' })
  }
}

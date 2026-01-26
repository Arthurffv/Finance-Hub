import { findAllUsers, createUser } from '../repositories/users.repository.js'
import bcrypt from 'bcrypt'
export async function getUsers(req, res) {
  try {
    const users = await findAllUsers()
    return res.status(200).json(users)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao buscar usuários' })
  }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password) {
    return password.length >= 6
}

export async function createUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Todos os campos são obrigatórios' })
        }

        if (!isValidEmail(email)) {
            return res.status(400).json({ message: 'Email inválido' })
        }

        if (!isValidPassword(password)) {
            return res.status(400).json({ message: 'A senha deve ter pelo menos 6 caracteres' })
        }
    

    const passwordHash = await bcrypt.hash(password, 10)

    const user = await createUser({ username, email, passwordHash })

    return res.status(201).json(user)

    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ message: 'Usuário ou email já existe' })
        }

        console.error(error)
        return res.status(500).json({ message: 'Erro ao criar usuário' })
    }
}


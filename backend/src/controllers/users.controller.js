import { findAllUsers, createUser, findUserByEmail } from '../repositories/users.repository.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidPassword(password) {
    return password.length >= 6
}

// --- LOGIN ---
export async function loginController(req, res) {
    try {
        const { email, password } = req.body
        const user = await findUserByEmail(email)

        if (!user) {
            return res.status(401).json({ message: 'Credenciais inválidas' })
        }

        // CORREÇÃO AQUI: Mudamos de .password_hash para .password
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Credenciais inválidas' })
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' })

        return res.status(200).json({ message: 'Login realizado!', token, user })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Erro no login' })
    }
}

// --- CADASTRO ---
export async function createUserController(req, res) {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) return res.status(400).json({ message: 'Campos obrigatórios' })
        if (!isValidEmail(email)) return res.status(400).json({ message: 'Email inválido' })
        if (!isValidPassword(password)) return res.status(400).json({ message: 'Senha curta' })
    
        const passwordHash = await bcrypt.hash(password, 10)
        
        // Aqui mantemos passwordHash porque é o nome da variável local, 
        // o repositório que vai se virar para salvar na coluna certa.
        const user = await createUser({ username, email, passwordHash })

        return res.status(201).json(user)

    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ message: 'Email já existe' })
        console.error(error)
        return res.status(500).json({ message: 'Erro ao criar usuário' })
    }
}

export async function getUsers(req, res) {
    const users = await findAllUsers()
    return res.status(200).json(users)
}

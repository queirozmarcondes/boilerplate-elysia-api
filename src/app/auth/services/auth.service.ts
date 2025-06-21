import { db } from '../../../config/db'
import type { User } from '../../users/types/user'
import { hash, compare } from 'bcryptjs'

// Buscar usuário por email
export async function getUserByEmail(email: string): Promise<User | null> {
  const stmt = db.query('SELECT * FROM users WHERE email = $email LIMIT 1;')
  return (stmt.get({ $email: email }) as User | undefined) ?? null
}

// Hash da senha
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10) // 10 é o salt rounds (nível de segurança)
}

// Verificar senha
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await compare(password, hash)
}

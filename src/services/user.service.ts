// src/services/users.service.ts
import { db } from '../config/db'
import { hashPassword } from './auth.service'
import type { User, UserCreate, UserUpdate } from '../types/user'

// Cria tabela users, caso não exista
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT NOT NULL,
    password TEXT NOT NULL,
    cpf TEXT NOT NULL,
    isActive INTEGER NOT NULL,
    roles TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`)

// Insere um usuário e retorna o objeto

export async function createUser(data: UserCreate): Promise<Omit<User, 'password'>> {
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  const hashedPassword = await hashPassword(data.password)

  const stmt = db.query(`
    INSERT INTO users (
      id, name, email, telefone, password, cpf,
      isActive, roles, createdAt, updatedAt
    ) VALUES (
      $id, $name, $email, $telefone, $password, $cpf,
      $isActive, $roles, $createdAt, $updatedAt
    );
  `)

  stmt.run({
    $id: id,
    $name: data.name,
    $email: data.email,
    $telefone: data.telefone,
    $password: hashedPassword,
    $cpf: data.cpf,
    $isActive: data.isActive ? 1 : 0,
    $roles: data.roles,
    $createdAt: now,
    $updatedAt: now,
  })

  return {
    id,
    ...data,
    createdAt: now,
    updatedAt: now,
  }
}

// Busca todos usuários com isActive convertido para boolean
export function getAllUsers(): User[] {
  const result = db.query('SELECT * FROM users;').all() as User[]

  return result.map((user: User) => ({
    ...user,
    isActive: Boolean(user.isActive), // converte 0/1 para boolean
  }))
}

// Busca um usuário por ID
export function getUserById(id: string): User | null {
  const stmt = db.query('SELECT * FROM users WHERE id = $id;')
  return {
    ...(stmt.get({ $id: id }) as User),
    isActive: Boolean((stmt.get({ $id: id }) as User).isActive), // converte 0/1 para boolean
  }
}

// Atualiza no banco e retorna o usuario atualizado

export async function updateUser(id: string, data: UserUpdate): Promise<User | null> {
  const existing = db.query<User, { $id: string }>(
    'SELECT * FROM users WHERE id = $id LIMIT 1;'
  ).get({ $id: id })

  if (!existing) return null

  // Se veio nova senha, faça o hash
  let newPassword = existing.password
  if (data.password) {
    newPassword = await hashPassword(data.password)
  }

  const now = new Date().toISOString()

  // Execute o UPDATE usando parâmetros
  db.query(`
    UPDATE users SET
      name      = $name,
      email     = $email,
      telefone  = $telefone,
      cpf       = $cpf,
      password  = $password,
      isActive  = $isActive,
      roles     = $roles,
      updatedAt = $updatedAt
    WHERE id = $id;
  `).run({
    $id: id,
    $name: data.name ?? existing.name,
    $email: data.email ?? existing.email,
    $telefone: data.telefone ?? existing.telefone,
    $cpf: data.cpf ?? existing.cpf,
    $password: newPassword,
    $isActive: data.isActive != null ? (data.isActive ? 1 : 0) : existing.isActive,
    $roles: data.roles ?? existing.roles,
    $updatedAt: now,
  })

  // Recarregue e retorne o usuário
  const updated = db.query<User, { $id: string }>(
    'SELECT * FROM users WHERE id = $id LIMIT 1;'
  ).get({ $id: id })

  if (!updated) return null
  updated.isActive = Boolean(updated.isActive)
  return updated
}


export function softDeleteUser(id: string): boolean {
  const existing = getUserById(id)
  if (!existing) return false

  // inverte o booleano atual
  const novoEstado = !existing.isActive

  const stmt = db.query(`
    UPDATE users
    SET isActive = $isActive,
        updatedAt = $updatedAt
    WHERE id = $id
  `)

  const changes = stmt.run({
    $id: id,
    $isActive: novoEstado ? 1 : 0,
    $updatedAt: new Date().toISOString(),
  }).changes

  return changes > 0
}

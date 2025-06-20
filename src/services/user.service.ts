// src/services/users.service.ts
import { db } from '../config/db'
import type { User, UserCreate, UserUpdate } from '../types/user'
import { hashPassword } from './auth.service'

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
    //password: hashedPassword,
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


export function updateUser(id: string, data: UserUpdate): User | null {
  const existing = getUserById(id)
  if (!existing) return null

  const updated = {
    ...existing,
    ...data,
    email: data.email ?? existing.email,
    telefone: data.telefone ?? existing.telefone,
    cpf: data.cpf ?? existing.cpf,
    name: data.name ?? existing.name,
    password: data.password ?? existing.password,
    isActive: data.isActive ?? existing.isActive,
    roles: data.roles ?? existing.roles,
    updatedAt: new Date().toISOString(),
    id: existing.id,  // insere id diretamente
  }

  // 1) Prepara o statement
  const stmt = db.prepare(`
    UPDATE users
    SET 
      name = $name,
      email = $email,
      telefone = $telefone,
      password = $password,
      cpf = $cpf,
      isActive = $isActive,
      roles = $roles,
      updatedAt = $updatedAt
    WHERE id = $id
  `)

  // 2) Executa com o objeto de bindings
  stmt.run(updated)

  // 3) Garante booleano correto
  updated.isActive = Boolean(updated.isActive)

  return updated
}



// Desativa o usuário (soft delete)
export function softDeleteUser(id: string): boolean {
  const stmt = db.query(`
    UPDATE users SET isActive = 0, updatedAt = $updatedAt WHERE id = $id
  `)
  const changes = stmt.run({ $id: id, $updatedAt: new Date().toISOString() }).changes
  return changes > 0
}

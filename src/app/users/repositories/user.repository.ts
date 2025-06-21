//user repository.ts

import { db } from '../../../config/db'
import type { User } from '../types/user'

export const UserRepository = {
  async create(raw: Omit<User, 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date().toISOString()
    const rolesText = JSON.stringify(raw.roles)

    await db
      .query(
        `
      INSERT INTO users (
        id, name, email, telefone, password, cpf,
        isActive, roles, createdAt, updatedAt
      ) VALUES (
        $id, $name, $email, $telefone, $password, $cpf,
        $isActive, $roles, $createdAt, $updatedAt
      );
    `,
      )
      .run({
        $id: raw.id,
        $name: raw.name,
        $email: raw.email,
        $telefone: raw.telefone,
        $password: raw.password,
        $cpf: raw.cpf,
        $isActive: raw.isActive ? 1 : 0,
        $roles: rolesText,
        $createdAt: now,
        $updatedAt: now,
      })

    return {
      ...raw,
      roles: raw.roles,
      createdAt: now,
      updatedAt: now,
    }
  },

  // Ao buscar, desserialize também:
  async findAll(): Promise<User[]> {
    const rows = db.query('SELECT * FROM users;').all() as any[]

    return rows.map((u) => {
      let roles: string[]

      // Primeiro, se já é array, use direto
      if (Array.isArray(u.roles)) {
        roles = u.roles
      } else if (typeof u.roles === 'string') {
        // Tenta JSON.parse, senão cai no catch
        try {
          const parsed = JSON.parse(u.roles)
          // Se parseou em string ou array, normalize para array
          roles = Array.isArray(parsed) ? parsed : [parsed]
        } catch {
          // Não era JSON, então é string simples
          roles = [u.roles]
        }
      } else {
        // Qualquer outro caso inesperado
        roles = []
      }

      return {
        ...u,
        isActive: Boolean(u.isActive),
        roles,
      }
    })
  },

  //
  async findById(id: string): Promise<User | null> {
    const row = db.query('SELECT * FROM users WHERE id = $id;').get({ $id: id }) as any
    if (!row) return null
    return {
      ...row,
      isActive: Boolean(row.isActive),
      roles: JSON.parse(row.roles),
    }
  },

  //Atualiza usuário
  async update(id: string, partial: Partial<User> & { password?: string }): Promise<User | null> {
    // Carrega o existente
    const existing = await this.findById(id)
    if (!existing) return null

    //
    const updated: any = {
  ...existing,
  ...Object.fromEntries(
    Object.entries(partial).filter(([_, v]) => v !== undefined)
  ),
  updatedAt: new Date().toISOString(),
}


    // Persistir
    await db
      .query(
        `
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
    `,
      )
      .run({
        $id: id,
        $name: updated.name,
        $email: updated.email,
        $telefone: updated.telefone,
        $cpf: updated.cpf,
        $password: updated.password,
        $isActive: updated.isActive ? 1 : 0,
        $roles: JSON.stringify(updated.roles),
        $updatedAt: updated.updatedAt,
      })

    return this.findById(id)
  },

  async softDelete(id: string): Promise<boolean> {
    const user = await this.findById(id)
    if (!user) return false
    const newState = !user.isActive
    const changes = db
      .query(
        `
      UPDATE users
      SET isActive = $isActive,
          updatedAt = $updatedAt
      WHERE id = $id
    `,
      )
      .run({
        $id: id,
        $isActive: newState ? 1 : 0,
        $updatedAt: new Date().toISOString(),
      }).changes
    return changes > 0
  },
}

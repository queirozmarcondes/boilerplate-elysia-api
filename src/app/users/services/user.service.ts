//user service.ts

import { UserRepository } from '../repositories/user.repository'
import { hashPassword } from '../../auth/services/auth.service'
import type { UserCreate, UserUpdate } from '../types/user'
import type { User } from '../types/user'

export const UserService = {
  async createUser(data: UserCreate): Promise<Omit<User, 'password'>> {
    const id = crypto.randomUUID()
    const hashed = await hashPassword(data.password)
    const created = await UserRepository.create({
      id,
      ...data,
      password: hashed,
    })
    const { password, ...rest } = created
    return rest
  },

  //Retorna usuários
  async getAllUsers(): Promise<User[]> {
    return UserRepository.findAll()
  },

  async getUserById(id: string): Promise<User | null> {
    return UserRepository.findById(id)
  },

  async updateUser(id: string, data: UserUpdate): Promise<User | null> {
    // Se vier senha, faz hash
    if (data.password) {
      data.password = await hashPassword(data.password)
    }
    return UserRepository.update(id, data as any)
  },

  async softDeleteUser(id: string): Promise<boolean> {
    return UserRepository.softDelete(id)
  },
}

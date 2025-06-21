// src/controllers/user.controller.ts
import { UserService } from '../services/user.service'
import type { UserCreate, UserUpdate } from '../types/user'

export async function handleGetAllUsers() {
  return await UserService.getAllUsers()
}

export async function handleGetUserById(id: string) {
  const user = await UserService.getUserById(id)
  if (!user) {
    throw new Error(`Usuário ${id} não encontrado`)
  }
  return user
}

export async function handleCreateUser(body: UserCreate) {
  return await UserService.createUser(body)
}

export async function handleUpdateUser(id: string, body: UserUpdate) {
  const updated = await UserService.updateUser(id, body)
  if (!updated) {
    throw new Error(`Usuário ${id} não encontrado`)
  }
  return updated
}

export async function handleSoftDeleteUser(id: string) {
  const result = await UserService.softDeleteUser(id)
  return result
}

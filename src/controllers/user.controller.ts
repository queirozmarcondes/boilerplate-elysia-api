import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
} from '../services/user.service'

export async function handleGetAllUsers() {
  return await getAllUsers()
}

export async function handleGetUserById(id: string) {
  const user = await getUserById(id)
  if (!user) {
    throw new Error(`Usuário ${id} não encontrado`)
  }
  return user
}

export async function handleCreateUser(body: any) {
  return await createUser(body)
}

export async function handleUpdateUser(id: string, body: any) {
  const updated = await updateUser(id, body)
  if (!updated) {
    throw new Error(`Usuário ${id} não encontrado`)
  }
  return updated
}

export async function handleSoftDeleteUser(id: string) {
  return await softDeleteUser(id)
}

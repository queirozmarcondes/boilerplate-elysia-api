import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
} from '../services/user.service'

//   'SELECT * FROM users WHERE id = $id;'
export async function handleGetAllUsers() {
  return await getAllUsers()
}

//   ).get({ $id: id })
export async function handleGetUserById(id: string) {
  const user = await getUserById(id)
  if (!user) {
    throw new Error(`Usuário ${id} não encontrado`)
  }
  return user
}

// Cria um usuário e retorna o usuário criado
export async function handleCreateUser(body: any) {
  return await createUser(body)
}

// Atualiza um usuário e retorna o usuário atualizado
export async function handleUpdateUser(id: string, body: any) {
  const updated = await updateUser(id, body)
  if (!updated) {
    throw new Error(`Usuário ${id} não encontrado`)
  }
  return updated
}

// Marca um usuário como deletado (soft delete) e retorna true se bem-sucedido
export async function handleSoftDeleteUser(id: string) {
  return await softDeleteUser(id)
}

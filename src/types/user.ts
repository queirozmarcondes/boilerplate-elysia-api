export type User = {
  id: string
  name: string
  email: string
  telefone: string
  password: string
  cpf: string
  isActive: boolean
  roles: 'user' | 'admin' | 'moderator'
  createdAt: string
  updatedAt: string
}

export type UserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UserUpdate = Partial<UserCreate>

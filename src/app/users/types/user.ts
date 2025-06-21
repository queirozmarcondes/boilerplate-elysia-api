export type User = {
  id: string
  name: string
  email: string
  telefone: string
  password: string
  cpf: string
  isActive: boolean
  roles: Role[]
  createdAt: string
  updatedAt: string
}

export type Role = 'user' | 'admin' | 'moderator'

export type UserCreate = Omit<User, 'id' | 'createdAt' | 'updatedAt'>
export type UserUpdate = Partial<UserCreate>

export type UserId = number

export type User = {
  id: UserId
  email: string
  displayName: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date | null
}

export type CreateUserData = {
  email: string
  displayName: string
}

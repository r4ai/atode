import type { CreateUserData, User, UserId } from "@/domain/entities/user"

type FindUserOptions = { id: UserId } | { email: string }

export type UserRepository = {
  find(options: FindUserOptions): Promise<User[]>
  create(data: CreateUserData): Promise<User>
  update(id: UserId, data: Partial<CreateUserData>): Promise<User | null>
  delete(id: UserId): Promise<boolean>
}

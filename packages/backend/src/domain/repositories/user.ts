import type { CreateUserData, User, UserId } from "@/domain/entities/user"

export type UserRepository = {
  findById(id: UserId): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  create(data: CreateUserData): Promise<User>
  update(id: UserId, data: Partial<CreateUserData>): Promise<User | null>
  delete(id: UserId): Promise<boolean>
}

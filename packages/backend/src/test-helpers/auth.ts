import type { AdapterUser } from "@auth/core/adapters"
import type { AuthUser } from "@hono/auth-js"
import { createMiddleware } from "hono/factory"
import type { User } from "@/presentation/schema"

export const mockAuth = (user: User) =>
  createMiddleware(async (c, next) => {
    const adapterUser: AdapterUser = {
      id: user.id.toString(),
      email: user.email,
      emailVerified: null,
      name: user.displayName,
    }
    const authUser: AuthUser = {
      session: {
        user: adapterUser,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      },
      user: adapterUser,
    }
    c.set("authUser", authUser)

    await next()
  })

import { Loader2 } from "lucide-react"
import { LoginPage } from "./login-page"
import { useSession } from "@hono/auth-js/react"

type ProtectedRouteProps = {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const session = useSession()

  if (session.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-500 text-sm dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (session.status === "unauthenticated") {
    return <LoginPage />
  }

  return <>{children}</>
}

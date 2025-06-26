import { createFileRoute } from "@tanstack/react-router"
import { LoginForm } from "./-components/login-form"

const Login = () => (
  <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
    <LoginForm />
  </div>
)

export const Route = createFileRoute("/login/")({
  component: Login,
})

import { signIn } from "@hono/auth-js/react"
import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const LoginPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-2xl">Welcome to TODO</CardTitle>
          <CardDescription>
            Sign in to manage your tasks and projects
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            onClick={() =>
              signIn("github", {
                redirect: true,
                callbackUrl: "http://localhost:3000/dashboard",
              })
            }
            className="w-full"
            variant="outline"
            size="lg"
          >
            <Github className="mr-2 h-4 w-4" />
            Sign in with GitHub
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                Secure authentication via Auth.js
              </span>
            </div>
          </div>

          <div className="text-center text-gray-500 text-xs dark:text-gray-400">
            <p>
              By signing in, you agree to our{" "}
              <a
                href="/terms"
                className="underline hover:text-gray-700 dark:hover:text-gray-300"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline hover:text-gray-700 dark:hover:text-gray-300"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

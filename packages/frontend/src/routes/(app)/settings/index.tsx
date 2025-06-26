import { createFileRoute } from "@tanstack/react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Settings = () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <div className="mx-auto w-full max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>
              Manage your account settings and preferences.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Settings page coming soon...
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export const Route = createFileRoute("/(app)/settings/")({
  component: Settings,
})

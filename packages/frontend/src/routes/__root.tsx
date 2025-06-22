import type { QueryClient } from "@tanstack/react-query"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Toaster } from "@/components/ui/sonner"

type RouterContext = {
  queryClient: QueryClient
}

export const Route = createRootRoute<RouterContext>({
  context: () => ({}) as RouterContext, // This will be provided by main.tsx
  component: () => (
    <>
      <Outlet />
      <Toaster />
      <TanStackRouterDevtools />
    </>
  ),
})

import type { Decorator, Preview } from "@storybook/react-vite"
import "../src/globals.css"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router"
import { initialize, mswLoader } from "msw-storybook-addon"
import { handlers } from "../src/mocks/handlers"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const RouterDecorator: Decorator = (Story) => {
  const rootRoute = createRootRoute({ component: () => <Story /> })
  const router = createRouter({ routeTree: rootRoute })
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

initialize()

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#ffffff",
        },
        {
          name: "dark",
          value: "#000000",
        },
      ],
    },
    docs: {
      toc: true,
    },
    msw: {
      handlers,
    },
  },
  loaders: [mswLoader],
  decorators: [
    RouterDecorator,
    (Story, context) => {
      const background = context.globals.backgrounds?.value || "#ffffff"
      const isDark = background === "#000000"

      return (
        <div
          className={isDark ? "dark" : ""}
          style={{
            background: isDark ? "oklch(0.145 0 0)" : "#ffffff",
            minHeight: "100vh",
            padding: "1rem",
          }}
        >
          <Story />
        </div>
      )
    },
  ],
}

export default preview

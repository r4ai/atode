/// <reference types="vitest/config" />

import { resolve } from "node:path"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import tailwindcss from "@tailwindcss/vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      "@hono/auth-js/react",
      "@tanstack/react-query",
      "@tanstack/react-router",
      "react-dom/client",
      "web-vitals",
      "@tanstack/react-router-devtools",
    ],
  },
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: resolve(__dirname, ".storybook"),
            storybookScript: "bun run storybook --ci",
          }),
        ],
        test: {
          name: "storybook",
          browser: {
            enabled: true,
            provider: "playwright",
            headless: true,
            instances: [
              {
                browser: "chromium",
                launch: {
                  channel: "chrome",
                },
              },
            ],
          },
          setupFiles: ["./.storybook/vitest.setup.ts"],
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:4000/",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
    tailwindcss(),
    viteReact(),
  ],
})

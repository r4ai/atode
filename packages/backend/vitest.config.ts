import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      enabled: true,
      reporter: ["text", "html", "clover", "json"],
      reportsDirectory: "./coverage",
      ignoreEmptyLines: true,
      thresholds: {
        functions: 50,
        branches: 80,
        lines: 30,
        statements: 30,
      },
      exclude: [
        "node_modules/**",
        "dist/**",
        "coverage/**",
        "**/*.d.ts",
        "**/*.config.*",
        "drizzle/**",
        "src/types.d.ts",
        "src/test-utils/**",
        "**/*.test.ts",
        "**/*.mock.ts",
      ],
    },
    setupFiles: ["./src/test-utils/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

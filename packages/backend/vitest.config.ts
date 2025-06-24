import path from "node:path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
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
        "src/test-helpers/**",
        "**/*.test.ts",
        "**/*.mock.ts",
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          include: ["**/*.unit.test.ts"],
          setupFiles: ["./src/test-helpers/unit-setup.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          include: ["**/*.integration.test.ts"],
          setupFiles: ["./src/test-helpers/integration-setup.ts"],
        },
      },
    ],
  },
})

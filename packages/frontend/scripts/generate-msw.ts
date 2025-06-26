import * as path from "node:path"
import { $ } from "bun"

console.log("=== Initializing MSW ===")

await $`bun run msw init`

console.log("=== Generating MSW Auto Mock ===")

const schemaPath = path.resolve(
  import.meta.dirname,
  "../../backend/src/generated/openapi.json",
)
const outputPath = path.resolve(import.meta.dirname, "../src/mocks")

await $`bun run msw-auto-mock ${schemaPath} --output ${outputPath}`
await $`bun run biome check --write ${outputPath}`

import * as fs from "node:fs/promises"
import * as path from "node:path"
import { $ } from "bun"
import { generateSpecs } from "hono-openapi"
import { app, openApiSpecsOptions } from "../src/app"

const specs = await generateSpecs(app, openApiSpecsOptions)
const specsOutputPath = path.resolve(
  import.meta.dirname,
  "../src/generated/openapi.json",
)
const typesOutputPath = path.resolve(
  import.meta.dirname,
  "../src/generated/openapi.ts",
)

await fs.writeFile(specsOutputPath, JSON.stringify(specs, null, 2))
await $`bun x openapi-typescript ${specsOutputPath} --root-types --root-types-no-schema-prefix --output ${typesOutputPath}`

await $`bun x biome check --write ${specsOutputPath} ${typesOutputPath}`

console.log()
console.log("=== OpenAPI Generation Complete ===")
console.log(`OpenAPI specs written to: ${specsOutputPath}`)
console.log(`OpenAPI types written to: ${typesOutputPath}`)

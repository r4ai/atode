import type { MswParameters } from "msw-storybook-addon"
import "@storybook/types"

declare module "@storybook/types" {
  /** MSW addon 用 parameters。handlers は型安全！ */
  interface Parameters {
    msw?: MswParameters
  }
}

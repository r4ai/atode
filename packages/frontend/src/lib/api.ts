import { useQueryClient } from "@tanstack/react-query"
import type { paths } from "backend/openapi"
import createFetchClient from "openapi-fetch"
import createClient from "openapi-react-query"

const fetchClient = createFetchClient<paths>({
  baseUrl: "https://myapi.dev/v1/",
})

/**
 * API client for interacting with the backend.
 * This client is generated from the OpenAPI schema and provides type-safe methods
 * for making requests to the API endpoints.
 *
 * @see https://openapi-ts.dev/openapi-react-query/
 *
 * @example
 * import { ErrorBoundary } from "react-error-boundary"
 * import { api } from "@/lib/api"
 *
 * const MyComponent = () => {
 *   const { data } = api.useSuspenseQuery("get", "/users/{user_id}", {
 *     params: {
 *       path: { user_id: 5 },
 *     },
 *   })
 *
 *   return <div>{data.firstname}</div>
 * }
 *
 * export const App = () => {
 *   return (
 *     <ErrorBoundary fallbackRender={({ error }) => `Error: ${error.message}`}>
 *       <MyComponent />
 *     </ErrorBoundary>
 *   )
 * }
 */
export const api = {
  ...createClient(fetchClient),
  useQueryClient,
}

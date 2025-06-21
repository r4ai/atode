import { createFileRoute } from "@tanstack/react-router"

const App = () => {
  return <div>Hello, world!</div>
}

export const Route = createFileRoute("/")({
  component: App,
})

import type { Preview } from "@storybook/react-vite"
import "../src/globals.css"

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
  },
  decorators: [
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

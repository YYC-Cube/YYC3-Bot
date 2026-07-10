import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/__tests__/**/*.{test,spec}.{ts,tsx}", "**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "packages/*/node_modules", "packages/i18n/**"],
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@yyc3/core": path.resolve(__dirname, "packages/core/src"),
      "@yyc3/ui": path.resolve(__dirname, "packages/ui/src"),
      "@yyc3/hooks": path.resolve(__dirname, "packages/hooks/src"),
      "@yyc3/ai": path.resolve(__dirname, "packages/ai/src"),
    },
  },
})

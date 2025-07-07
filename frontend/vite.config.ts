// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";

export default defineConfig(({ mode }) => ({
  server: {
    host: "localhost",
    port: 5173,
  },
  plugins: [
    react(),
    // mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
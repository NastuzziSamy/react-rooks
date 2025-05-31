import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-rooks": fileURLToPath(new URL("../index.tsx", import.meta.url)),
      "react-rooks/zod": fileURLToPath(
        new URL("../index-zod.tsx", import.meta.url)
      ),
    },
  },
  optimizeDeps: {
    exclude: ["react-rooks", "react-rooks/zod"],
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-rooks": path.resolve(__dirname, "../index.tsx"),
    },
  },
  optimizeDeps: {
    exclude: ["react-rooks"],
  },
});

import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // "@/..." = src/..., the shadcn-style import path used by components/ui.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) }
  },
  server: {
    port: 5173,
    strictPort: false,
    // The Mnemora archive API (dhruv-rag/api.py, `uvicorn api:app --port 8000`).
    proxy: {
      "/api/archive": { target: "http://127.0.0.1:8000", changeOrigin: true, rewrite: (path) => path.replace(/^\/api\/archive/, "") }
    }
  },
  build: {
    target: "es2020",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/gsap") || id.includes("@gsap")) return "gsap";
          if (id.includes("node_modules/react")) return "react";
          return undefined;
        }
      }
    }
  }
});

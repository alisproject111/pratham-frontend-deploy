import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      port: 3000,
      open: true,
      host: true, // Expose to local network
      proxy: {
        "/api": {
          target: env.VITE_API_URL || "https://tripeasy-server.vercel.app",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, "/api"),
        },
      },
    },
  }
})

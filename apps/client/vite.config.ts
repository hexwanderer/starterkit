import { sentryVitePlugin } from "@sentry/vite-plugin";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: "react",
      enableRouteGeneration: true,
    }),
    react(),
    tailwindcss(),
    sentryVitePlugin({
      org: "winston-p",
      project: "starterkit",
    }),
  ],

  envDir: "../..",

  server: {
    port: 3001,
    proxy: {
      "/api": {
        target: "http://localhost:7506",
        changeOrigin: true,
        secure: false,
      },
    },
  },

  optimizeDeps: {
    exclude: ["react-hook-form"],
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  build: {
    sourcemap: true,
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  // moduleResolution: "bundler",
  base: "/static/",              // must match Django's STATIC_URL
  build: {
    manifest: "manifest.json",   // django-vite reads this
    outDir: resolve(__dirname, "../static/dist"),  // compile into Django's static dir
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/main.tsx"),  // explicitly declare entrypoint
      },
    },
  },
  server: {
    host: true,
    port: 5173,
  },
}));

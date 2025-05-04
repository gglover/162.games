import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url));

import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    tailwindcss(),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    handlebars({
      partialDirectory: resolve(__dirname, "src", "partials"),
    }),
  ],
  rollupOptions: {
    input: {
      main: resolve(__dirname, "index.html"),
      about: resolve(__dirname, "about.html"),
      teams: resolve(__dirname, "teams.html"),
    },
  },
});

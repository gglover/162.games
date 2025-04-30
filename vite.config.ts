import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import handlebars from "vite-plugin-handlebars";

const __dirname = dirname(fileURLToPath(import.meta.url));

import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    tailwindcss(),
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

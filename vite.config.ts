import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [
    tailwindcss(),
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
  ],
});

// @ts-check
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  build: {
    format: "file",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), alpinejs({ entrypoint: "/src/entrypoint" })],
  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true,
  },
  trailingSlash: "never",
  adapter: vercel(),
});

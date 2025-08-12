// @ts-check
import alpinejs from "@astrojs/alpinejs";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

// https://astro.build/config
export default defineConfig({
  build: {
    format: "file",
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [alpinejs({ entrypoint: "/src/alpine" })],
  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true,
  },
  trailingSlash: "never",
  adapter: vercel(),
});

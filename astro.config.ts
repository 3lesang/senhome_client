// @ts-check
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AstroPWA from "@vite-pwa/astro";
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel";

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  build: {
    format: "file",
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react(), AstroPWA(), sitemap()],

  prefetch: {
    defaultStrategy: "hover",
    prefetchAll: true,
  },

  trailingSlash: "never",

  i18n: {
    locales: ["en", "vi"],
    defaultLocale: "en",
    routing: {
      prefixDefaultLocale: false,
    },
  },

  adapter: vercel(),
});

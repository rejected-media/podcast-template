import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import cloudflare from '@astrojs/cloudflare';
// Uncomment below for Node.js deployment instead of Cloudflare:
// import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  site: 'https://my-podcast.com', // Update with your actual domain
  output: 'server', // Server-side rendering for dynamic API routes

  // Cloudflare Pages adapter (recommended)
  adapter: cloudflare({
    platformProxy: {
      enabled: true // Enable for local dev with Cloudflare bindings
    },
    imageService: 'compile' // Process images at build time, not runtime
  }),


  // Alternative: Node.js adapter (uncomment to use instead of Cloudflare)
  // adapter: node({
  //   mode: 'standalone'
  // }),

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@config': fileURLToPath(new URL('./podcast.config.js', import.meta.url))
      }
    }
  }
});

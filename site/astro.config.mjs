import process from 'node:process';
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// Deploy-Domain: EINMAL hier setzen (og:image/canonical/sitemap leiten sich davon ab).
const site = process.env.SITE_URL || 'https://fck-afd.example';

// https://astro.build/config
export default defineConfig({
  site,
  // 'ignore': Site-Links + Sitemap nutzen Trailing-Slashes (/kapitel/) — 'never' würde alle Unterseiten 404n.
  trailingSlash: 'ignore',
  integrations: [svelte()],
});
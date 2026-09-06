import process from 'node:process';
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// Deploy-Domain: EINMAL hier setzen (og:image/canonical/sitemap leiten sich davon ab).
// GitHub Pages (Projekt-Repo) serviert unter /fck_afd/ — base zieht alle Assets/Links nach.
const site = process.env.SITE_URL || 'https://nickn0w4k.github.io/fck_afd/';
const base = process.env.SITE_BASE || '/fck_afd';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  // 'ignore': Site-Links + Sitemap nutzen Trailing-Slashes (/kapitel/) — 'never' würde alle Unterseiten 404n.
  trailingSlash: 'ignore',
  integrations: [svelte()],
  // LAN-Erreichbarkeit (192.168.178.133) — sonst lauscht der Server nur auf localhost
  server: { host: true, port: 4321 },
  preview: { host: true, port: 4173 },
});
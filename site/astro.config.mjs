import process from 'node:process';
import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

// Deploy-Domain: EINMAL hier setzen (og:image/canonical/sitemap leiten sich davon ab).
// Eigene Domain info-afd.de (CNAME in site/public/) — Pages serviert vom Branch-Root,
// daher KEIN base mehr; SITE_BASE nur für lokale Subpfad-Tests nötig.
const site = process.env.SITE_URL || 'https://info-afd.de/';
const base = process.env.SITE_BASE || '/';

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
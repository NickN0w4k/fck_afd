import type { APIRoute } from 'astro';
import chapters from '../../../content/chapters.json';

const site = import.meta.env.SITE ?? 'https://fck-afd.example';
const chaptersAny = chapters as any[];

/** Statische XML-Sitemap: Startseite + Kapitel-Unterseiten + Quellen. */
export const GET: APIRoute = () => {
  const paths = ['/', ...chaptersAny.map((c) => `/${c.id}/`), '/quellen/'];
  const urls = paths
    .map((p) => `  <url><loc>${new URL(p, site).href}</loc><changefreq>monthly</changefreq></url>`)
    .join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
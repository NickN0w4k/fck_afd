import type { APIRoute } from 'astro';

const site = import.meta.env.SITE ?? 'https://nickn0w4k.github.io/fck_afd/';
const base = import.meta.env.BASE_URL ?? '/';
const baseNorm = base.endsWith('/') ? base : `${base}/`;

export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL(`${baseNorm}sitemap.xml`, site).href}
`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
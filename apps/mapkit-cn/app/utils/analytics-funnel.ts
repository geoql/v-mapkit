import type { OutboundTarget } from '~/types/analytics';

/** Which funnel outbound target a link points at, or `null` for any other link. */
export function outboundTarget(href: string): OutboundTarget | null {
  let host: string;
  try {
    host = new URL(href).hostname;
  } catch {
    return null;
  }
  if (host === 'github.com' || host.endsWith('.github.com')) return 'github';
  if (host === 'npmjs.com' || host.endsWith('.npmjs.com')) return 'npm';
  if (host === 'v-mapkit.geoql.in') return 'docs';
  if (host === 'apple.com' || host.endsWith('.apple.com')) return 'apple';
  return null;
}

/** The example slug of an `/examples/<slug>` path, or `null` for any other page. */
export function exampleSlug(path: string): string | null {
  const [section, slug, ...rest] = path.split('/').filter(Boolean);
  if (section !== 'examples' || !slug || rest.length > 0) return null;
  return slug;
}

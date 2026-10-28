import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { useAnalytics } from '../../app/composables/use-analytics';
import { exampleSlug, outboundTarget } from '../../app/utils/analytics-funnel';

function stubNuxtApp(handles: Record<string, unknown>) {
  vi.stubGlobal('useNuxtApp', () => handles);
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useAnalytics', () => {
  it('sends one track() call to GA4, Plausible and OpenPanel', () => {
    const gtag = vi.fn();
    const plausible = vi.fn();
    const openpanelTrack = vi.fn();
    stubNuxtApp({
      $ga: { gtag },
      $plausible: { plausible },
      $openpanel: { track: openpanelTrack },
    });

    const props = {
      packageManager: 'pnpm',
      kind: 'registry',
      registry: 'v-map',
      page: '/examples/basic-map',
    } as const;
    useAnalytics().track('install_command_copied', props);

    expect(gtag).toHaveBeenCalledExactlyOnceWith(
      'event',
      'install_command_copied',
      props,
    );
    expect(plausible).toHaveBeenCalledExactlyOnceWith(
      'install_command_copied',
      { props },
    );
    expect(openpanelTrack).toHaveBeenCalledExactlyOnceWith(
      'install_command_copied',
      props,
    );
  });

  it('skips trackers that are off', () => {
    const openpanelTrack = vi.fn();
    stubNuxtApp({
      $ga: null,
      $plausible: null,
      $openpanel: { track: openpanelTrack },
    });

    useAnalytics().track('example_viewed', { slug: 'clustering' });

    expect(openpanelTrack).toHaveBeenCalledExactlyOnceWith('example_viewed', {
      slug: 'clustering',
    });
  });
});

describe('analytics funnel helpers', () => {
  it('classifies GitHub, npm, docs and Apple links', () => {
    expect(outboundTarget('https://github.com/geoql/v-mapkit')).toBe('github');
    expect(outboundTarget('https://www.npmjs.com/package/@geoql/v-mapkit')).toBe(
      'npm',
    );
    expect(outboundTarget('https://v-mapkit.geoql.in/guide')).toBe('docs');
    expect(outboundTarget('https://developer.apple.com/maps/')).toBe('apple');
    expect(outboundTarget('https://mapkit-cn.geoql.in/examples')).toBeNull();
    expect(outboundTarget('not a url')).toBeNull();
  });

  it('reads the example slug from example paths only', () => {
    expect(exampleSlug('/examples/clustering')).toBe('clustering');
    expect(exampleSlug('/examples/clustering/')).toBe('clustering');
    expect(exampleSlug('/examples')).toBeNull();
    expect(exampleSlug('/')).toBeNull();
    expect(exampleSlug('/examples/a/b')).toBeNull();
  });
});

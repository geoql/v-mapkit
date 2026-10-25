import { afterEach, describe, expect, it, vi } from 'vite-plus/test';
import { useAnalytics } from '../../app/composables/use-analytics';
import {
  componentPage,
  installCommand,
  outboundTarget,
} from '../../app/utils/analytics-funnel';

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
      packages: '@geoql/v-mapkit',
      page: '/guide/getting-started',
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
    const plausible = vi.fn();
    stubNuxtApp({ $ga: null, $plausible: { plausible }, $openpanel: null });

    useAnalytics().track('component_viewed', {
      section: 'components',
      slug: 'map',
    });

    expect(plausible).toHaveBeenCalledExactlyOnceWith('component_viewed', {
      props: { section: 'components', slug: 'map' },
    });
  });
});

describe('analytics funnel helpers', () => {
  it('classifies GitHub, npm and live-examples links', () => {
    expect(outboundTarget('https://github.com/geoql/v-mapkit')).toBe('github');
    expect(outboundTarget('https://www.npmjs.com/package/@geoql/v-mapkit')).toBe(
      'npm',
    );
    expect(outboundTarget('https://mapkit-cn.geoql.in/examples')).toBe(
      'examples',
    );
    expect(outboundTarget('https://v-mapkit.geoql.in/')).toBeNull();
    expect(outboundTarget('not a url')).toBeNull();
  });

  it('maps API docs paths to section + slug', () => {
    expect(componentPage('/components/map')).toEqual({
      section: 'components',
      slug: 'map',
    });
    expect(componentPage('/services/search/')).toEqual({
      section: 'services',
      slug: 'search',
    });
    expect(componentPage('/components')).toBeNull();
    expect(componentPage('/guide/getting-started')).toBeNull();
  });

  it('recognises install commands and nothing else', () => {
    expect(installCommand('pnpm add @geoql/v-mapkit\n')).toEqual({
      packageManager: 'pnpm',
      packages: '@geoql/v-mapkit',
    });
    expect(installCommand('npm install -D @types/apple-mapkit-js-browser')).toEqual(
      { packageManager: 'npm', packages: '@types/apple-mapkit-js-browser' },
    );
    expect(installCommand('bun add @geoql/v-mapkit')).toEqual({
      packageManager: 'bun',
      packages: '@geoql/v-mapkit',
    });
    expect(installCommand('<VMap :access-token="token" />')).toBeNull();
  });
});

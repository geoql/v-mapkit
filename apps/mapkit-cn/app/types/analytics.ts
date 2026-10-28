/**
 * Funnel events sent to every tracker (Plausible, OpenPanel, GA4).
 * A closed union: new events are added here first, never passed as free strings.
 */
export type AnalyticsEvent =
  | 'install_command_copied'
  | 'code_copied'
  | 'example_viewed'
  | 'outbound_click';

export type PackageManagerId = 'npm' | 'pnpm' | 'yarn' | 'bun';

/** `package` = the `@geoql/v-mapkit` install, `registry` = a shadcn-vue add. */
export type InstallKind = 'package' | 'registry';

/** `docs` is the v-mapkit API docs site (v-mapkit.geoql.in). */
export type OutboundTarget = 'github' | 'npm' | 'docs' | 'apple';

/** Props each event carries. `track()` takes the props of its event only. */
export interface AnalyticsEventProps {
  install_command_copied: {
    packageManager: PackageManagerId;
    kind: InstallKind;
    registry: string;
    page: string;
  };
  code_copied: { language: string; page: string };
  example_viewed: { slug: string };
  outbound_click: { target: OutboundTarget; href: string; location: string };
}

/** The `plausible.init()` options this site sets. */
export interface PlausibleInitOptions {
  autoCapturePageviews?: boolean;
  captureOnLocalhost?: boolean;
}

// Shape of the Plausible `pa-*.js` global: callable, plus the loader's
// bookkeeping — q (pre-load queue), o (init options the loader boots from), init.
export interface PlausibleFn {
  (...args: unknown[]): void;
  q: unknown[];
  o?: PlausibleInitOptions;
  init: (options: PlausibleInitOptions) => void;
}

/** GA4 handle provided as `$ga` by plugins/google-analytics.client.ts. */
export interface GtagHandle {
  gtag: (
    command: 'event',
    eventName: string,
    eventParams?: Record<string, unknown>,
  ) => void;
}

/** Plausible handle provided as `$plausible` by plugins/plausible.client.ts. */
export interface PlausibleHandle {
  plausible: (...args: unknown[]) => void;
}

/** The part of the OpenPanel client (`$openpanel`) that analytics uses. */
export interface OpenPanelHandle {
  track: (name: string, properties?: Record<string, unknown>) => unknown;
}

// Nuxt's inferred plugin injections do not reach `useNuxtApp()` here, so the
// tracker handles are declared the same way @openpanel/nuxt declares
// `$openpanel`.
declare module '#app' {
  interface NuxtApp {
    $ga: GtagHandle | null;
    $plausible: PlausibleHandle | null;
  }
}

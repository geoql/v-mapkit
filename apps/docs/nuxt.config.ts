export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/content',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/tailwindcss',
    'nuxt-og-image',
    // GA4 through useScriptGoogleAnalytics (app/plugins/google-analytics.client.ts).
    // Plausible loads from app/plugins/plausible.client.ts, not a module: the
    // pa-*.js tracker needs the official init snippet, which neither
    // @nuxtjs/plausible nor the @nuxt/scripts Plausible helper runs.
    '@nuxt/scripts',
    // OpenPanel product analytics (self-hosted at events.geoql.in). Client-side
    // only, so no client secret.
    '@openpanel/nuxt',
  ],

  devtools: { enabled: false },

  css: ['~/assets/css/main.css'],

  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [300, 400, 500, 600, 700] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500] },
    ],
  },

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'v-mapkit — Vue 3 components for Apple MapKit JS',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Vue 3 components for Apple MapKit JS — annotations, overlays, clustering, Look Around, and services.',
        },
        { name: 'theme-color', content: '#000000', media: '(prefers-color-scheme: dark)' },
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  site: {
    url: 'https://v-mapkit.geoql.in',
    name: 'v-mapkit',
  },

  openpanel: {
    // Public client ID of the v-mapkit.geoql.in project (NUXT_PUBLIC_OPENPANEL_CLIENT_ID).
    clientId:
      process.env.NUXT_PUBLIC_OPENPANEL_CLIENT_ID ??
      'e2670834-9143-4dca-bce9-37786f5d8e85',
    apiUrl: 'https://events.geoql.in/api',
    trackScreenViews: true,
    trackOutgoingLinks: true,
    trackAttributes: true,
    // A proxy handler hardcodes api.openpanel.dev and would bypass the
    // self-hosted apiUrl; direct client POST is correct here.
    proxy: false,
  },

  ogImage: {
    // Generate OG images at build time; skip per-request cache storage
    // during prerender to keep the Worker bundle small.
    runtimeCacheStorage: false,
    // Canonical OG size (1.91:1); overrides the module's 1200x600 default.
    defaults: {
      width: 1200,
      height: 630,
    },
  },

  runtimeConfig: {
    public: {
      baseUrl: process.env.NUXT_PUBLIC_BASE_URL || 'https://v-mapkit.geoql.in',
      // Public analytics IDs (they ship in the HTML, so they are not secrets).
      // Each is overridable with its NUXT_PUBLIC_* env. An empty gtagId skips
      // GA4 entirely: no GA4 property exists for this host yet.
      gtagId: '',
      plausibleScriptId: 'pa-cy6xbyHYien2bWm1sqKh0',
      plausibleApiHost: 'https://analytics.geoql.in',
    },
  },

  content: {
    build: {
      markdown: {
        highlight: {
          theme: {
            light: 'material-theme-lighter',
            default: 'material-theme',
            dark: 'material-theme-palenight',
          },
          langs: ['bash', 'json', 'js', 'ts', 'html', 'css', 'vue', 'shell', 'md', 'yaml'],
        },
      },
    },
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
  },

  compatibilityDate: '2026-10-24',

  nitro: {
    preset: 'cloudflare_module',
    cloudflare: {
      // deployConfig writes the merged Worker config to
      // .output/server/wrangler.json at build time. It is the only Worker
      // config: pnpm run deploy runs wrangler deploy --config on that file.
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: 'v-mapkit-docs',
        compatibility_date: '2026-10-24',
        compatibility_flags: ['nodejs_compat'],
        workers_dev: false,
        // Zone route for now: the geoql.in zone still holds the proxied CNAME
        // the old Pages project created, and a custom domain cannot attach while
        // it exists. Once that record is deleted, switch to
        // { pattern: 'v-mapkit.geoql.in', custom_domain: true }.
        routes: [{ pattern: 'v-mapkit.geoql.in/*', zone_name: 'geoql.in' }],
        observability: { enabled: true },
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'v-mapkit-docs-db',
            database_id: '91205837-d9d7-4c94-9076-d06a2651adb9',
          },
        ],
      },
    },
    rollupConfig: {
      output: {
        generatedCode: {
          constBindings: true,
        },
      },
    },
    replace: {
      'process.stdout': 'undefined',
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },

  postcss: {
    plugins: {},
  },
});

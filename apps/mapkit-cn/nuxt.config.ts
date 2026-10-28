import libraryPkg from '../../packages/v-mapkit/package.json' with { type: 'json' };

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/color-mode',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/fonts',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    'nuxt-og-image',
    '@nuxtjs/tailwindcss',
    // GA4 through useScriptGoogleAnalytics (app/plugins/google-analytics.client.ts).
    // Plausible loads from app/plugins/plausible.client.ts, not a module: the
    // pa-*.js tracker needs the official init snippet, which neither
    // @nuxtjs/plausible nor the @nuxt/scripts Plausible helper runs.
    '@nuxt/scripts',
    // OpenPanel product analytics (self-hosted at events.geoql.in). Client-side
    // only, so no client secret.
    '@openpanel/nuxt',
  ],

  openpanel: {
    // Public client ID of the mapkit-cn.geoql.in project (NUXT_PUBLIC_OPENPANEL_CLIENT_ID).
    clientId:
      process.env.NUXT_PUBLIC_OPENPANEL_CLIENT_ID ??
      '789cf47e-a3d7-4b3c-953a-a682e9a6eda7',
    apiUrl: 'https://events.geoql.in/api',
    trackScreenViews: true,
    trackOutgoingLinks: true,
    trackAttributes: true,
    // A proxy handler hardcodes api.openpanel.dev and would bypass the
    // self-hosted apiUrl; direct client POST is correct here.
    proxy: false,
  },

  devtools: { enabled: true },

  fonts: {
    families: [
      { name: 'Geist', provider: 'google', weights: [300, 400, 500, 700, 800] },
      { name: 'Geist Mono', provider: 'google', weights: [400, 500, 700] },
    ],
    defaults: {
      weights: [400, 700],
      styles: ['normal'],
      subsets: ['latin'],
    },
    experimental: {
      processCSSVariables: false,
    },
  },

  site: {
    name: 'mapkit-cn',
    description: 'Beautiful Apple MapKit components for Vue',
    url: 'https://mapkit-cn.geoql.in',
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'mapkit-cn - Beautiful Apple Maps for Vue',
      meta: [
        {
          name: 'description',
          content:
            'Beautiful Apple MapKit components for Vue. Built on v-mapkit, styled with Tailwind CSS, works with shadcn-vue.',
        },
        { name: 'theme-color', content: '#000000' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },

  css: [
    '@geoql/v-mapkit/style.css',
    '~/assets/css/main.css',
  ],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'dark',
  },

  runtimeConfig: {
    public: {
      mapkitToken: '',
      // Public analytics IDs (they ship in the HTML, so they are not secrets).
      // Each is overridable with its NUXT_PUBLIC_* env. An empty gtagId skips GA4.
      gtagId: '',
      plausibleScriptId: 'pa-5HsI0uYlxXCDS_5-ikuLA',
      plausibleApiHost: 'https://analytics.geoql.in',
      library: {
        version: libraryPkg.version,
      },
    },
  },

  compatibilityDate: '2026-05-26',

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
        name: 'mapkit-cn',
        compatibility_date: '2026-05-26',
        compatibility_flags: ['nodejs_compat'],
      },
    },
  },

  ogImage: {
    // Generate all OG images at build time; skip per-request cache storage
    // during prerender to reduce the Cloudflare Pages worker bundle.
    runtimeCacheStorage: false,
    // Canonical OG size (1.91:1); overrides the module's 1200x600 default.
    defaults: {
      width: 1200,
      height: 630,
    },
  },

  vite: {
    optimizeDeps: {
      exclude: ['@geoql/v-mapkit'],
      include: [
        'class-variance-authority',
        'clsx',
        'reka-ui',
        'tailwind-merge',
      ],
    },
  },

  postcss: {
    plugins: {},
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui',
  },
});

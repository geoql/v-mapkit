import type { GtagHandle } from '~/types/analytics';
import { isAutomationBrowser } from '~/utils/automation-browser';

/**
 * GA4 via @nuxt/scripts. Provides `$ga` (null when GA4 is off). GA4 stays off
 * while `runtimeConfig.public.gtagId` is empty (NUXT_PUBLIC_GTAG_ID).
 */
export default defineNuxtPlugin(() => {
  const gtagId = useRuntimeConfig().public.gtagId;
  let ga: GtagHandle | null = null;

  if (gtagId && !isAutomationBrowser()) {
    const { proxy } = useScriptGoogleAnalytics({ id: gtagId });
    ga = {
      gtag: (command, eventName, eventParams) => {
        proxy.gtag(command, eventName, eventParams);
      },
    };
  }

  return { provide: { ga } };
});

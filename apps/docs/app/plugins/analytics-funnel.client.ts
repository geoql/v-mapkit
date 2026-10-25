import { componentPage, outboundTarget } from '~/utils/analytics-funnel';

/**
 * Site-wide funnel events:
 * - `component_viewed` after each render of a components/services page
 * - `outbound_click` for every link to GitHub, npm or the live examples site
 *
 * Copy events come from ProsePre, which owns the copy button.
 */
// The explicit `void` return keeps this plugin out of NuxtApp's injection
// inference: without it, `useAnalytics()` reading `$ga` here makes the
// inferred `$ga` type depend on itself and collapse to `{}`.
export default defineNuxtPlugin((nuxtApp): void => {
  const router = useRouter();
  const { track } = useAnalytics();
  const currentPath = () => router.currentRoute.value.path;

  nuxtApp.hook('page:finish', () => {
    const page = componentPage(currentPath());
    if (page) track('component_viewed', page);
  });

  document.addEventListener(
    'click',
    (event) => {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (!link) return;
      const target = outboundTarget(link.href);
      if (!target) return;
      track('outbound_click', {
        target,
        href: link.href,
        location: currentPath(),
      });
    },
    { capture: true },
  );
});

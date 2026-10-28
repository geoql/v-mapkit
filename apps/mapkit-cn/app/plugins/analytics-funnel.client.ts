import { exampleSlug, outboundTarget } from '~/utils/analytics-funnel';

/**
 * Site-wide funnel events:
 * - `example_viewed` after each render of an `/examples/<slug>` page
 * - `outbound_click` for every link to GitHub, npm, the API docs or Apple
 *
 * Copy events come from the components that own the copy buttons
 * (CodeBlock, CodePanel, PackageManagerTabs).
 */
// The explicit `void` return keeps this plugin out of NuxtApp's injection
// inference: without it, `useAnalytics()` reading `$ga` here makes the
// inferred `$ga` type depend on itself and collapse to `{}`.
export default defineNuxtPlugin((nuxtApp): void => {
  const router = useRouter();
  const { track } = useAnalytics();
  const currentPath = () => router.currentRoute.value.path;

  nuxtApp.hook('page:finish', () => {
    const slug = exampleSlug(currentPath());
    if (slug) track('example_viewed', { slug });
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

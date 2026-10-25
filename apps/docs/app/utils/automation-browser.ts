/**
 * Automation-browser detection for analytics gating.
 *
 * Every automation harness (Playwright, Selenium, Puppeteer, CDP-driven
 * agents) sets `navigator.webdriver`. Bot sessions pollute the funnel data,
 * and real users never set it.
 *
 * Callers that feed `useHead()` must gate the `useHead` call itself: this
 * helper is always `false` during SSR.
 */
export function isAutomationBrowser(): boolean {
  if (!import.meta.client) return false;
  return navigator.webdriver === true;
}

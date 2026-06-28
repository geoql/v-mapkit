/**
 * Shared MapKit JS token state.
 *
 * Resolution order:
 *   1. localStorage override (`mapkit-cn:token`) — set by the user via the UI
 *   2. runtime config `public.mapkitToken` — build-time default
 *
 * The localStorage hydration happens once in `plugins/mapkit-token.client.ts`.
 * This composable just reads/writes the shared `useState` value.
 */
export const MAPKIT_TOKEN_STORAGE_KEY = 'mapkit-cn:token';

/**
 * Decode a base64url-encoded JWT segment (no padding) to its JSON string.
 */
function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  return atob(base64 + padding);
}

/**
 * Structural validation for an Apple MapKit JS JWT token.
 *
 * We cannot verify the signature in the browser without Apple's public key,
 * but we can reject obvious garbage by checking the JWT envelope:
 * - three base64url parts separated by '.'
 * - decodable header with typ: 'JWT' and a signing alg
 * - decodable payload with iss, iat and exp claims
 */
export function isValidMapKitToken(value: string): boolean {
  const token = value.trim();
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [headerPart, payloadPart, signaturePart] = parts;
  if (!headerPart || !payloadPart || !signaturePart) return false;

  try {
    const header = JSON.parse(base64UrlDecode(headerPart)) as unknown;
    const payload = JSON.parse(base64UrlDecode(payloadPart)) as unknown;

    if (!header || typeof header !== 'object') return false;
    if ((header as Record<string, unknown>).typ !== 'JWT') return false;
    if (typeof (header as Record<string, unknown>).alg !== 'string') return false;

    if (!payload || typeof payload !== 'object') return false;
    if (typeof (payload as Record<string, unknown>).iss !== 'string') return false;
    if (typeof (payload as Record<string, unknown>).iat !== 'number') return false;
    if (typeof (payload as Record<string, unknown>).exp !== 'number') return false;

    return true;
  } catch {
    return false;
  }
}

export function useMapkitToken() {
  const config = useRuntimeConfig();
  const fallback = (config.public.mapkitToken as string) || '';

  const token = useState<string>('mapkit-token', () => fallback);

  function setToken(value: string): void {
    const next = value.trim();
    token.value = next;

    if (import.meta.client) {
      if (next) {
        localStorage.setItem(MAPKIT_TOKEN_STORAGE_KEY, next);
      } else {
        localStorage.removeItem(MAPKIT_TOKEN_STORAGE_KEY);
      }
    }
  }

  function clearToken(): void {
    setToken('');
  }

  const hasToken = computed(() => isValidMapKitToken(token.value));

  return { token, hasToken, setToken, clearToken };
}

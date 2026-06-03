// Health check utility that polls the configured API base URL's /healthz endpoint.
const LOADER_DELAY_MS = 1000;
const POLL_INTERVAL_MS = 2000;
const COOKIE_NAME = 'server_ok';
const COOKIE_EXPIRATION_MINS = 15;
const REQUEST_TIMEOUT_MS = 5000; // per-request timeout

function setCookie(name, value, minutes) {
  const d = new Date();
  d.setTime(d.getTime() + (minutes * 60 * 1000));
  const expires = 'expires=' + d.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function buildHealthUrl() {
  // Prefer explicit VITE_API_BASE_URL if set by Vite; otherwise use same-origin
  const apiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : '';

  try {
    if (apiBase) return new URL('/healthz', apiBase).toString();
  } catch (e) {
    // fall back to origin
  }

  // In dev, Vite proxies /api to the backend, so prefer the proxied path.
  return `${window.location.origin}/api/healthz`;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, credentials: 'include' });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function checkServerStatus(setIsLoadingServer) {
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');
  const healthUrl = buildHealthUrl();

  // If cookie indicates a recent successful check, consider server awake
  if (getCookie(COOKIE_NAME) === 'true') {
    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'block';
    setIsLoadingServer(false);
    return;
  }

  setIsLoadingServer(true);

  // initial UX delay before polling
  setTimeout(() => pollServer(), LOADER_DELAY_MS);

  async function pollServer() {
    try {
      const response = await fetchWithTimeout(healthUrl, REQUEST_TIMEOUT_MS);
      if (response && response.ok) {
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => { loader.style.display = 'none'; }, 500);
        }
        if (content) content.style.display = 'block';
        setCookie(COOKIE_NAME, 'true', COOKIE_EXPIRATION_MINS);
        setIsLoadingServer(false);
        return;
      }
      // non-OK response -> keep polling
      setIsLoadingServer(true);
      setTimeout(pollServer, POLL_INTERVAL_MS);
    } catch (err) {
      // network error, timeout, or aborted -> keep polling
      setIsLoadingServer(true);
      setTimeout(pollServer, POLL_INTERVAL_MS);
    }
  }
}

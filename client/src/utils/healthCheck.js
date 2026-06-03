// Health check utility that polls the configured API base URL's /internal-check endpoint.
const LOADER_DELAY_MS = 1000;
const POLL_INTERVAL_MS = 2000;
const LOADER_ESTIMATE_SECONDS = 60;
const COOKIE_NAME = 'server_ok';
const COOKIE_LAST_CHECK_NAME = 'server_ok_at';
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

function getCookieNumber(name) {
  const value = getCookie(name);
  if (value === null) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildHealthUrl() {
  // Prefer explicit VITE_API_BASE_URL if set by Vite; otherwise use same-origin
  const apiBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL)
    ? import.meta.env.VITE_API_BASE_URL
    : '';

  try {
    if (apiBase) return new URL('/internal-check', apiBase).toString();
  } catch (e) {
    // fall back to origin
  }

  return `${window.location.origin}/internal-check`;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export async function checkServerStatus(setIsLoadingServer) {
  const loader = document.getElementById('loader');
  const loaderMessage = document.getElementById('loader-message');
  const loaderTimer = document.getElementById('loader-timer');
  const content = document.getElementById('content');
  const healthUrl = buildHealthUrl();
  const startedAt = Date.now();
  const lastSuccessfulCheckAt = getCookieNumber(COOKIE_LAST_CHECK_NAME);
  let countdownTimerId = null;
  let loaderRevealTimerId = null;

  const updateLoaderCopy = () => {
    if (!loaderMessage || !loaderTimer) return;

    const elapsedSeconds = Math.floor((Date.now() - startedAt) / 1000);
    const remainingSeconds = Math.max(0, LOADER_ESTIMATE_SECONDS - elapsedSeconds);

    loaderMessage.textContent = remainingSeconds > 0
      ? 'Waking up the backend now.'
      : 'Still waking up. This can take a bit longer on cold starts.';
    loaderTimer.textContent = remainingSeconds > 0
      ? `Please wait about ${remainingSeconds}s more.`
      : 'Waiting for the server to respond...';
  };

  const stopLoaderTimer = () => {
    if (countdownTimerId) {
      clearInterval(countdownTimerId);
      countdownTimerId = null;
    }
  };

  const showLoader = () => {
    if (loader) {
      loader.style.opacity = '1';
      loader.style.display = 'flex';
    }
    updateLoaderCopy();
    if (!countdownTimerId) {
      countdownTimerId = setInterval(updateLoaderCopy, 1000);
    }
  };

  const hideLoader = () => {
    stopLoaderTimer();
    if (loader) {
      loader.style.opacity = '0';
      setTimeout(() => { loader.style.display = 'none'; }, 500);
    }
  };

  const isWithinCacheWindow = lastSuccessfulCheckAt !== null
    && (Date.now() - lastSuccessfulCheckAt) < (COOKIE_EXPIRATION_MINS * 60 * 1000);

  // If the last successful check was within the cache window, skip the loading screen entirely.
  if (isWithinCacheWindow || getCookie(COOKIE_NAME) === 'true') {
    hideLoader();
    if (content) content.style.display = 'block';
    setIsLoadingServer(false);
    return;
  }

  setIsLoadingServer(true);

  loaderRevealTimerId = setTimeout(() => {
    showLoader();
  }, LOADER_DELAY_MS);

  // start polling immediately, but only reveal the loading screen after the short delay
  pollServer();

  async function pollServer() {
    try {
      const response = await fetchWithTimeout(healthUrl, REQUEST_TIMEOUT_MS);
      if (response && response.ok) {
        if (loaderRevealTimerId) {
          clearTimeout(loaderRevealTimerId);
          loaderRevealTimerId = null;
        }
        hideLoader();
        if (content) content.style.display = 'block';
        setCookie(COOKIE_NAME, 'true', COOKIE_EXPIRATION_MINS);
        setCookie(COOKIE_LAST_CHECK_NAME, String(Date.now()), COOKIE_EXPIRATION_MINS);
        setIsLoadingServer(false);
        return;
      }
      // non-OK response -> keep polling
      if (loader) updateLoaderCopy();
      setIsLoadingServer(true);
      setTimeout(pollServer, POLL_INTERVAL_MS);
    } catch (err) {
      // network error, timeout, or aborted -> keep polling
      if (loader) updateLoaderCopy();
      setIsLoadingServer(true);
      setTimeout(pollServer, POLL_INTERVAL_MS);
    }
  }
}

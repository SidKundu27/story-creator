const LOADER_DELAY_MS = 1000;
const POLL_INTERVAL_MS = 2000;
const COOKIE_NAME = 'server_ok';
const COOKIE_EXPIRATION_MINS = 15;

function setCookie(name, value, minutes) {
  const d = new Date();
  d.setTime(d.getTime() + (minutes * 60 * 1000));
  const expires = 'expires=' + d.toUTCString();
  document.cookie = name + '=' + value + ';' + expires + ';path=/';
}

function getCookie(name) {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export async function checkServerStatus(setIsLoadingServer) {
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');

  // Check cookie first
  if (getCookie(COOKIE_NAME) === 'true') {
    console.log('Server already checked and is awake (from cookie).');
    if (loader) loader.style.display = 'none';
    if (content) content.style.display = 'block';
    setIsLoadingServer(false);
    return;
  }

  // Initial delay for UX, then start polling
  setTimeout(async () => {
    await pollServer();
  }, LOADER_DELAY_MS);

  async function pollServer() {
    try {
      const response = await fetch('/healthz', { signal: AbortSignal.timeout(5000) }); // 5-second timeout
      if (response.ok) {
        console.log('Server is awake.');
        if (loader) {
          loader.style.opacity = '0';
          setTimeout(() => { loader.style.display = 'none'; }, 500);
        }
        if (content) content.style.display = 'block';
        setCookie(COOKIE_NAME, 'true', COOKIE_EXPIRATION_MINS);
        setIsLoadingServer(false);
      } else {
        console.log('Server not yet awake, retrying...');
        setIsLoadingServer(true);
        setTimeout(pollServer, POLL_INTERVAL_MS);
      }
    } catch (error) {
      console.log('Server is sleeping or unreachable, retrying...', error.message);
      setIsLoadingServer(true);
      setTimeout(pollServer, POLL_INTERVAL_MS);
    }
  }
}

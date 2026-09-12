// Vinext 1.0.0-beta.5 requests nested routes without the configured trailing
// slash, then mistakes the resulting 308 for a dynamic page and skips export.
// Only normalize this exact redirect during its authenticated local prerender.
// Keep route names unchanged so both moments/index.html and moments.rsc export.
const originalFetch = globalThis.fetch;

globalThis.fetch = async (input, init) => {
  const response = await originalFetch(input, init);
  if (
    process.env.VINEXT_PRERENDER !== '1' ||
    response.status !== 308 ||
    init?.redirect !== 'manual' ||
    !new Headers(init.headers).has('x-vinext-prerender-secret') ||
    !['GET', 'HEAD'].includes(init.method ?? 'GET')
  )
    return response;

  const url = new URL(input instanceof Request ? input.url : input);
  const location = response.headers.get('location');
  if (url.hostname !== '127.0.0.1' || !location) return response;
  const redirected = new URL(location, url);
  if (
    redirected.origin !== url.origin ||
    redirected.pathname !== `${url.pathname}/` ||
    redirected.search !== url.search ||
    redirected.hash !== url.hash
  )
    return response;

  await response.body?.cancel();
  return originalFetch(redirected, init);
};

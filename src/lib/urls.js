const DEFAULT_PROTOCOLS = Object.freeze(['https:', 'mailto:']);

export function safePublicUrl(value, allowedProtocols = DEFAULT_PROTOCOLS) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new TypeError('Unsupported public URL');
  }

  if (
    !allowedProtocols.includes(url.protocol) ||
    url.username ||
    url.password
  ) {
    throw new TypeError('Unsupported public URL');
  }

  return url.href;
}

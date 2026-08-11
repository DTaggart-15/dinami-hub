import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const checkedUrls = Object.freeze([
  'https://follower-count.vercel.app/',
  'https://dinami-portfolio.vercel.app/',
  'https://t.me/DinaStam',
  'https://x.com/0xDinami',
]);

async function request(url, method) {
  return fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(10_000),
    headers: { 'user-agent': 'dinami-hub-link-check/1.0' },
  });
}

export async function checkUrl(url) {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      let response = await request(url, 'HEAD');
      if (response.status === 403 || response.status === 405) response = await request(url, 'GET');

      if (response.status >= 200 && response.status < 400) {
        return { url, status: response.status, ok: true, warning: false };
      }
      if (response.status === 401 || response.status === 403) {
        return { url, status: response.status, ok: true, warning: true };
      }
      return { url, status: response.status, ok: false, warning: false };
    } catch (error) {
      lastError = error;
    }
  }

  return { url, status: 'network-error', ok: false, warning: false, error: lastError };
}

async function main() {
  const results = await Promise.all(checkedUrls.map(checkUrl));

  for (const result of results) {
    const level = result.ok ? (result.warning ? 'WARN' : 'OK') : 'FAIL';
    console.log(`${level} ${result.url} ${result.status}`);
  }

  if (results.some((result) => !result.ok)) process.exitCode = 1;
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isDirectRun) await main();

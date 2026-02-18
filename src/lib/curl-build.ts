export interface CurlBuildInput {
  url: string;
  method: string;
  headers: { name: string; value: string }[];
  payload: string | null;
}

export function buildCurl({ url, method, headers, payload }: CurlBuildInput): string {
  const parts: string[] = ['curl'];
  if (method !== 'GET') {
    parts.push('-X', method);
  }
  headers.forEach((h) => {
    parts.push('-H', `"${h.name}: ${h.value}"`);
  });
  if (payload) {
    let escapedPayload = payload;
    escapedPayload = escapedPayload.replace(/\\/g, '\\\\');
    escapedPayload = escapedPayload.replace(/"/g, '\\"');
    parts.push('-d', `"${escapedPayload}"`);
  }
  let finalUrl = url.trim();
  if (!/^https?:\/\//i.test(finalUrl)) {
    if (/^https?\/\//i.test(finalUrl)) {
      finalUrl = finalUrl.replace(/^https?\/\//i, (m) => m.replace('//', '://'));
    } else {
      finalUrl = 'https://' + finalUrl;
    }
  }
  parts.push(`"${finalUrl}"`);
  return parts.join(' ');
}

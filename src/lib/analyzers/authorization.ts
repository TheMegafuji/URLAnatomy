import { detectJwt } from './jwt';
import { detectBase64 } from './base64';

export interface AuthorizationResult {
  type: 'authorization';
  scheme: 'Basic' | 'Bearer' | 'Digest' | 'Other';
  credentials: string;
  decoded?: {
    username?: string;
    password?: string;
  };
  jwt?: ReturnType<typeof detectJwt>;
  base64?: ReturnType<typeof detectBase64>;
}

export function detectAuthorization(key: string, value: string): AuthorizationResult | null {
  if (key.toLowerCase() !== 'authorization') return null;
  const trimmed = value.trim();
  const parts = trimmed.split(/\s+/, 2);
  if (parts.length < 2) return null;
  const scheme = parts[0] as 'Basic' | 'Bearer' | 'Digest' | 'Other';
  const credentials = parts[1];

  if (scheme === 'Basic') {
    const b64 = detectBase64(credentials);
    if (b64 && b64.decoded) {
      const colonIdx = b64.decoded.indexOf(':');
      if (colonIdx !== -1) {
        return {
          type: 'authorization',
          scheme: 'Basic',
          credentials,
          decoded: {
            username: b64.decoded.slice(0, colonIdx),
            password: b64.decoded.slice(colonIdx + 1),
          },
          base64: b64,
        };
      }
      return {
        type: 'authorization',
        scheme: 'Basic',
        credentials,
        decoded: { username: b64.decoded },
        base64: b64,
      };
    }
    return {
      type: 'authorization',
      scheme: 'Basic',
      credentials,
    };
  }

  if (scheme === 'Bearer') {
    const jwt = detectJwt(credentials);
    return {
      type: 'authorization',
      scheme: 'Bearer',
      credentials,
      jwt,
    };
  }

  return {
    type: 'authorization',
    scheme: scheme === 'Digest' ? 'Digest' : 'Other',
    credentials,
  };
}

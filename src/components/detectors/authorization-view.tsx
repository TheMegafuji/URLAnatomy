'use client';

import type { AuthorizationResult } from '@/lib/analyzers';
import { JwtView } from './jwt-view';

export function AuthorizationView({ meta }: { meta: unknown }) {
  const auth = meta as AuthorizationResult;
  return (
    <div className="space-y-2 font-mono text-xs">
      <div>
        <span className="text-muted-foreground">Scheme:</span>{' '}
        <span className="text-foreground font-medium">{auth.scheme}</span>
      </div>
      {auth.scheme === 'Basic' && auth.decoded && (
        <div className="space-y-1.5 pt-1">
          {auth.decoded.username && (
            <div>
              <span className="text-muted-foreground">Username:</span>{' '}
              <span className="text-foreground">{auth.decoded.username}</span>
            </div>
          )}
          {auth.decoded.password && (
            <div>
              <span className="text-muted-foreground">Password:</span>{' '}
              <span className="text-foreground">{auth.decoded.password}</span>
            </div>
          )}
        </div>
      )}
      {auth.scheme === 'Bearer' && auth.jwt && (
        <div className="pt-1">
          <JwtView meta={auth.jwt} />
        </div>
      )}
      {auth.base64 && (
        <details className="group pt-1">
          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
            Base64 details
          </summary>
          <div className="mt-1.5">
            <div>
              <span className="text-muted-foreground">Decoded:</span>{' '}
              <span className="text-foreground break-all">{auth.base64.decoded}</span>
            </div>
          </div>
        </details>
      )}
    </div>
  );
}

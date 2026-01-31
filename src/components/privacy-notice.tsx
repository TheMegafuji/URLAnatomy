'use client';

import { Shield } from 'lucide-react';

export function PrivacyNotice() {
  return (
    <p className="inline-flex items-center justify-center gap-2 text-sm text-muted-foreground text-center">
      <Shield className="h-4 w-4 shrink-0 text-emerald-500" />
      <span>Everything runs in your browser. No data is sent to any server.</span>
    </p>
  );
}

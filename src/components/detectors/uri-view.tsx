'use client';

export function UriView({ decoded }: { decoded: string }) {
  return <code className="block break-all font-mono text-xs">{decoded}</code>;
}

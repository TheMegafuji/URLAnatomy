'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

const RESET_MS = 1500;

export function useCopyToClipboard(): { copy: (text: string) => void; copied: boolean } {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const copy = useCallback((text: string) => {
    if (!text) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    navigator.clipboard.writeText(text);
    setCopied(true);
    timeoutRef.current = setTimeout(() => setCopied(false), RESET_MS);
  }, []);

  return { copy, copied };
}

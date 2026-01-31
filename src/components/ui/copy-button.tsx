'use client';

import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';

interface CopyButtonProps {
  text: string;
  'aria-label': string;
}

export function CopyButton({ text, 'aria-label': ariaLabel }: CopyButtonProps) {
  const { copy, copied } = useCopyToClipboard();
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="h-8 w-8 shrink-0 p-0"
      onClick={() => copy(text)}
      aria-label={ariaLabel}
    >
      {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
    </Button>
  );
}

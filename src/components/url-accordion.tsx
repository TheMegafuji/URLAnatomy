'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { motion, AnimatePresence } from 'framer-motion';

export function UrlAccordion({ original, decoded }: { original: string; decoded: string }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="rounded-lg border-2 border-border bg-card overflow-visible">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors rounded-t-lg"
        aria-expanded={open}
      >
        {open ? (
          <ChevronDown className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0" />
        )}
        <span>Original & Decoded URL</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t-2 border-border"
          >
            <div className="grid gap-4 p-4 pt-3 sm:grid-cols-2">
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Original</span>
                  <CopyButton text={original} aria-label="Copy original URL" />
                </div>
                <pre className="overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs whitespace-pre-wrap break-all border border-border">
                  {original}
                </pre>
              </div>
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-medium text-muted-foreground">Decoded</span>
                  <CopyButton text={decoded} aria-label="Copy decoded URL" />
                </div>
                <pre className="overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs whitespace-pre-wrap break-all border border-border">
                  {decoded}
                </pre>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}

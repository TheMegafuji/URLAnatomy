'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export function Breadcrumbs({ segments }: { segments: string[] }) {
  if (segments.length === 0) return null;
  return (
    <nav
      aria-label="Path breadcrumbs"
      className="flex items-center gap-1 font-mono text-sm overflow-x-auto overflow-y-hidden py-1 -mx-1"
    >
      <span className="text-muted-foreground shrink-0">/</span>
      {segments.map((seg, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="inline-flex items-center gap-1 shrink-0"
        >
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
          <span className="rounded px-1.5 py-0.5 bg-muted/50 whitespace-nowrap">{seg}</span>
        </motion.span>
      ))}
    </nav>
  );
}

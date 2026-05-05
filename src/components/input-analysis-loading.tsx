'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export function InputAnalysisLoading({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-atomic="true"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="mt-3 flex items-center gap-2 rounded-lg border-2 border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground backdrop-blur-sm">
            <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" aria-hidden />
            <span>Analyzing input…</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ParamDetail } from '@/components/detectors/param-detail';
import type { AnalyzedParam } from '@/lib/analyzers';
import { motion, AnimatePresence } from 'framer-motion';

export function DetailSheet({
  param,
  open,
  onClose,
  onUseUrlAsInput,
  onUseJsonAsInput,
}: {
  param: AnalyzedParam | null;
  open: boolean;
  onClose: () => void;
  onUseUrlAsInput?: (url: string) => void;
  onUseJsonAsInput?: (json: string) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && param && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[85vh] overflow-hidden rounded-t-2xl border-t-2 border-border bg-card shadow-xl md:hidden"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-medium">Detail</h3>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="overflow-y-auto p-4 max-h-[calc(85vh-52px)]">
              <ParamDetail
                param={param}
                onUseUrlAsInput={
                  onUseUrlAsInput
                    ? (url) => {
                        onUseUrlAsInput(url);
                        onClose();
                      }
                    : undefined
                }
                onUseJsonAsInput={
                  onUseJsonAsInput
                    ? (json) => {
                        onUseJsonAsInput(json);
                        onClose();
                      }
                    : undefined
                }
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

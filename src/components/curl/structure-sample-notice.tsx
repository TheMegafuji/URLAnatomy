'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Info, Layers } from 'lucide-react';
import { Popover } from '@/components/ui/popover';

export const STRUCTURE_SAMPLE_INTRO_MS = 7500;

export function StructureSampleInfoContent({
  onViewFull,
  compact = false,
}: {
  onViewFull: () => void;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'space-y-1 text-xs' : 'space-y-1.5 text-xs'}>
      <p className="font-medium text-foreground">Structure sample</p>
      <p className="text-muted-foreground leading-relaxed">
        Repeated array items are collapsed to one example so the JSON shape stays readable without
        large bulk. Uncheck the control to load the complete JSON.
      </p>
      <button
        type="button"
        onClick={onViewFull}
        className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
      >
        View full JSON
      </button>
    </div>
  );
}

export function StructureSampleIntroNotice({
  visible,
  onViewFull,
}: {
  visible: boolean;
  onViewFull: () => void;
}) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-labelledby="structure-sample-notice-title"
          initial={{ opacity: 0, x: 12, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 10, scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          className="min-w-0 max-w-[min(100%,20rem)]"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(245, 158, 11, 0.28)',
                '0 0 0 4px rgba(245, 158, 11, 0)',
                '0 0 0 0 rgba(245, 158, 11, 0.28)',
              ],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-md border border-amber-500/45 bg-gradient-to-l from-amber-500/12 to-transparent px-2.5 py-1.5"
          >
            <div className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-amber-500/35 bg-amber-500/15 text-amber-600 dark:text-amber-400"
              >
                <Layers className="h-3 w-3" />
              </span>
              <div className="min-w-0 space-y-0.5">
                <p
                  id="structure-sample-notice-title"
                  className="text-[11px] font-semibold leading-snug text-amber-950 dark:text-amber-100"
                >
                  Reduced JSON shown
                </p>
                <p className="text-[10px] leading-snug text-amber-950/75 dark:text-amber-100/80">
                  Uncheck{' '}
                  <button
                    type="button"
                    onClick={onViewFull}
                    className="font-semibold underline underline-offset-2 hover:text-amber-900 dark:hover:text-amber-50"
                  >
                    Structure sample
                  </button>{' '}
                  for the full payload.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function StructureSampleArrowToControl({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="flex shrink-0 items-center self-center px-0.5 text-amber-500 dark:text-amber-400"
        >
          <motion.div
            animate={{ x: [0, -8, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 shrink-0 drop-shadow-sm" strokeWidth={2.5} />
            <span className="h-0.5 w-2 rounded-full bg-gradient-to-l from-transparent to-amber-500/80" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface StructureSampleControlBarProps {
  checkboxId: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onViewFull: () => void;
  showIntroNotice: boolean;
  highlightControl: boolean;
}

export function StructureSampleControlBar({
  checkboxId,
  checked,
  onCheckedChange,
  onViewFull,
  showIntroNotice,
  highlightControl,
}: StructureSampleControlBarProps) {
  const [labelHover, setLabelHover] = useState(false);
  const showHoverTooltip = labelHover && !showIntroNotice;

  return (
    <div className="flex flex-wrap items-center gap-1.5 w-full">
      <div className="relative flex shrink-0 items-center gap-1">
        <label
          htmlFor={checkboxId}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border-2 px-2.5 py-1.5 text-xs select-none transition-colors ${
            highlightControl
              ? 'border-amber-500/55 bg-amber-500/10 text-amber-950 dark:text-amber-100'
              : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted/30'
          }`}
          onMouseEnter={() => setLabelHover(true)}
          onMouseLeave={() => setLabelHover(false)}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <input
            id={checkboxId}
            type="checkbox"
            checked={checked}
            onChange={(e) => onCheckedChange(e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            aria-describedby={showIntroNotice ? 'structure-sample-notice-title' : undefined}
            className="h-3.5 w-3.5 rounded border border-border bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          />
          <span className="font-medium">Structure sample</span>
        </label>

        <Popover
          hover={false}
          trigger={
            <button
              type="button"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="About structure sample"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <Info className="h-3.5 w-3.5" />
            </button>
          }
          content={<StructureSampleInfoContent onViewFull={onViewFull} compact />}
        />

        <AnimatePresence>
          {showHoverTooltip && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full z-20 mt-1.5 w-[min(16rem,calc(100vw-2rem))] rounded-lg border-2 border-border bg-popover p-2.5 shadow-lg pointer-events-none"
            >
              <StructureSampleInfoContent onViewFull={onViewFull} compact />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex min-w-0 items-center gap-0.5">
        <StructureSampleArrowToControl visible={showIntroNotice} />
        <StructureSampleIntroNotice visible={showIntroNotice} onViewFull={onViewFull} />
      </div>
    </div>
  );
}

export function useStructureSampleIntroNotice(active: boolean, resetKey: string) {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (active) setShowIntro(true);
  }, [active, resetKey]);

  useEffect(() => {
    if (!active || !showIntro) return;
    const id = window.setTimeout(() => setShowIntro(false), STRUCTURE_SAMPLE_INTRO_MS);
    return () => clearTimeout(id);
  }, [active, showIntro, resetKey]);

  return { showIntro };
}

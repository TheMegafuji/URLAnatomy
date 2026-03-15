'use client';

import { format, parseISO } from 'date-fns';
import { CHANGELOG_ENTRIES, type ChangelogEntry } from '@/lib/changelog-data';
import { Calendar, Plus, RefreshCw, Wrench, Minus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_VISIBLE = 6;

function EntryCard({ entry, index }: { entry: ChangelogEntry; index: number }) {
  const dateLabel = format(parseISO(entry.date), 'MMMM d, yyyy');
  const hasContent =
    (entry.added?.length ?? 0) +
    (entry.changed?.length ?? 0) +
    (entry.fixed?.length ?? 0) +
    (entry.removed?.length ?? 0) >
    0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="rounded-lg border-2 border-border bg-card p-4 sm:p-5"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <div className="flex shrink-0 items-center gap-2 text-muted-foreground sm:w-40">
          <Calendar className="h-4 w-4 shrink-0" aria-hidden />
          <time dateTime={entry.date} className="text-sm font-medium">
            {dateLabel}
          </time>
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          {entry.added && entry.added.length > 0 && (
            <div>
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                <Plus className="h-3.5 w-3.5" aria-hidden />
                Added
              </h4>
              <ul className="space-y-1 text-sm text-foreground/90">
                {entry.added.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-500/60" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {entry.changed && entry.changed.length > 0 && (
            <div>
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
                <RefreshCw className="h-3.5 w-3.5" aria-hidden />
                Changed
              </h4>
              <ul className="space-y-1 text-sm text-foreground/90">
                {entry.changed.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-amber-500/60" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {entry.fixed && entry.fixed.length > 0 && (
            <div>
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                <Wrench className="h-3.5 w-3.5" aria-hidden />
                Fixed
              </h4>
              <ul className="space-y-1 text-sm text-foreground/90">
                {entry.fixed.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-500/60" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {entry.removed && entry.removed.length > 0 && (
            <div>
              <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <Minus className="h-3.5 w-3.5" aria-hidden />
                Removed
              </h4>
              <ul className="space-y-1 text-sm text-foreground/90">
                {entry.removed.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" aria-hidden />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {!hasContent && (
            <p className="text-sm text-muted-foreground">No detailed changes for this date.</p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export function ChangelogSection() {
  const [expanded, setExpanded] = useState(false);
  const visibleEntries = expanded ? CHANGELOG_ENTRIES : CHANGELOG_ENTRIES.slice(0, INITIAL_VISIBLE);
  const hasMore = CHANGELOG_ENTRIES.length > INITIAL_VISIBLE;

  return (
    <section
      className="max-w-3xl mx-auto pt-10 pb-6"
      aria-labelledby="changelog-heading"
    >
      <h2
        id="changelog-heading"
        className="text-sm font-medium text-muted-foreground mb-6 scroll-mt-4"
      >
        Changelog
      </h2>
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {visibleEntries.map((entry, index) => (
            <EntryCard key={entry.date} entry={entry} index={index} />
          ))}
        </AnimatePresence>
      </div>
      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="rounded-lg border-2 border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
            aria-expanded={expanded}
          >
            {expanded
              ? 'Show less'
              : `Show ${CHANGELOG_ENTRIES.length - INITIAL_VISIBLE} older entries`}
          </button>
        </div>
      )}
    </section>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

const LEAVE_DELAY_MS = 150;
const POPOVER_MAX_H = 280;

export function Popover({
  trigger,
  content,
  hover = true,
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
  hover?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: 'top' | 'bottom';
  } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const leaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLeaveTimeout = () => {
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
      leaveTimeout.current = null;
    }
  };

  const scheduleClose = () => {
    if (!hover) return;
    clearLeaveTimeout();
    leaveTimeout.current = setTimeout(() => setOpen(false), LEAVE_DELAY_MS);
  };

  const keepOpen = () => {
    if (!hover) return;
    clearLeaveTimeout();
    setOpen(true);
  };

  useEffect(() => {
    return () => clearLeaveTimeout();
  }, []);

  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const placement = spaceBelow >= POPOVER_MAX_H || spaceBelow >= spaceAbove ? 'bottom' : 'top';
    const gap = 8;
    const top = placement === 'bottom' ? rect.bottom + gap : rect.top - gap;
    setCoords({ top, left: rect.left, placement });
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target) || contentRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [open]);

  const popoverContent =
    open && coords && typeof document !== 'undefined' ? (
      <div
        ref={contentRef}
        className="fixed z-[100] min-w-[260px] max-w-[min(360px,90vw)] rounded-lg border-2 border-border bg-popover p-3 shadow-lg outline-none animate-in fade-in-0 zoom-in-95"
        style={{
          left: coords.left,
          ...(coords.placement === 'bottom'
            ? { top: coords.top }
            : { bottom: window.innerHeight - coords.top }),
        }}
        onMouseEnter={keepOpen}
        onMouseLeave={scheduleClose}
      >
        {content}
      </div>
    ) : null;

  return (
    <div
      ref={ref}
      className="relative inline-block"
      onMouseEnter={keepOpen}
      onMouseLeave={scheduleClose}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
        className="cursor-pointer outline-none"
      >
        {trigger}
      </div>
      {typeof document !== 'undefined' &&
        popoverContent &&
        createPortal(popoverContent, document.body)}
    </div>
  );
}

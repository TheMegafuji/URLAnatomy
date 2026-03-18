'use client';

import { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';

type Token = { text: string; className?: string };

function isJsonKeyword(s: string) {
  return s === 'true' || s === 'false' || s === 'null';
}

function numberClassName(raw: string) {
  const isFloat = raw.includes('.') || raw.includes('e') || raw.includes('E');
  return isFloat
    ? 'text-cyan-600 dark:text-cyan-400'
    : 'text-blue-600 dark:text-blue-400';
}

function tokenizeJsonLine(line: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const len = line.length;

  const push = (text: string, className?: string) => {
    if (!text) return;
    tokens.push({ text, className });
  };

  while (i < len) {
    const ch = line[i];

    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      let escaped = false;
      while (j < len) {
        const c = line[j];
        if (escaped) {
          escaped = false;
          j++;
          continue;
        }
        if (c === '\\') {
          escaped = true;
          j++;
          continue;
        }
        if (c === quote) {
          j++;
          break;
        }
        j++;
      }
      const str = line.slice(i, j);
      let k = j;
      while (k < len && /\s/.test(line[k])) k++;
      const isKey = k < len && line[k] === ':';
      push(
        str,
        isKey ? 'text-emerald-700 dark:text-emerald-400' : 'text-green-600 dark:text-green-400'
      );
      i = j;
      continue;
    }

    if (/[0-9]/.test(ch) || (ch === '-' && i + 1 < len && /[0-9]/.test(line[i + 1]))) {
      let j = i + 1;
      while (j < len && /[0-9eE.+-]/.test(line[j])) j++;
      const raw = line.slice(i, j);
      push(raw, numberClassName(raw));
      i = j;
      continue;
    }

    if (/[a-z]/.test(ch)) {
      let j = i + 1;
      while (j < len && /[a-z]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (isJsonKeyword(word)) {
        const className =
          word === 'null'
            ? 'text-zinc-500 dark:text-zinc-400'
            : 'text-purple-600 dark:text-purple-400';
        push(word, className);
      } else {
        push(word);
      }
      i = j;
      continue;
    }

    if (ch === '{' || ch === '}') {
      push(ch, 'text-yellow-600 dark:text-yellow-400');
      i++;
      continue;
    }
    if (ch === '[' || ch === ']') {
      push(ch, 'text-orange-600 dark:text-orange-400');
      i++;
      continue;
    }
    if (ch === ':' || ch === ',') {
      push(ch, 'text-muted-foreground');
      i++;
      continue;
    }

    let j = i + 1;
    while (j < len) {
      const c = line[j];
      if (
        c === '"' ||
        c === "'" ||
        c === '{' ||
        c === '}' ||
        c === '[' ||
        c === ']' ||
        c === ':' ||
        c === ',' ||
        /[0-9]/.test(c) ||
        (c === '-' && j + 1 < len && /[0-9]/.test(line[j + 1])) ||
        /[a-z]/.test(c)
      ) {
        break;
      }
      j++;
    }
    push(line.slice(i, j));
    i = j;
  }

  return tokens;
}

function JsonLine({ line }: { line: string }) {
  const tokens = useMemo(() => tokenizeJsonLine(line), [line]);
  return (
    <>
      {tokens.map((t, idx) => (
        <span key={idx} className={t.className} style={{ whiteSpace: 'pre' }}>
          {t.text}
        </span>
      ))}
    </>
  );
}

export function JsonFullscreenViewer({
  open,
  json,
  title = 'Formatted JSON',
  onClose,
}: {
  open: boolean;
  json: string;
  title?: string;
  onClose: () => void;
}) {
  const lines = useMemo(() => json.replace(/\r\n/g, '\n').split('\n'), [json]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="fixed inset-3 sm:inset-6 lg:inset-10 rounded-lg border bg-card shadow-xl overflow-hidden flex flex-col">
        <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{title}</div>
            <div className="text-xs text-muted-foreground truncate">
              {lines.length.toLocaleString('en-US')} lines
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="min-w-full font-mono text-xs sm:text-sm leading-5">
            {lines.map((line, idx) => (
              <div key={idx} className="grid grid-cols-[4.5rem_1fr]">
                <div className="select-none text-right pr-3 pl-2 py-0.5 text-muted-foreground bg-muted/30 border-r">
                  {idx + 1}
                </div>
                <div className="px-3 py-0.5 whitespace-pre">
                  <JsonLine line={line} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


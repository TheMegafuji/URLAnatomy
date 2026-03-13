'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Pencil, Dices, Copy, Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover } from '@/components/ui/popover';
import { DetailSheet } from '@/components/detail-sheet';
import { ParamDetail } from '@/components/detectors/param-detail';
import type { AnalyzedParam } from '@/lib/analyzers';
import { BADGE_LABEL } from '@/lib/param-labels';
import { generateValue, canGenerate } from '@/lib/generators';
import { Input } from '@/components/ui/input';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useIsMobile } from '@/hooks/useMediaQuery';

const MAX_VALUE_LEN = 48;
const MAX_VALUE_LEN_MOBILE = 999;

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + '…';
}

function ActionButton({
  onClick,
  label,
  title: titleProp,
  icon: Icon,
  disabled,
}: {
  onClick: () => void;
  label: string;
  title?: string;
  icon: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}) {
  const title = titleProp ?? label;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none"
      aria-label={label}
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function ParamTableRow({
  param,
  index,
  onOpenDetail,
  onReplaceParam,
  onRemoveParam,
  editingIndex,
  editValue,
  onStartEdit,
  onEditChange,
  onCommitEdit,
  onCancelEdit,
}: {
  param: AnalyzedParam;
  index: number;
  onOpenDetail: (param: AnalyzedParam) => void;
  onReplaceParam?: (index: number, newValue: string) => void;
  onRemoveParam?: (index: number) => void;
  editingIndex: number | null;
  editValue: string;
  onStartEdit: (index: number, value: string) => void;
  onEditChange: (value: string) => void;
  onCommitEdit: (index: number) => void;
  onCancelEdit: () => void;
}) {
  const isEditing = editingIndex === index;
  const isMobile = useIsMobile();
  const valueDisplay = truncate(
    param.decoded || param.value,
    isMobile ? MAX_VALUE_LEN_MOBILE : MAX_VALUE_LEN
  );
  const canGen = canGenerate(param.kind);

  const trigger = (
    <span
      className="font-mono text-xs break-all cursor-pointer inline-flex items-center gap-1 text-left param-value-block"
      title="Hover or click for detail"
    >
      {valueDisplay}
      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
    </span>
  );

  const detailContent = (
    <div className="text-left">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
        Translation / detail
      </p>
      <ParamDetail param={param} />
    </div>
  );

  const handleGenerate = useCallback(() => {
    if (!onReplaceParam) return;
    onReplaceParam(index, generateValue(param));
  }, [index, param, onReplaceParam]);

  const copyText = param.decoded || param.value;
  const { copy: copyValue, copied } = useCopyToClipboard();
  const handleCopyValue = useCallback(() => copyValue(copyText), [copyValue, copyText]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') onCommitEdit(index);
    if (e.key === 'Escape') onCancelEdit();
  };

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
    >
      <td data-label="Param" className="py-2.5 pl-3 pr-3 align-top">
        <code className="text-xs text-muted-foreground">{param.key || '—'}</code>
      </td>
      <td data-label="Type" className="py-2.5 pr-3 align-top">
        <div className="flex flex-wrap items-center gap-1">
          <Badge variant={param.kind} className="shrink-0">
            {BADGE_LABEL[param.kind]}
          </Badge>
          {param.encodingIssue && (
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-medium bg-amber-500/20 text-amber-600 dark:text-amber-400"
              title={param.encodingIssue.detail}
            >
              Encoding
            </span>
          )}
        </div>
      </td>
      <td data-label="Value" className="py-2.5 pr-3 align-top min-w-0 md:max-w-[200px]">
        {isEditing ? (
          <Input
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            onBlur={() => onCommitEdit(index)}
            onKeyDown={handleKeyDown}
            className="h-7 text-xs font-mono w-full"
            autoFocus
          />
        ) : (
          <>
            <button
              type="button"
              onClick={() => onOpenDetail(param)}
              className="md:hidden text-left w-full font-mono text-xs inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-ring rounded py-0.5 param-value-block"
            >
              {valueDisplay}
              <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
            </button>
            <div className="hidden md:block param-value-block">
              <Popover trigger={trigger} content={detailContent} />
            </div>
          </>
        )}
      </td>
      {(onReplaceParam || onRemoveParam) && (
        <td data-label="Actions" className="py-2.5 pr-3 align-top w-0">
          <div className="flex items-center gap-0.5">
            <ActionButton
              label={copied ? 'Copied' : 'Copy value'}
              title={copied ? 'Copied' : 'Copy this value to clipboard'}
              icon={copied ? Check : Copy}
              onClick={handleCopyValue}
            />
            {onReplaceParam && (
              <>
                <ActionButton
                  label="Edit value"
                  title="Edit this value inline"
                  icon={Pencil}
                  onClick={() => onStartEdit(index, param.decoded || param.value)}
                />
                <ActionButton
                  label="Generate same type"
                  title="Generate a new value of the same type (e.g. new UUID, new JWT)"
                  icon={Dices}
                  onClick={handleGenerate}
                  disabled={!canGen}
                />
              </>
            )}
            {onRemoveParam && (
              <ActionButton
                label="Remove parameter"
                title="Remove this parameter"
                icon={X}
                onClick={() => onRemoveParam(index)}
              />
            )}
          </div>
        </td>
      )}
    </motion.tr>
  );
}

export function ParamTable({
  params,
  emptyMessage = 'No parameters',
  onReplaceParam,
  onRemoveParam,
}: {
  params: AnalyzedParam[];
  emptyMessage?: string;
  onReplaceParam?: (index: number, newValue: string) => void;
  onRemoveParam?: (index: number) => void;
}) {
  const [sheetParam, setSheetParam] = useState<AnalyzedParam | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const openDetail = useCallback((param: AnalyzedParam) => {
    setSheetParam(param);
    setSheetOpen(true);
  }, []);

  const handleStartEdit = useCallback((index: number, value: string) => {
    setEditingIndex(index);
    setEditValue(value);
  }, []);

  const handleCommitEdit = useCallback(
    (index: number) => {
      if (onReplaceParam && editValue.trim() !== '') onReplaceParam(index, editValue.trim());
      setEditingIndex(null);
      setEditValue('');
    },
    [onReplaceParam, editValue]
  );

  const handleCancelEdit = useCallback(() => {
    setEditingIndex(null);
    setEditValue('');
  }, []);

  if (params.length === 0)
    return <p className="text-sm text-muted-foreground py-4">{emptyMessage}</p>;
  return (
    <>
      <table className="param-table-responsive w-full table-auto">
        <thead>
          <tr className="border-b-2 border-border text-muted-foreground">
            <th className="py-2 pl-3 pr-3 text-left font-medium text-xs">Param</th>
            <th className="py-2 pr-3 text-left font-medium text-xs">Type</th>
            <th className="py-2 pr-3 text-left font-medium text-xs">Value</th>
            {(onReplaceParam || onRemoveParam) && (
              <th className="py-2 pr-3 text-left font-medium text-xs w-0">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {params.map((param, i) => (
            <ParamTableRow
              key={param.key ? `${param.key}-${i}` : i}
              param={param}
              index={i}
              onOpenDetail={openDetail}
              onReplaceParam={onReplaceParam}
              onRemoveParam={onRemoveParam}
              editingIndex={editingIndex}
              editValue={editValue}
              onStartEdit={handleStartEdit}
              onEditChange={setEditValue}
              onCommitEdit={handleCommitEdit}
              onCancelEdit={handleCancelEdit}
            />
          ))}
        </tbody>
      </table>
      <DetailSheet param={sheetParam} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

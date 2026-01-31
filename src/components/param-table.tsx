'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Popover } from '@/components/ui/popover';
import { DetailSheet } from '@/components/detail-sheet';
import { ParamDetail } from '@/components/detectors/param-detail';
import type { AnalyzedParam } from '@/lib/analyzers';
import { BADGE_LABEL } from '@/lib/param-labels';

const MAX_VALUE_LEN = 48;

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return s.slice(0, max - 3) + '…';
}

function ParamTableRow({
  param,
  index,
  onOpenDetail,
}: {
  param: AnalyzedParam;
  index: number;
  onOpenDetail: (param: AnalyzedParam) => void;
}) {
  const valueDisplay = truncate(param.decoded || param.value, MAX_VALUE_LEN);

  const trigger = (
    <span
      className="font-mono text-xs break-all cursor-pointer inline-flex items-center gap-1 text-left"
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

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.02 }}
      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
    >
      <td className="py-2.5 pr-3 align-top">
        <code className="text-xs text-muted-foreground">{param.key || '—'}</code>
      </td>
      <td className="py-2.5 pr-3 align-top">
        <Badge variant={param.kind} className="shrink-0">
          {BADGE_LABEL[param.kind]}
        </Badge>
      </td>
      <td className="py-2.5 pr-3 align-top max-w-[200px]">
        <button
          type="button"
          onClick={() => onOpenDetail(param)}
          className="md:hidden text-left w-full font-mono text-xs break-all inline-flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-ring rounded py-0.5"
        >
          {valueDisplay}
          <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground" />
        </button>
        <div className="hidden md:block">
          <Popover trigger={trigger} content={detailContent} />
        </div>
      </td>
    </motion.tr>
  );
}

export function ParamTable({
  params,
  emptyMessage = 'No parameters',
}: {
  params: AnalyzedParam[];
  emptyMessage?: string;
}) {
  const [sheetParam, setSheetParam] = useState<AnalyzedParam | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openDetail = (param: AnalyzedParam) => {
    setSheetParam(param);
    setSheetOpen(true);
  };

  if (params.length === 0)
    return <p className="text-sm text-muted-foreground py-4">{emptyMessage}</p>;
  return (
    <>
      <table className="w-full table-auto">
        <thead>
          <tr className="border-b-2 border-border text-muted-foreground">
            <th className="py-2 pr-3 text-left font-medium text-xs">Param</th>
            <th className="py-2 pr-3 text-left font-medium text-xs">Type</th>
            <th className="py-2 pr-3 text-left font-medium text-xs">Value</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param, i) => (
            <ParamTableRow
              key={param.key ? `${param.key}-${i}` : i}
              param={param}
              index={i}
              onOpenDetail={openDetail}
            />
          ))}
        </tbody>
      </table>
      <DetailSheet param={sheetParam} open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </>
  );
}

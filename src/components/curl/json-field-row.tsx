'use client';

import { useState, useCallback, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { analyzeParam } from '@/lib/analyzers';
import type { AnalyzedParam } from '@/lib/analyzers';
import { PayloadParamTable } from './payload-param-table';
import { Badge } from '@/components/ui/badge';

interface JsonFieldRowProps {
  param: AnalyzedParam;
  path: string[];
  onReplaceField?: (path: string[], newValue: string) => void;
  originalFieldTypes?: Map<string, AnalyzedParam['kind']>;
}

export function JsonFieldRow({
  param,
  path,
  onReplaceField,
  originalFieldTypes = new Map(),
}: JsonFieldRowProps) {
  const jsonMeta = param.meta as { parsed: unknown; formatted: string } | null;

  const nestedFields = useMemo(() => {
    if (param.kind !== 'json' || !jsonMeta) return [];
    const parsed = jsonMeta.parsed;
    if (parsed != null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const entries = Object.entries(parsed as Record<string, unknown>);
      return entries.map(([key, v]) =>
        analyzeParam(key, typeof v === 'string' ? v : JSON.stringify(v))
      );
    }
    if (Array.isArray(parsed)) {
      return (parsed as unknown[]).map((v, index) =>
        analyzeParam(String(index), typeof v === 'string' ? v : JSON.stringify(v))
      );
    }
    return [];
  }, [param, jsonMeta]);

  const [isExpanded, setIsExpanded] = useState(nestedFields.length > 0);

  const updateNestedValue = useCallback(
    (obj: unknown, pathParts: string[], value: unknown): unknown => {
      if (pathParts.length === 0) return value;
      if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
      const [first, ...rest] = pathParts;
      const updated = { ...(obj as Record<string, unknown>) };
      updated[first] = updateNestedValue(updated[first], rest, value);
      return updated;
    },
    []
  );

  const handleReplace = useCallback(
    (index: number, newValue: string) => {
      if (!onReplaceField || !jsonMeta) return;
      const parsed = jsonMeta.parsed;
      if (parsed != null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const entries = Object.entries(parsed as Record<string, unknown>);
        const key = entries[index][0];
        let valueToSet: unknown = newValue;
        try {
          valueToSet = JSON.parse(newValue);
        } catch {
          const field = nestedFields[index];
          const originalKind = originalFieldTypes.get([...path, key].join('.')) || field?.kind;
          if (originalKind !== 'json') {
            valueToSet = newValue;
          }
        }
        const newJson = JSON.stringify(updateNestedValue(jsonMeta.parsed, [key], valueToSet), null, 2);
        onReplaceField(path, newJson);
      } else if (Array.isArray(parsed)) {
        const updated = [...parsed];
        let valueToSet: unknown = newValue;
        try {
          valueToSet = JSON.parse(newValue);
        } catch {
          const field = nestedFields[index];
          const originalKind = originalFieldTypes.get([...path, String(index)].join('.')) || field?.kind;
          if (originalKind !== 'json') {
            valueToSet = newValue;
          }
        }
        updated[index] = valueToSet;
        const newJson = JSON.stringify(updated, null, 2);
        onReplaceField(path, newJson);
      }
    },
    [onReplaceField, jsonMeta, nestedFields, path, originalFieldTypes, updateNestedValue]
  );

  const handleRemove = useCallback(
    (index: number) => {
      if (!onReplaceField || !jsonMeta) return;
      const parsed = jsonMeta.parsed;
      if (parsed != null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const entries = Object.entries(parsed as Record<string, unknown>);
        const filtered = entries.filter((_, i) => i !== index);
        const updated = Object.fromEntries(filtered);
        onReplaceField(path, JSON.stringify(updated, null, 2));
      } else if (Array.isArray(parsed)) {
        const updated = (parsed as unknown[]).filter((_, i) => i !== index);
        onReplaceField(path, JSON.stringify(updated, null, 2));
      }
    },
    [onReplaceField, jsonMeta, path]
  );

  const originalChildTypes = useMemo(() => {
    const map = new Map<number, AnalyzedParam['kind']>();
    for (let i = 0; i < nestedFields.length; i++) {
      const field = nestedFields[i];
      const fieldPathKey = [...path, field.key].join('.');
      map.set(i, originalFieldTypes.get(fieldPathKey) ?? field.kind);
    }
    return map;
  }, [nestedFields, originalFieldTypes, path]);

  if (nestedFields.length === 0) return null;

  return (
    <div className="border-l-2 border-border/50 pl-3 ml-2">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors mb-2 w-full text-left"
        aria-expanded={isExpanded}
      >
        {isExpanded ? (
          <ChevronDown className="h-3.5 w-3.5 shrink-0" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 shrink-0" />
        )}
        <code className="text-foreground">{param.key}</code>
        <Badge variant="json" className="shrink-0 text-[10px]">JSON</Badge>
        <span className="text-[10px] text-muted-foreground">({nestedFields.length} fields)</span>
      </button>
      <p className="text-[10px] text-muted-foreground mb-2 pl-5">
        Structured data (key–value pairs). Expand to see or edit nested fields.
      </p>
      {isExpanded && (
        <div className="mt-2">
          <div className="mb-1 pl-4">
            <PayloadParamTable
              params={nestedFields}
              emptyMessage=""
              onReplaceParam={handleReplace}
              onRemoveParam={handleRemove}
              onReplaceNestedField={(nestedPath, newJson) => {
                if (!onReplaceField) return;
                onReplaceField([...path, ...nestedPath], newJson);
              }}
              originalFieldTypes={originalChildTypes}
            />
          </div>
        </div>
      )}
    </div>
  );
}

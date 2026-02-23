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
          {nestedFields.map((field, index) => {
            const fieldPath = [...path, field.key];
            if (field.kind === 'json') {
              return (
                <JsonFieldRow
                  key={`${fieldPath.join('.')}-${index}`}
                  param={field}
                  path={fieldPath}
                  onReplaceField={onReplaceField}
                  originalFieldTypes={originalFieldTypes}
                />
              );
            }
            return (
              <div key={`${fieldPath.join('.')}-${index}`} className="mb-1 pl-4">
                <PayloadParamTable
                  params={[field]}
                  emptyMessage=""
                  onReplaceParam={(idx, val) => handleReplace(index, val)}
                  onReplaceNestedField={(nestedPath, newJson) => {
                    if (onReplaceField) {
                      const fullPath = [...path, ...nestedPath];
                      onReplaceField(fullPath, newJson);
                    }
                  }}
                  originalFieldTypes={new Map([[0, originalFieldTypes.get(fieldPath.join('.')) || field.kind]])}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { Pencil, Check, X, Dices, Maximize2 } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { Textarea } from '@/components/ui/textarea';
import { PayloadParamTable } from './payload-param-table';
import { detectJson, analyzeParam } from '@/lib/analyzers';
import { generateValue } from '@/lib/generators';
import { transformJsonForStructureSample } from '@/lib/json-structure-sample';
import { JsonSyntaxHighlight } from './json-syntax-highlight';
import { JsonFullscreenViewer } from './json-fullscreen-viewer';
import type { AnalyzedParam, ParamKind } from '@/lib/analyzers';

interface PayloadEditorProps {
  payload: {
    json: ReturnType<typeof detectJson> | null;
    fields: AnalyzedParam[];
    raw: string;
  };
  onReplace: (newPayload: string) => void;
  title?: string;
  onUseUrlAsInput?: (url: string) => void;
}

export function PayloadEditor({
  payload,
  onReplace,
  title = 'Payload',
  onUseUrlAsInput,
}: PayloadEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(payload.raw);
  const [originalFieldTypes, setOriginalFieldTypes] = useState<Map<number, AnalyzedParam['kind']>>(new Map());
  const [isJsonFullscreenOpen, setIsJsonFullscreenOpen] = useState(false);
  const [showStructureSample, setShowStructureSample] = useState(true);

  useEffect(() => {
    setShowStructureSample(true);
  }, [payload.raw]);

  useEffect(() => {
    setEditValue(payload.raw);
    if (payload.fields.length > 0 && originalFieldTypes.size === 0) {
      const types = new Map<number, AnalyzedParam['kind']>();
      payload.fields.forEach((field, index) => {
        types.set(index, field.kind);
      });
      setOriginalFieldTypes(types);
    }
  }, [payload.raw, payload.fields, originalFieldTypes.size]);

  const currentJson = useMemo(() => detectJson(editValue), [editValue]);
  const currentFields = useMemo(() => {
    if (!currentJson || !currentJson.valid) return [];
    const value = currentJson.parsed;
    if (value != null && typeof value === 'object' && !Array.isArray(value)) {
      const entries = Object.entries(value as Record<string, unknown>);
      return entries.map(([key, v]) =>
        analyzeParam(key, typeof v === 'string' ? v : JSON.stringify(v))
      );
    }
    if (Array.isArray(value)) {
      return (value as unknown[]).map((v, index) =>
        analyzeParam(String(index), typeof v === 'string' ? v : JSON.stringify(v))
      );
    }
    return [];
  }, [currentJson]);

  const handleStartEdit = useCallback(() => {
    setEditValue(payload.raw);
    setIsEditing(true);
  }, [payload.raw]);

  const handleCommitEdit = useCallback(() => {
    let trimmed = editValue.trim();
    const json = detectJson(trimmed);
    if (json && json.valid) {
      trimmed = json.formatted;
    }
    onReplace(trimmed);
    setIsEditing(false);
  }, [editValue, onReplace]);

  const handleCancelEdit = useCallback(() => {
    setEditValue(payload.raw);
    setIsEditing(false);
  }, [payload.raw]);

  const updateNestedValue = useCallback(
    (obj: unknown, path: string[], value: unknown): unknown => {
      if (path.length === 0) return value;
      if (obj == null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
      const [first, ...rest] = path;
      const updated = { ...(obj as Record<string, unknown>) };
      updated[first] = updateNestedValue(updated[first], rest, value);
      return updated;
    },
    []
  );

  const handleReplaceField = useCallback(
    (index: number, newValue: string) => {
      if (!payload.json || !payload.json.valid) return;
      const parsed = payload.json.parsed;
      const originalField = payload.fields[index];
      if (!originalField) return;
      
      const originalKind = originalFieldTypes.get(index) || originalField.kind;
      if (!originalFieldTypes.has(index)) {
        setOriginalFieldTypes((prev) => new Map(prev).set(index, originalField.kind));
      }
      
      if (parsed != null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const entries = Object.entries(parsed as Record<string, unknown>);
        const key = entries[index][0];
        let valueToSet: unknown = newValue;
        try {
          valueToSet = JSON.parse(newValue);
        } catch {
          if (originalKind !== 'json') {
            valueToSet = newValue;
          }
        }
        const updated = updateNestedValue(parsed, [key], valueToSet);
        onReplace(JSON.stringify(updated, null, 2));
      } else if (Array.isArray(parsed)) {
        const updated = [...parsed];
        let valueToSet: unknown = newValue;
        try {
          valueToSet = JSON.parse(newValue);
        } catch {
          if (originalKind !== 'json') {
            valueToSet = newValue;
          }
        }
        updated[index] = valueToSet;
        onReplace(JSON.stringify(updated, null, 2));
      }
    },
    [payload.json, payload.fields, originalFieldTypes, onReplace, updateNestedValue]
  );

  const handleReplaceNestedField = useCallback(
    (path: string[], newJson: string) => {
      if (!payload.json || !payload.json.valid) return;
      const parsed = payload.json.parsed;
      if (parsed == null || typeof parsed !== 'object' || Array.isArray(parsed)) return;
      
      let nestedValue: unknown;
      try {
        nestedValue = JSON.parse(newJson);
      } catch {
        return;
      }
      
      const updated = updateNestedValue(parsed, path, nestedValue);
      onReplace(JSON.stringify(updated, null, 2));
    },
    [payload.json, onReplace, updateNestedValue]
  );

  const handleRemoveField = useCallback(
    (index: number) => {
      if (!payload.json || !payload.json.valid) return;
      const parsed = payload.json.parsed;
      if (parsed != null && typeof parsed === 'object' && !Array.isArray(parsed)) {
        const entries = Object.entries(parsed as Record<string, unknown>);
        const filtered = entries.filter((_, i) => i !== index);
        const updated = Object.fromEntries(filtered);
        onReplace(JSON.stringify(updated, null, 2));
      } else if (Array.isArray(parsed)) {
        const updated = parsed.filter((_, i) => i !== index);
        onReplace(JSON.stringify(updated, null, 2));
      }
      setOriginalFieldTypes((prev) => {
        const next = new Map<number, ParamKind>();
        prev.forEach((kind, i) => {
          if (i < index) next.set(i, kind);
          if (i > index) next.set(i - 1, kind);
        });
        return next;
      });
    },
    [payload.json, onReplace]
  );

  const generateAllRecursive = useCallback((value: unknown, keyForAnalysis: string): unknown => {
    if (value === null || value === undefined) return value;
    if (typeof value === 'object' && !Array.isArray(value)) {
      const obj = value as Record<string, unknown>;
      const updated: Record<string, unknown> = {};
      for (const k of Object.keys(obj)) {
        updated[k] = generateAllRecursive(obj[k], k);
      }
      return updated;
    }
    if (Array.isArray(value)) {
      return (value as unknown[]).map((v, i) => generateAllRecursive(v, String(i)));
    }
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    const param = analyzeParam(keyForAnalysis, str);
    const generated = generateValue(param);
    try {
      return JSON.parse(generated);
    } catch {
      return generated;
    }
  }, []);

  const handleGenerateAll = useCallback(() => {
    if (!payload.json || !payload.json.valid || payload.fields.length === 0) return;
    const parsed = payload.json.parsed;
    if (parsed != null && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const updated = generateAllRecursive(parsed, '') as Record<string, unknown>;
      onReplace(JSON.stringify(updated, null, 2));
    } else if (Array.isArray(parsed)) {
      const updated = generateAllRecursive(parsed, '') as unknown[];
      onReplace(JSON.stringify(updated, null, 2));
    }
  }, [payload, onReplace, generateAllRecursive]);

  const displayJson = isEditing ? currentJson : payload.json;
  const displayFields = isEditing ? currentFields : payload.fields;

  const structureSample = useMemo(() => {
    if (!displayJson?.valid) return null;
    return transformJsonForStructureSample(displayJson.parsed);
  }, [displayJson]);

  const canShrinkStructure = structureSample?.applicable ?? false;

  const structureSampleFormatted = useMemo(() => {
    if (!structureSample?.applicable) return null;
    return JSON.stringify(structureSample.reduced, null, 2);
  }, [structureSample]);

  const visibleJsonText = useMemo(() => {
    if (!displayJson?.formatted) return '';
    if (showStructureSample && canShrinkStructure && structureSampleFormatted) {
      return structureSampleFormatted;
    }
    return displayJson.formatted;
  }, [
    displayJson,
    showStructureSample,
    canShrinkStructure,
    structureSampleFormatted,
  ]);

  return (
    <article className="rounded-lg border-2 border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">{title}</h2>
        {!isEditing && displayJson && (
          <div className="flex items-center gap-2">
            <CopyButton text={visibleJsonText} aria-label="Copy formatted JSON" />
            <button
              type="button"
              onClick={() => setIsJsonFullscreenOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Open fullscreen viewer"
              aria-label="Open fullscreen viewer"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleStartEdit}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Edit JSON"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            {displayFields.length > 0 && (
              <button
                type="button"
                onClick={handleGenerateAll}
                className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                title="Generate new values for all fields"
              >
                <Dices className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
        {!isEditing && !displayJson && (
          <div className="flex items-center gap-2">
            <CopyButton text={payload.raw} aria-label="Copy payload" />
            <button
              type="button"
              onClick={handleStartEdit}
              className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Edit payload"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="font-mono text-xs min-h-[120px]"
            autoFocus
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCommitEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              Save
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          {displayJson && canShrinkStructure && (
            <div className="flex items-center gap-2">
              <label
                className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground select-none"
                title="Keeps one element per array (recursively) so the shape stays clear for sharing with an LLM or documentation, without large repeated payloads."
              >
                <input
                  type="checkbox"
                  checked={showStructureSample}
                  onChange={(e) => setShowStructureSample(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border border-border bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                />
                <span>Structure sample</span>
              </label>
            </div>
          )}
          {displayJson ? (
            <pre className="overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs whitespace-pre break-all border border-border max-h-64 overflow-y-auto">
              <JsonSyntaxHighlight json={visibleJsonText} />
            </pre>
          ) : (
            <pre className="overflow-x-auto rounded bg-muted/50 p-3 font-mono text-xs whitespace-pre-wrap break-all border border-border max-h-64 overflow-y-auto">
              {payload.raw}
            </pre>
          )}
          {displayJson && (
            <JsonFullscreenViewer
              open={isJsonFullscreenOpen}
              json={visibleJsonText}
              onClose={() => setIsJsonFullscreenOpen(false)}
            />
          )}
          {displayFields.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium text-muted-foreground">Detected fields</span>
              </div>
              <div className="rounded-lg border-2 border-border overflow-hidden">
                <PayloadParamTable
                  params={displayFields}
                  emptyMessage="No fields"
                  onReplaceParam={handleReplaceField}
                  onRemoveParam={handleRemoveField}
                  onReplaceNestedField={handleReplaceNestedField}
                  originalFieldTypes={originalFieldTypes}
                  onUseUrlAsInput={onUseUrlAsInput}
                />
              </div>
            </div>
          )}
        </>
      )}
    </article>
  );
}

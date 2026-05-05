type WalkResult = { node: unknown; changed: boolean };

function walk(value: unknown): WalkResult {
  if (value === null || typeof value !== 'object') {
    return { node: value, changed: false };
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return { node: value, changed: false };
    }
    const inner = walk(value[0]);
    if (value.length > 1) {
      return { node: [inner.node], changed: true };
    }
    if (inner.changed) {
      return { node: [inner.node], changed: true };
    }
    return { node: value, changed: false };
  }

  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj);
  let childChanged = false;
  const out: Record<string, unknown> = {};

  for (const k of keys) {
    const r = walk(obj[k]);
    out[k] = r.node;
    if (r.changed) childChanged = true;
  }

  if (!childChanged) {
    return { node: value, changed: false };
  }
  return { node: out, changed: true };
}

export function transformJsonForStructureSample(value: unknown): {
  reduced: unknown;
  applicable: boolean;
} {
  const r = walk(value);
  return { reduced: r.node, applicable: r.changed };
}

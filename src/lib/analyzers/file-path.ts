const UNIX_PATH = /^\/[^\s*?<>|]*$/;
const WIN_PATH = /^[A-Za-z]:[\\/][^\s*?<>|]*$/;
const TRAVERSAL = /\.\./;

export interface FilePathResult {
  type: 'file_path';
  raw: string;
  style: 'unix' | 'windows';
  pathTraversalRisk: boolean;
}

export function detectFilePath(value: string): FilePathResult | null {
  const v = value.trim();
  if (v.length < 2) return null;
  const isUnix = UNIX_PATH.test(v);
  const isWin = WIN_PATH.test(v);
  if (!isUnix && !isWin) return null;
  const pathTraversalRisk = TRAVERSAL.test(v);
  return {
    type: 'file_path',
    raw: v,
    style: isUnix ? 'unix' : 'windows',
    pathTraversalRisk,
  };
}

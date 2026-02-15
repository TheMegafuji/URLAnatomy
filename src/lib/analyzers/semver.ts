const SEMVER_REGEX =
  /^v?(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/;

export interface SemverResult {
  type: 'semver';
  major: string;
  minor: string;
  patch: string;
  prerelease: string | null;
  build: string | null;
  raw: string;
}

export function detectSemver(value: string): SemverResult | null {
  const v = value.trim();
  if (!v) return null;
  const m = v.match(SEMVER_REGEX);
  if (!m) return null;
  return {
    type: 'semver',
    major: m[1],
    minor: m[2],
    patch: m[3],
    prerelease: m[4] ?? null,
    build: m[5] ?? null,
    raw: v,
  };
}

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function debounce<A extends unknown[]>(
  fn: (...args: A) => void,
  ms: number
): (...args: A) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: A) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), ms);
  };
}

const FIRST_URL_RE = /https?:\/\/[^\s<>"{}|\\^`[\]]+/i;

export function extractFirstUrl(text: string): string | null {
  const match = text.match(FIRST_URL_RE);
  if (!match) return null;
  return match[0].replace(/[.,;:!?)\]]+$/, '');
}

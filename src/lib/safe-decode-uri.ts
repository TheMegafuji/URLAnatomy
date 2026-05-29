/** decodeURIComponent that returns the input on malformed sequences instead of throwing. */
export function safeDecodeURIComponent(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

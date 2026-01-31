export interface ColorResult {
  type: 'color';
  raw: string;
  hex: string;
  rgb: { r: number; g: number; b: number };
  preview: boolean;
}

const HEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
const RGB = /^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/;
const RGBA = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\s*\)$/;

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const shorthand = hex.length === 4;
  const r = parseInt(shorthand ? hex[1] + hex[1] : hex.slice(1, 3), 16);
  const g = parseInt(shorthand ? hex[2] + hex[2] : hex.slice(3, 5), 16);
  const b = parseInt(shorthand ? hex[3] + hex[3] : hex.slice(5, 7), 16);
  return { r, g, b };
}

function normalizeHex(h: string): string {
  if (h.length === 4) return '#' + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
  return h;
}

export function detectColor(value: string): ColorResult | null {
  const v = value.trim();
  if (!v) return null;
  const hexMatch = v.match(HEX);
  if (hexMatch) {
    const hex = normalizeHex(v);
    return { type: 'color', raw: v, hex, rgb: hexToRgb(hex), preview: true };
  }
  const rgbMatch = v.match(RGB) ?? v.match(RGBA);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1], 10);
    const g = parseInt(rgbMatch[2], 10);
    const b = parseInt(rgbMatch[3], 10);
    if (r <= 255 && g <= 255 && b <= 255) {
      const hex = '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
      return { type: 'color', raw: v, hex, rgb: { r, g, b }, preview: true };
    }
  }
  return null;
}

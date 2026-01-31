import type { ParamKind } from '@/lib/analyzers';

export type BadgeVariant = ParamKind | 'default' | 'secondary' | 'outline';

const variants: Record<BadgeVariant, string> = {
  default: 'border-transparent bg-primary text-primary-foreground',
  secondary: 'border-transparent bg-secondary text-secondary-foreground',
  outline: 'text-foreground',
  jwt: 'border-transparent bg-violet-500/20 text-violet-400',
  timestamp: 'border-transparent bg-amber-500/20 text-amber-400',
  uuid: 'border-transparent bg-cyan-500/20 text-cyan-400',
  base64: 'border-transparent bg-emerald-500/20 text-emerald-400',
  json: 'border-transparent bg-blue-500/20 text-blue-400',
  hash: 'border-transparent bg-orange-500/20 text-orange-400',
  color: 'border-transparent bg-pink-500/20 text-pink-400',
  geo: 'border-transparent bg-teal-500/20 text-teal-400',
  xss: 'border-transparent bg-red-500/20 text-red-400',
  uri: 'border-transparent bg-muted text-muted-foreground',
};

export function Badge({
  className = '',
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: BadgeVariant }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors ${variants[variant] ?? variants.default} ${className}`}
      {...props}
    />
  );
}

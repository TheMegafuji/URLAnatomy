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
  sqli: 'border-transparent bg-red-500/20 text-red-400',
  credential: 'border-transparent bg-orange-500/20 text-orange-400',
  db_connection: 'border-transparent bg-rose-500/20 text-rose-400',
  crypto: 'border-transparent bg-emerald-500/20 text-emerald-400',
  'user-agent': 'border-transparent bg-slate-500/20 text-slate-400',
  marketing: 'border-transparent bg-amber-500/20 text-amber-400',
  pagination: 'border-transparent bg-indigo-500/20 text-indigo-400',
  sort: 'border-transparent bg-indigo-500/20 text-indigo-400',
  network: 'border-transparent bg-cyan-500/20 text-cyan-400',
  email: 'border-transparent bg-sky-500/20 text-sky-400',
  phone: 'border-transparent bg-green-500/20 text-green-400',
  locale: 'border-transparent bg-fuchsia-500/20 text-fuchsia-400',
  currency: 'border-transparent bg-yellow-500/20 text-yellow-400',
  number: 'border-transparent bg-blue-500/20 text-blue-400',
  semver: 'border-transparent bg-lime-500/20 text-lime-400',
  token_prefix: 'border-transparent bg-amber-500/20 text-amber-400',
  oauth: 'border-transparent bg-violet-500/20 text-violet-400',
  boolean: 'border-transparent bg-sky-500/20 text-sky-400',
  domain: 'border-transparent bg-indigo-500/20 text-indigo-400',
  mime: 'border-transparent bg-rose-500/20 text-rose-400',
  duration: 'border-transparent bg-amber-500/20 text-amber-400',
  hex: 'border-transparent bg-orange-500/20 text-orange-400',
  slug: 'border-transparent bg-emerald-500/20 text-emerald-400',
  cron: 'border-transparent bg-slate-500/20 text-slate-400',
  regex: 'border-transparent bg-purple-500/20 text-purple-400',
  file_path: 'border-transparent bg-zinc-500/20 text-zinc-400',
  authorization: 'border-transparent bg-blue-500/20 text-blue-400',
  request_id: 'border-transparent bg-sky-500/20 text-sky-400',
  webhook_signature: 'border-transparent bg-amber-500/20 text-amber-400',
  api_version: 'border-transparent bg-lime-500/20 text-lime-400',
  feature_flag: 'border-transparent bg-indigo-500/20 text-indigo-400',
  csrf: 'border-transparent bg-orange-500/20 text-orange-400',
  alt_id: 'border-transparent bg-cyan-500/20 text-cyan-400',
  mac: 'border-transparent bg-teal-500/20 text-teal-400',
  arn: 'border-transparent bg-amber-500/20 text-amber-400',
  url: 'border-transparent bg-violet-500/20 text-violet-400',
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

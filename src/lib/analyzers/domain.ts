const HOSTNAME_REGEX = /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)*[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i;
const INTERNAL = /\.(local|localhost|internal|lan|corp|localdomain)(\.|$)/i;
const SUSPICIOUS = /^(xn--|[\d.]+$)/;
const FILE_EXTENSIONS = /\.(html?|js|json|xml|css|txt|pdf|docx?|xlsx?|zip|tar|gz|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|mp4|mp3|avi|mov|webm|exe|dll|bin|sh|bat|cmd|ps1|py|java|rb|php|asp|aspx|jsp|rb|go|rs|cpp|c|h|hpp|ts|tsx|jsx|vue|svelte|scss|less|sass|md|yml|yaml|toml|ini|conf|config|env|log|sql|db|sqlite|mdb|bak|tmp|temp|old|backup|lock|pid|sock|pipe|fifo|lockfile)$/i;
const COMMON_TLDS = /\.(com|org|net|edu|gov|mil|int|co|io|ai|dev|app|tech|online|site|website|store|shop|blog|news|info|biz|name|pro|mobi|asia|tel|travel|jobs|xxx|aero|coop|museum|arpa|xxx|ac|ad|ae|af|ag|ai|al|am|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mf|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw)(\.|$)/i;

export interface DomainResult {
  type: 'domain';
  raw: string;
  root: string;
  subdomain: string | null;
  isInternal: boolean;
  isSuspicious: boolean;
}

function extractRoot(host: string): string {
  const parts = host.toLowerCase().split('.').filter(Boolean);
  if (parts.length >= 2) return parts.slice(-2).join('.');
  return host;
}

function extractSubdomain(host: string): string | null {
  const parts = host.toLowerCase().split('.').filter(Boolean);
  if (parts.length > 2) return parts.slice(0, -2).join('.');
  return null;
}

function looksLikeFile(value: string): boolean {
  return FILE_EXTENSIONS.test(value);
}

function hasValidTld(value: string): boolean {
  return COMMON_TLDS.test(value) || INTERNAL.test(value);
}

function looksLikeCodeOrId(value: string): boolean {
  const parts = value.split('.').filter(Boolean);
  if (parts.length === 0) return false;
  const allNumericParts = parts.every((p) => /^\d+$/.test(p));
  if (allNumericParts && parts.length >= 2) return true;
  const hasLongNumericParts = parts.some((p) => p.length > 8 && /^\d+$/.test(p));
  if (hasLongNumericParts) return true;
  const digitRatio = value.replace(/[.\s-]/g, '').replace(/\D/g, '').length / value.replace(/[.\s-]/g, '').length;
  if (digitRatio > 0.7 && value.length > 10) return true;
  if (value.includes('undefined') || value.includes('null')) return true;
  return false;
}

export function detectDomain(value: string): DomainResult | null {
  const v = value.trim().toLowerCase();
  if (!v || v.length < 4) return null;
  const clean = v.replace(/^https?:\/\//, '').split('/')[0]?.split('?')[0] ?? v;
  if (!clean.includes('.')) return null;
  if (looksLikeFile(clean)) return null;
  if (looksLikeCodeOrId(clean)) return null;
  if (!HOSTNAME_REGEX.test(clean)) return null;
  if (!hasValidTld(clean)) return null;
  const root = extractRoot(clean);
  const subdomain = extractSubdomain(clean);
  return {
    type: 'domain',
    raw: v,
    root,
    subdomain,
    isInternal: INTERNAL.test(clean),
    isSuspicious: SUSPICIOUS.test(clean),
  };
}

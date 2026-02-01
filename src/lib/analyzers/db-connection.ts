const DB_PROTOCOL_REGEX = /^(postgres|postgresql|mysql|mysql2|mongodb|redis|amqp|s3):\/\//i;

const AUTH_HOST = /^(?:([^:@]+):([^@]*)@)?([^\/:]+)(?::(\d+))?(?:\/(.*))?$/;

export interface DbConnectionResult {
  type: 'db_connection';
  protocol: string;
  username?: string;
  password?: string;
  host?: string;
  port?: string;
  database?: string;
  raw: string;
}

function parseAfterProtocol(rest: string): Omit<DbConnectionResult, 'type' | 'protocol' | 'raw'> {
  const decoded = tryDecode(rest);
  const m = decoded.match(AUTH_HOST);
  if (!m) return {};
  const [, user, pass, host, port, database] = m;
  return {
    username: user || undefined,
    password: pass !== undefined && pass !== '' ? pass : undefined,
    host: host || undefined,
    port: port || undefined,
    database: database !== undefined && database !== '' ? database : undefined,
  };
}

function tryDecode(s: string): string {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

export function detectDbConnection(value: string): DbConnectionResult | null {
  const v = value.trim();
  if (!v) return null;

  const match = v.match(DB_PROTOCOL_REGEX);
  if (!match) return null;

  const protocol = match[1].toLowerCase();
  const rest = v.slice(match[0].length);
  const parsed = parseAfterProtocol(rest);

  return {
    type: 'db_connection',
    protocol,
    ...parsed,
    raw: v,
  };
}

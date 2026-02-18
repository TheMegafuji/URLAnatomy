'use client';

function highlightJson(json: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let i = 0;
  const len = json.length;
  let current = '';
  let inString = false;
  let stringChar = '';
  let inNumber = false;
  let inKeyword = false;
  let keyCounter = 0;

  function flush() {
    if (!current) return;
    const key = `json-${keyCounter++}`;
    if (inString) {
      parts.push(
        <span key={key} className="text-green-600 dark:text-green-400">
          {current}
        </span>
      );
    } else if (inNumber) {
      parts.push(
        <span key={key} className="text-blue-600 dark:text-blue-400">
          {current}
        </span>
      );
    } else if (inKeyword) {
      parts.push(
        <span key={key} className="text-purple-600 dark:text-purple-400">
          {current}
        </span>
      );
    } else {
      parts.push(<span key={key} style={{ whiteSpace: 'pre' }}>{current}</span>);
    }
    current = '';
  }

  while (i < len) {
    const char = json[i];
    if (char === '\n' || char === '\r') {
      flush();
      parts.push(<span key={`json-${keyCounter++}`} style={{ whiteSpace: 'pre' }}>{char}</span>);
      i++;
      continue;
    }
    if (inString) {
      current += char;
      if (char === stringChar && json[i - 1] !== '\\') {
        flush();
        inString = false;
      }
    } else if (char === '"' || char === "'") {
      flush();
      inString = true;
      stringChar = char;
      current = char;
    } else if (/[0-9]/.test(char) || (char === '-' && /[0-9]/.test(json[i + 1]))) {
      if (!inNumber) {
        flush();
        inNumber = true;
      }
      current += char;
    } else if (/[a-z]/.test(char)) {
      if (inNumber && /[eE\.]/.test(char)) {
        current += char;
      } else {
        if (inNumber) {
          flush();
          inNumber = false;
        }
        if (!inKeyword && /^(true|false|null)$/.test(current + char)) {
          inKeyword = true;
          current += char;
        } else if (inKeyword) {
          current += char;
          if (!/^(true|false|null)$/.test(current)) {
            flush();
            inKeyword = false;
            current = char;
          }
        } else {
          current += char;
        }
      }
    } else {
      if (inNumber || inKeyword) {
        flush();
        inNumber = false;
        inKeyword = false;
      }
      flush();
      if (char === '{' || char === '}') {
        parts.push(
          <span key={`json-${keyCounter++}`} className="text-yellow-600 dark:text-yellow-400" style={{ whiteSpace: 'pre' }}>
            {char}
          </span>
        );
      } else if (char === '[' || char === ']') {
        parts.push(
          <span key={`json-${keyCounter++}`} className="text-orange-600 dark:text-orange-400" style={{ whiteSpace: 'pre' }}>
            {char}
          </span>
        );
      } else if (char === ':') {
        parts.push(
          <span key={`json-${keyCounter++}`} className="text-muted-foreground" style={{ whiteSpace: 'pre' }}>
            {char}
          </span>
        );
      } else if (char === ',') {
        parts.push(
          <span key={`json-${keyCounter++}`} className="text-muted-foreground" style={{ whiteSpace: 'pre' }}>
            {char}
          </span>
        );
      } else {
        current += char;
      }
    }
    i++;
  }
  flush();
  return parts;
}

export function JsonSyntaxHighlight({ json }: { json: string }) {
  return <>{highlightJson(json)}</>;
}

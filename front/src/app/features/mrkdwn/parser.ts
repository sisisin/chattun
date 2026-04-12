// mrkdwn AST node types
export type MrkdwnNode =
  | { type: 'text'; text: string }
  | { type: 'bold'; children: MrkdwnNode[] }
  | { type: 'italic'; children: MrkdwnNode[] }
  | { type: 'strike'; children: MrkdwnNode[] }
  | { type: 'code'; text: string }
  | { type: 'codeblock'; text: string }
  | { type: 'linebreak' };

export function parseMrkdwn(input: string): MrkdwnNode[] {
  const nodes: MrkdwnNode[] = [];
  let pos = 0;

  while (pos < input.length) {
    // Code block: ``` ... ```
    if (input.startsWith('```', pos)) {
      const endIndex = input.indexOf('```', pos + 3);
      if (endIndex !== -1) {
        nodes.push({ type: 'codeblock', text: input.slice(pos + 3, endIndex) });
        pos = endIndex + 3;
        continue;
      }
      // Unclosed code block: treat ``` as plain text and continue
      nodes.push({ type: 'text', text: '```' });
      pos += 3;
      continue;
    }

    // Inline code: ` ... ` (no newlines inside)
    if (input[pos] === '`') {
      const endIndex = findClosing(input, '`', pos + 1, true);
      if (endIndex !== -1) {
        nodes.push({ type: 'code', text: input.slice(pos + 1, endIndex) });
        pos = endIndex + 1;
        continue;
      }
    }

    // Formatting: *bold*, _italic_, ~strike~
    // Only at word boundary: preceded by non-word char or start of string
    if (isFormattingChar(input[pos]) && isAtOpenBoundary(input, pos)) {
      const marker = input[pos];
      const endIndex = findClosing(input, marker, pos + 1, true);
      if (endIndex !== -1 && isAtCloseBoundary(input, endIndex)) {
        const innerText = input.slice(pos + 1, endIndex);
        const children = parseInline(innerText);
        nodes.push(makeFormattingNode(marker, children));
        pos = endIndex + 1;
        continue;
      }
    }

    // Newline
    if (input[pos] === '\n') {
      nodes.push({ type: 'linebreak' });
      pos++;
      continue;
    }

    // Plain text: accumulate until next special char
    const textStart = pos;
    pos++;
    while (pos < input.length && !isSpecialAt(input, pos)) {
      pos++;
    }
    nodes.push({ type: 'text', text: input.slice(textStart, pos) });
  }

  return nodes;
}

function parseInline(input: string): MrkdwnNode[] {
  // Re-use the top-level parser for inline content (no code blocks expected inside formatting)
  return parseMrkdwn(input);
}

function isFormattingChar(ch: string): boolean {
  return ch === '*' || ch === '_' || ch === '~';
}

function isWordChar(ch: string): boolean {
  return /\w/.test(ch);
}

function isAtOpenBoundary(input: string, pos: number): boolean {
  if (pos === 0) return true;
  return !isWordChar(input[pos - 1]);
}

function isAtCloseBoundary(input: string, pos: number): boolean {
  if (pos + 1 >= input.length) return true;
  return !isWordChar(input[pos + 1]);
}

function findClosing(input: string, marker: string, start: number, noNewlines: boolean): number {
  for (let i = start; i < input.length; i++) {
    if (noNewlines && input[i] === '\n') return -1;
    // i > start: require at least one character of content (reject empty formatting like **)
    if (input[i] === marker && i > start) return i;
  }
  return -1;
}

function makeFormattingNode(marker: string, children: MrkdwnNode[]): MrkdwnNode {
  switch (marker) {
    case '*':
      return { type: 'bold', children };
    case '_':
      return { type: 'italic', children };
    case '~':
      return { type: 'strike', children };
    default:
      return { type: 'text', text: marker };
  }
}

function isSpecialAt(input: string, pos: number): boolean {
  const ch = input[pos];
  if (ch === '\n' || ch === '`') return true;
  if (isFormattingChar(ch) && isAtOpenBoundary(input, pos)) return true;
  if (input.startsWith('```', pos)) return true;
  return false;
}

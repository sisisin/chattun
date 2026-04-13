// mrkdwn AST node types
export type MrkdwnNode =
  | { type: 'text'; text: string }
  | { type: 'bold'; children: MrkdwnNode[] }
  | { type: 'italic'; children: MrkdwnNode[] }
  | { type: 'strike'; children: MrkdwnNode[] }
  | { type: 'code'; text: string }
  | { type: 'codeblock'; text: string }
  | { type: 'linebreak' }
  | { type: 'user_mention'; userId: string }
  | { type: 'channel_ref'; channelId: string; name: string }
  | { type: 'group_mention'; name: string }
  | { type: 'special_mention'; keyword: string }
  | { type: 'emoji'; name: string }
  | { type: 'link'; url: string; text: string | undefined };

export function parseMrkdwn(input: string): MrkdwnNode[] {
  const nodes: MrkdwnNode[] = [];
  let pos = 0;

  while (pos < input.length) {
    // Code block: ``` ... ```
    if (input.startsWith('```', pos)) {
      const endIndex = input.indexOf('```', pos + 3);
      if (endIndex !== -1) {
        nodes.push({
          type: 'codeblock',
          text: decodeSlackEntities(input.slice(pos + 3, endIndex)),
        });
        pos = endIndex + 3;
        continue;
      }
      // Unclosed code block: treat ``` as plain text and continue
      nodes.push({ type: 'text', text: '```' });
      pos += 3;
      continue;
    }

    // Angle bracket constructs: mentions, channel refs, links
    if (input[pos] === '<') {
      const endIndex = input.indexOf('>', pos + 1);
      if (endIndex !== -1) {
        const inner = input.slice(pos + 1, endIndex);
        const node = parseAngleBracket(inner);
        if (node) {
          nodes.push(node);
          pos = endIndex + 1;
          continue;
        }
      }
    }

    // Inline code: ` ... ` (no newlines inside)
    if (input[pos] === '`') {
      const endIndex = findClosing(input, '`', pos + 1, true);
      if (endIndex !== -1) {
        nodes.push({ type: 'code', text: decodeSlackEntities(input.slice(pos + 1, endIndex)) });
        pos = endIndex + 1;
        continue;
      }
    }

    // Emoji: :name: (alphanumeric, hyphens, underscores only)
    if (input[pos] === ':') {
      const emojiNode = tryParseEmoji(input, pos);
      if (emojiNode) {
        nodes.push(emojiNode.node);
        pos = emojiNode.end;
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
    nodes.push({ type: 'text', text: decodeSlackEntities(input.slice(textStart, pos)) });
  }

  return nodes;
}

function decodeSlackEntities(text: string): string {
  return text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

function parseInline(input: string): MrkdwnNode[] {
  return parseMrkdwn(input);
}

function parseAngleBracket(inner: string): MrkdwnNode | null {
  // User mention: @UID
  if (inner.startsWith('@')) {
    return { type: 'user_mention', userId: inner.slice(1) };
  }

  // Channel reference: #CID|name or #CID
  if (inner.startsWith('#')) {
    const pipeIndex = inner.indexOf('|');
    if (pipeIndex !== -1) {
      return {
        type: 'channel_ref',
        channelId: inner.slice(1, pipeIndex),
        name: inner.slice(pipeIndex + 1),
      };
    }
    return {
      type: 'channel_ref',
      channelId: inner.slice(1),
      name: inner.slice(1),
    };
  }

  // Special mention: !here, !channel
  // Group mention: !subteam^GROUPID|@name
  if (inner.startsWith('!')) {
    const content = inner.slice(1);
    if (content.startsWith('subteam^')) {
      const pipeIndex = content.indexOf('|');
      if (pipeIndex !== -1) {
        return { type: 'group_mention', name: content.slice(pipeIndex + 1) };
      }
    }
    return { type: 'special_mention', keyword: content };
  }

  // Link: url or url|text
  if (inner.includes('://') || inner.startsWith('mailto:')) {
    const pipeIndex = inner.indexOf('|');
    if (pipeIndex !== -1) {
      return { type: 'link', url: inner.slice(0, pipeIndex), text: inner.slice(pipeIndex + 1) };
    }
    return { type: 'link', url: inner, text: undefined };
  }

  return null;
}

function tryParseEmoji(input: string, pos: number): { node: MrkdwnNode; end: number } | null {
  // Emoji names: alphanumeric, hyphens, underscores, plus signs
  // Minimum 1 char, e.g. :+1:
  const emojiRegex = /^:([a-zA-Z0-9_+-]+):/;
  const match = emojiRegex.exec(input.slice(pos));
  if (match) {
    return {
      node: { type: 'emoji', name: match[1] },
      end: pos + match[0].length,
    };
  }
  return null;
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
  if (ch === '\n' || ch === '`' || ch === '<') return true;
  if (ch === ':' && tryParseEmoji(input, pos) !== null) return true;
  if (isFormattingChar(ch) && isAtOpenBoundary(input, pos)) return true;
  if (input.startsWith('```', pos)) return true;
  return false;
}

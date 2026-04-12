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

  // First, extract code blocks (``` ... ```)
  const codeBlockRegex = /```([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(...parseInline(input.slice(lastIndex, match.index)));
    }
    nodes.push({ type: 'codeblock', text: match[1] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    nodes.push(...parseInline(input.slice(lastIndex)));
  }

  return nodes;
}

function parseInline(input: string): MrkdwnNode[] {
  const nodes: MrkdwnNode[] = [];
  // Match inline code, bold, italic, strike, or newlines
  // Order matters: code first (to prevent inner parsing), then formatting
  const inlineRegex = /`([^`\n]+)`|\*([^*\n]+)\*|_([^_\n]+)_|~([^~\n]+)~|\n/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = inlineRegex.exec(input)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: 'text', text: input.slice(lastIndex, match.index) });
    }

    if (match[1] !== undefined) {
      // inline code
      nodes.push({ type: 'code', text: match[1] });
    } else if (match[2] !== undefined) {
      // bold
      nodes.push({ type: 'bold', children: parseInline(match[2]) });
    } else if (match[3] !== undefined) {
      // italic
      nodes.push({ type: 'italic', children: parseInline(match[3]) });
    } else if (match[4] !== undefined) {
      // strike
      nodes.push({ type: 'strike', children: parseInline(match[4]) });
    } else {
      // newline
      nodes.push({ type: 'linebreak' });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < input.length) {
    nodes.push({ type: 'text', text: input.slice(lastIndex) });
  }

  return nodes;
}

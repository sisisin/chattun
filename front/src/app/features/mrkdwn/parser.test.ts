import { parseMrkdwn } from './parser';

describe('parseMrkdwn', () => {
  describe('plain text', () => {
    it('parses plain text', () => {
      expect(parseMrkdwn('hello world')).toEqual([{ type: 'text', text: 'hello world' }]);
    });

    it('returns empty array for empty string', () => {
      expect(parseMrkdwn('')).toEqual([]);
    });
  });

  describe('bold', () => {
    it('parses *bold* text', () => {
      expect(parseMrkdwn('*bold*')).toEqual([
        { type: 'bold', children: [{ type: 'text', text: 'bold' }] },
      ]);
    });
  });

  describe('italic', () => {
    it('parses _italic_ text', () => {
      expect(parseMrkdwn('_italic_')).toEqual([
        { type: 'italic', children: [{ type: 'text', text: 'italic' }] },
      ]);
    });
  });

  describe('strikethrough', () => {
    it('parses ~strike~ text', () => {
      expect(parseMrkdwn('~strike~')).toEqual([
        { type: 'strike', children: [{ type: 'text', text: 'strike' }] },
      ]);
    });
  });

  describe('inline code', () => {
    it('parses `code` text', () => {
      expect(parseMrkdwn('`code`')).toEqual([{ type: 'code', text: 'code' }]);
    });

    it('does not parse formatting inside inline code', () => {
      expect(parseMrkdwn('`*not bold*`')).toEqual([{ type: 'code', text: '*not bold*' }]);
    });
  });

  describe('code block', () => {
    it('parses ```code block```', () => {
      expect(parseMrkdwn('```code block```')).toEqual([{ type: 'codeblock', text: 'code block' }]);
    });

    it('parses multiline code block', () => {
      expect(parseMrkdwn('```\nline1\nline2\n```')).toEqual([
        { type: 'codeblock', text: '\nline1\nline2\n' },
      ]);
    });

    it('does not parse formatting inside code block', () => {
      expect(parseMrkdwn('```*bold* _italic_```')).toEqual([
        { type: 'codeblock', text: '*bold* _italic_' },
      ]);
    });

    it('treats unclosed code block as plain text', () => {
      expect(parseMrkdwn('```unclosed code')).toEqual([
        { type: 'text', text: '```' },
        { type: 'text', text: 'unclosed code' },
      ]);
    });
  });

  describe('linebreak', () => {
    it('parses newline as linebreak', () => {
      expect(parseMrkdwn('hello\nworld')).toEqual([
        { type: 'text', text: 'hello' },
        { type: 'linebreak' },
        { type: 'text', text: 'world' },
      ]);
    });
  });

  describe('word boundary', () => {
    it('does not parse underscore in middle of word as italic', () => {
      expect(parseMrkdwn('foo_bar_baz')).toEqual([{ type: 'text', text: 'foo_bar_baz' }]);
    });

    it('does not parse asterisk in middle of expression as bold', () => {
      expect(parseMrkdwn('2*3*4')).toEqual([{ type: 'text', text: '2*3*4' }]);
    });

    it('does not parse tilde in middle of word as strike', () => {
      expect(parseMrkdwn('foo~bar~baz')).toEqual([{ type: 'text', text: 'foo~bar~baz' }]);
    });

    it('parses formatting after space', () => {
      expect(parseMrkdwn('hello *bold* world')).toEqual([
        { type: 'text', text: 'hello ' },
        { type: 'bold', children: [{ type: 'text', text: 'bold' }] },
        { type: 'text', text: ' world' },
      ]);
    });

    it('parses formatting at start of string', () => {
      expect(parseMrkdwn('*bold* text')).toEqual([
        { type: 'bold', children: [{ type: 'text', text: 'bold' }] },
        { type: 'text', text: ' text' },
      ]);
    });

    it('parses formatting at end of string', () => {
      expect(parseMrkdwn('text *bold*')).toEqual([
        { type: 'text', text: 'text ' },
        { type: 'bold', children: [{ type: 'text', text: 'bold' }] },
      ]);
    });
  });

  describe('nested formatting', () => {
    it('parses bold inside italic', () => {
      expect(parseMrkdwn('_hello *bold* world_')).toEqual([
        {
          type: 'italic',
          children: [
            { type: 'text', text: 'hello ' },
            { type: 'bold', children: [{ type: 'text', text: 'bold' }] },
            { type: 'text', text: ' world' },
          ],
        },
      ]);
    });
  });

  describe('user mention', () => {
    it('parses <@UID>', () => {
      expect(parseMrkdwn('<@U012AB3CD>')).toEqual([{ type: 'user_mention', userId: 'U012AB3CD' }]);
    });

    it('parses mention within text', () => {
      expect(parseMrkdwn('hello <@U123> world')).toEqual([
        { type: 'text', text: 'hello ' },
        { type: 'user_mention', userId: 'U123' },
        { type: 'text', text: ' world' },
      ]);
    });
  });

  describe('channel reference', () => {
    it('parses <#CID|name>', () => {
      expect(parseMrkdwn('<#C123ABC|general>')).toEqual([
        { type: 'channel_ref', channelId: 'C123ABC', name: 'general' },
      ]);
    });
  });

  describe('group mention', () => {
    it('parses <!subteam^GROUPID|@name>', () => {
      expect(parseMrkdwn('<!subteam^S123|@team-name>')).toEqual([
        { type: 'group_mention', name: '@team-name' },
      ]);
    });
  });

  describe('special mention', () => {
    it('parses <!here>', () => {
      expect(parseMrkdwn('<!here>')).toEqual([{ type: 'special_mention', keyword: 'here' }]);
    });

    it('parses <!channel>', () => {
      expect(parseMrkdwn('<!channel>')).toEqual([{ type: 'special_mention', keyword: 'channel' }]);
    });
  });

  describe('emoji', () => {
    it('parses :emoji_name:', () => {
      expect(parseMrkdwn(':thumbsup:')).toEqual([{ type: 'emoji', name: 'thumbsup' }]);
    });

    it('parses emoji within text', () => {
      expect(parseMrkdwn('hello :wave: world')).toEqual([
        { type: 'text', text: 'hello ' },
        { type: 'emoji', name: 'wave' },
        { type: 'text', text: ' world' },
      ]);
    });

    it('does not parse colons without closing', () => {
      expect(parseMrkdwn('time is 10:30')).toEqual([{ type: 'text', text: 'time is 10:30' }]);
    });

    it('does not parse emoji with spaces in name', () => {
      expect(parseMrkdwn(':not an emoji:')).toEqual([{ type: 'text', text: ':not an emoji:' }]);
    });
  });

  describe('link', () => {
    it('parses <url|text>', () => {
      expect(parseMrkdwn('<https://example.com|Example>')).toEqual([
        { type: 'link', url: 'https://example.com', text: 'Example' },
      ]);
    });

    it('parses <url> without text', () => {
      expect(parseMrkdwn('<https://example.com>')).toEqual([
        { type: 'link', url: 'https://example.com', text: undefined },
      ]);
    });
  });

  describe('mixed content', () => {
    it('parses text with multiple formatting types', () => {
      const result = parseMrkdwn('hello *bold* and _italic_ and `code`');
      expect(result).toEqual([
        { type: 'text', text: 'hello ' },
        { type: 'bold', children: [{ type: 'text', text: 'bold' }] },
        { type: 'text', text: ' and ' },
        { type: 'italic', children: [{ type: 'text', text: 'italic' }] },
        { type: 'text', text: ' and ' },
        { type: 'code', text: 'code' },
      ]);
    });

    it('parses text before and after code block', () => {
      const result = parseMrkdwn('before\n```code```\nafter');
      expect(result).toEqual([
        { type: 'text', text: 'before' },
        { type: 'linebreak' },
        { type: 'codeblock', text: 'code' },
        { type: 'linebreak' },
        { type: 'text', text: 'after' },
      ]);
    });
  });
});

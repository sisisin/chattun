const MOCK_CHANNEL = 'CMOCKCH001';
const MOCK_USER = 'UMOCKUSER';
const MOCK_TEAM = 'TMOCKTEAM';

function nowTs(): string {
  return (Date.now() / 1000).toFixed(6);
}

const presetFactories: Record<string, () => object> = {
  'simple-message': () => {
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: 'これはモックメッセージです',
      team: MOCK_TEAM,
      blocks: [
        {
          type: 'rich_text',
          block_id: `mock-block-${Date.now()}`,
          elements: [
            {
              type: 'rich_text_section',
              elements: [{ type: 'text', text: 'これはモックメッセージです' }],
            },
          ],
        },
      ],
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'message-with-image': () => {
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: '画像付きメッセージ',
      team: MOCK_TEAM,
      blocks: [
        {
          type: 'rich_text',
          block_id: `mock-block-${Date.now()}`,
          elements: [
            { type: 'rich_text_section', elements: [{ type: 'text', text: '画像付きメッセージ' }] },
          ],
        },
      ],
      files: [
        {
          id: `mock-file-${Date.now()}`,
          name: 'sample.png',
          filetype: 'png',
          mimetype: 'image/png',
          url_private: '/api/mock/assets/sample.png',
          thumb_360: '/api/mock/assets/sample.png',
          thumb_480: '/api/mock/assets/sample.png',
        },
      ],
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'reaction-added': () => {
    const ts = nowTs();
    return {
      type: 'reaction_added',
      user: MOCK_USER,
      reaction: 'thumbsup',
      item: {
        type: 'message',
        channel: MOCK_CHANNEL,
        ts,
      },
      item_user: MOCK_USER,
      event_ts: ts,
    };
  },

  'reaction-removed': () => {
    const ts = nowTs();
    return {
      type: 'reaction_removed',
      user: MOCK_USER,
      reaction: 'thumbsup',
      item: {
        type: 'message',
        channel: MOCK_CHANNEL,
        ts,
      },
      item_user: MOCK_USER,
      event_ts: ts,
    };
  },

  'message-changed': () => {
    const ts = nowTs();
    return {
      type: 'message',
      subtype: 'message_changed',
      channel: MOCK_CHANNEL,
      ts,
      event_ts: ts,
      message: {
        user: MOCK_USER,
        ts,
        text: '編集後のメッセージ',
        edited: { user: MOCK_USER, ts },
      },
    };
  },

  'message-deleted': () => {
    const deletedTs = nowTs();
    const ts = nowTs();
    return {
      type: 'message',
      subtype: 'message_deleted',
      channel: MOCK_CHANNEL,
      deleted_ts: deletedTs,
      ts,
      event_ts: deletedTs,
    };
  },

  'formatted-message': () => {
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: '*太字* _斜体_ ~取消線~ `インラインコード`\n```\nコードブロック\nconst x = 1;\n```',
      team: MOCK_TEAM,
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'message-with-mentions': () => {
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: '<@UMOCKUSER> さんへ\n<#CMOCKCH001|mock-general> で <!here> に通知します\nグループ: <!subteam^S12345|@mock-team>',
      team: MOCK_TEAM,
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'message-with-links': () => {
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: 'リンク: <https://example.com|Example Site> と <https://github.com>\nメール: <mailto:test@example.com|test@example.com>',
      team: MOCK_TEAM,
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'block-kit-rich': () => {
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: 'Block Kit テスト: 太字 斜体 取消線 コード リスト\n\n1. 番号付きリスト1\n2. 番号付きリスト2\n\n• 箇条書き1\n• 箇条書き2\n\n> 引用文です\n\nconst code = "preformatted";',
      team: MOCK_TEAM,
      blocks: [
        {
          type: 'rich_text',
          block_id: `mock-block-${Date.now()}`,
          elements: [
            {
              type: 'rich_text_section',
              elements: [
                { type: 'text', text: 'Block Kit テスト: ' },
                { type: 'text', text: '太字', style: { bold: true } },
                { type: 'text', text: ' ' },
                { type: 'text', text: '斜体', style: { italic: true } },
                { type: 'text', text: ' ' },
                { type: 'text', text: '取消線', style: { strike: true } },
                { type: 'text', text: ' ' },
                { type: 'text', text: 'コード', style: { code: true } },
                { type: 'text', text: ' ' },
                { type: 'text', text: '太字+斜体', style: { bold: true, italic: true } },
              ],
            },
            {
              type: 'rich_text_list',
              style: 'ordered',
              elements: [
                {
                  type: 'rich_text_section',
                  elements: [{ type: 'text', text: '番号付きリスト1' }],
                },
                {
                  type: 'rich_text_section',
                  elements: [{ type: 'text', text: '番号付きリスト2' }],
                },
              ],
            },
            {
              type: 'rich_text_list',
              style: 'bullet',
              elements: [
                {
                  type: 'rich_text_section',
                  elements: [{ type: 'text', text: '箇条書き1' }],
                },
                {
                  type: 'rich_text_section',
                  elements: [
                    { type: 'text', text: '箇条書き2 ' },
                    { type: 'text', text: '太字アイテム', style: { bold: true } },
                  ],
                },
              ],
            },
            {
              type: 'rich_text_quote',
              elements: [
                { type: 'text', text: 'これは引用文です。Block Kitで構造化されています。' },
              ],
            },
            {
              type: 'rich_text_preformatted',
              elements: [
                { type: 'text', text: 'const code = "preformatted";\nconsole.log(code);' },
              ],
            },
            {
              type: 'rich_text_section',
              elements: [
                { type: 'text', text: 'メンション: ' },
                { type: 'user', user_id: MOCK_USER },
                { type: 'text', text: ' チャンネル: ' },
                { type: 'channel', channel_id: MOCK_CHANNEL },
                { type: 'text', text: ' ブロードキャスト: ' },
                { type: 'broadcast', range: 'here' },
              ],
            },
            {
              type: 'rich_text_section',
              elements: [
                { type: 'text', text: '絵文字: ' },
                { type: 'emoji', name: 'wave', unicode: '1f44b' },
                { type: 'text', text: ' ' },
                { type: 'emoji', name: 'rocket', unicode: '1f680' },
                { type: 'text', text: ' リンク: ' },
                { type: 'link', url: 'https://example.com', text: 'Example Site' },
              ],
            },
          ],
        },
      ],
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'message-with-emojis': () => {
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: '標準絵文字 :wave: :fire: :rocket:\nカスタム絵文字 :thumbsup: :heart: :laughing:',
      team: MOCK_TEAM,
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'long-attachment': () => {
    const ts = nowTs();
    const lines = Array.from(
      { length: 60 },
      (_, i) =>
        `• <https://github.com/example/repo/pull/${1000 + i}|#${1000 + i}> by <https://github.com/user${i}|@user${i}>`,
    );
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: '<https://github.com/example/repo/pull/999>',
      team: MOCK_TEAM,
      blocks: [
        {
          type: 'rich_text',
          block_id: `mock-block-${Date.now()}`,
          elements: [
            {
              type: 'rich_text_section',
              elements: [{ type: 'link', url: 'https://github.com/example/repo/pull/999' }],
            },
          ],
        },
      ],
      attachments: [
        {
          id: 1,
          color: '36a64f',
          fallback: '#999 build: release',
          text: `Important\nUpon merging this pull request, a new Git tag will be automatically created.\n\n*What's Changed*\n\n*:sparkles: Features & Fixes*\n\n${lines.join('\n')}\n\n---\n\n_Change…`,
          title: '#999 build: release',
          title_link: 'https://github.com/example/repo/pull/999',
          footer: '<https://github.com/example/repo|example/repo>',
          mrkdwn_in: ['text'],
        },
      ],
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'attachment-with-image': () => {
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: '<https://example.slack.com/archives/C001/p1234567890>',
      team: MOCK_TEAM,
      blocks: [
        {
          type: 'rich_text',
          block_id: `mock-block-${Date.now()}`,
          elements: [
            {
              type: 'rich_text_section',
              elements: [
                { type: 'link', url: 'https://example.slack.com/archives/C001/p1234567890' },
              ],
            },
          ],
        },
      ],
      attachments: [
        {
          from_url: 'https://example.slack.com/archives/C001/p1234567890',
          is_msg_unfurl: true,
          id: 1,
          fallback: 'メッセージの引用',
          text: 'これは画像付きの引用メッセージです',
          author_name: 'Mock User',
          author_icon: '/api/mock/assets/sample.png',
          mrkdwn_in: ['text'],
          footer: 'Thread in Slack Conversation',
          files: [
            {
              id: `mock-file-${Date.now()}`,
              filetype: 'png',
              thumb_360: '/api/mock/assets/sample.png',
              url_private: '/api/mock/assets/sample.png',
            },
          ],
        },
      ],
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'message-with-video': () => {
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      client_msg_id: `mock-${Date.now()}`,
      text: '',
      team: MOCK_TEAM,
      subtype: 'file_share',
      files: [
        {
          id: `mock-video-${Date.now()}`,
          name: 'sample-video.mp4',
          filetype: 'mp4',
          mimetype: 'video/mp4',
          media_display_type: 'video',
          mp4: '/api/mock/assets/sample-video.mp4',
          url_private: '/api/mock/assets/sample-video.mp4',
          thumb_360: '/api/mock/assets/sample.png',
          thumb_video: '/api/mock/assets/sample.png',
        },
      ],
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },

  'threaded-reply': () => {
    const parentTs = nowTs();
    const ts = nowTs();
    return {
      type: 'message',
      user: MOCK_USER,
      ts,
      thread_ts: parentTs,
      client_msg_id: `mock-${Date.now()}`,
      text: 'スレッドへの返信です',
      team: MOCK_TEAM,
      blocks: [
        {
          type: 'rich_text',
          block_id: `mock-block-${Date.now()}`,
          elements: [
            {
              type: 'rich_text_section',
              elements: [{ type: 'text', text: 'スレッドへの返信です' }],
            },
          ],
        },
      ],
      channel: MOCK_CHANNEL,
      event_ts: ts,
      channel_type: 'channel',
    };
  },
};

export function getPreset(name: string, overrides?: Record<string, unknown>): object | undefined {
  const factory = presetFactories[name];
  if (!factory) return undefined;
  const event = factory();
  return overrides ? { ...event, ...overrides } : event;
}

export function listPresets(): string[] {
  return Object.keys(presetFactories);
}

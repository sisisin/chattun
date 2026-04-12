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

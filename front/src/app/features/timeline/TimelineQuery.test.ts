import { textToEmojified, toMention } from './TimelineQuery';
import type { Message } from 'app/features/slack/interface';

function makeMessage(text: string): Message {
  return { text, channel: 'C1', ts: '1', updatedAt: 0 } as Message;
}

describe('toMention', () => {
  const users = {
    U123: { profile: { display_name: 'alice' }, real_name: 'Alice' },
  } as any;

  it('highlights own mention', () => {
    const result = toMention(makeMessage('<@U123> hello'), users, 'U123');
    expect(result).toBe('<span class="mention-self">@alice</span> hello');
  });

  it('does not highlight other mention', () => {
    const result = toMention(makeMessage('<@U123> hello'), users, 'U999');
    expect(result).toBe('@alice hello');
  });

  it('highlights @channel', () => {
    const result = toMention(makeMessage('<!channel> test'), users);
    expect(result).toBe('<span class="mention-self">@channel</span> test');
  });

  it('highlights @here', () => {
    const result = toMention(makeMessage('<!here> test'), users);
    expect(result).toBe('<span class="mention-self">@here</span> test');
  });
});

describe('textToEmojified', () => {
  it('emojify basic-emoji text', () => {
    const actual = textToEmojified('prefix:fearful:', {});
    expect(actual).toBe('prefix😨');
  });

  it('emojify custom-emoji text', () => {
    const actual = textToEmojified('prefix:custom-emoji:', {
      'custom-emoji': 'example.com/custom-emoji.png',
    });
    expect(actual).toBe(
      'prefix<img class="tweet-contents-slack-emoji" src="example.com/custom-emoji.png" alt="custom-emoji">',
    );
  });
});

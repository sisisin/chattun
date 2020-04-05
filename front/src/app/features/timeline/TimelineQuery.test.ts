import { textToEmojified } from './TimelineQuery';

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

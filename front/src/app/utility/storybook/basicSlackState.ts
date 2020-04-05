import { SlackState } from 'app/features/slack/interface';
import { rowEmoji } from './mock_data/rowEmoji';
import { users } from './mock_data/rowUsers';
import { channels } from './mock_data/rowChannels';

export const basicSlackState: SlackState = {
  messagesByChannel: {},
  emojis: rowEmoji.emoji,
  users: users,
  channels: channels,
  markedByChannels: {},
  profile: {
    userId: 'MY_ID',
    domain: 'some_domain',
  },
};

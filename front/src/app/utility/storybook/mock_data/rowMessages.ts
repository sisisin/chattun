import { SlackEntity } from 'app/types/slack';
import { rowUsers } from './rowUsers';
import { rowChannels } from './rowChannels';

export const message: SlackEntity.Message.Basic = {
  suppress_notification: false,
  type: 'message',
  text: ':eyes:\n:sisisin:\n<http://example.com/>',
  user: rowUsers.members[1].id,
  team: 'some_team',
  user_team: 'some_team',
  source_team: 'some_team',
  channel: rowChannels.channels[0].id,
  ts: '1564416517.003400',
  event_ts: '1564416517.003400',
};

export const message2: SlackEntity.Message.Basic = {
  subtype: undefined,
  suppress_notification: false,
  type: 'message',
  text:
    '```\ncode block\n```\n\n`code`\n*bold*\n_ita_\n~strike~\n&gt; quote\n<https://github.com/sisisin>\n' +
    `<@${rowUsers.members[1].id}>`,
  user: rowUsers.members[1].id,
  team: 'some_team',
  user_team: 'some_team',
  source_team: 'some_team',
  channel: rowChannels.channels[0].id,
  ts: '1564417503.004800',
  event_ts: '1564417503.004800',
  reactions: [
    {
      count: 1,
      users: [rowUsers.members[1].id],
      name: 'sisisin',
    },
  ],
};

export const message3_edited: SlackEntity.Message.Basic = {
  suppress_notification: false,
  type: 'message',
  text: 'yay',
  user: rowUsers.members[1].id,
  team: 'some_team',
  user_team: 'some_team',
  source_team: 'some_team',
  channel: rowChannels.channels[0].id,
  ts: '1564417493.004800',
  edited: {
    user: '',
    ts: '1564417513.004800',
  },
  event_ts: '1564417513.004800',
};

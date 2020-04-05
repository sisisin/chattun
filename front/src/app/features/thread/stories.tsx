import { storiesOf } from '@storybook/react';
import { handle as slackHandle } from 'app/features/slack/interface';
import { SlackEntity } from 'app/types/slack';
import { basicSlackState } from 'app/utility/storybook/basicSlackState';
import { AppProvider } from 'app/utility/storybook/helpers';
import React from 'react';
import { handle } from './interface';
import { ThreadModule } from './module';

const msg: SlackEntity.Message.Basic = {
  type: 'message',
  text: 'hoge',
  user: 'tbd',
  team: 'tbd',
  user_team: 'tbd',
  source_team: 'tbd',
  channel: 'tbd',
  event_ts: '1564252119.000800',
  ts: '1564252119.000800',
};
handle.reset();

storiesOf('Thread', module).add('basic', () => {
  slackHandle.reset();
  slackHandle.reducer({
    ...basicSlackState,
    messagesByChannel: {
      [msg.channel]: {
        [msg.ts]: { ...msg, updatedAt: 0 },
      },
    },
  });
  handle.reducer({
    channelId: msg.channel!,
    ts: msg.ts,
  });

  return (
    <AppProvider>
      <ThreadModule />
    </AppProvider>
  );
});
